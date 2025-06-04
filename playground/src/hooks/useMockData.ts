import { useState, useCallback } from 'react';
import reelsData from '@/mocks/reels.json';
import usersData from '@/mocks/users.json';
import topicsData from '@/mocks/topics.json';
import { Reel, User, Topic, Comment } from '@/types';

export const useMockData = () => {
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set(['reel_002']));
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set(['user_002']));

  // Get paginated feed
  const getFeed = useCallback((cursor?: string, limit = 10): { reels: Reel[], nextCursor?: string } => {
    const startIndex = cursor ? parseInt(cursor) : 0;
    const endIndex = startIndex + limit;
    
    // Map reels with current like status
    const reels = reelsData.slice(startIndex, endIndex).map(reel => ({
      ...reel,
      isLiked: likedReels.has(reel.id)
    }));
    
    const hasMore = endIndex < reelsData.length;
    
    return {
      reels,
      nextCursor: hasMore ? endIndex.toString() : undefined
    };
  }, [likedReels]);

  // Get user by ID
  const getUser = useCallback((userId: string): User | undefined => {
    const user = usersData.find(u => u.id === userId);
    if (user) {
      return {
        ...user,
        isFollowing: followingUsers.has(user.id)
      };
    }
    return undefined;
  }, [followingUsers]);

  // Get user's reels
  const getUserReels = useCallback((userId: string): Reel[] => {
    return reelsData
      .filter(reel => reel.userId === userId)
      .map(reel => ({
        ...reel,
        isLiked: likedReels.has(reel.id)
      }));
  }, [likedReels]);

  // Like/unlike a reel
  const likeReel = useCallback((reelId: string) => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
        console.log('Unliked reel:', reelId);
      } else {
        newSet.add(reelId);
        console.log('Liked reel:', reelId);
      }
      return newSet;
    });
  }, []);

  // Follow/unfollow a user
  const followUser = useCallback((userId: string) => {
    setFollowingUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
        console.log('Unfollowed user:', userId);
      } else {
        newSet.add(userId);
        console.log('Followed user:', userId);
      }
      return newSet;
    });
  }, []);

  // Get topics for explore page
  const getTopics = useCallback((): Topic[] => {
    return topicsData;
  }, []);

  // Get reels by topic
  const getReelsByTopic = useCallback((topicName: string): Reel[] => {
    // Simple keyword matching on caption
    const keyword = topicName.toLowerCase();
    return reelsData
      .filter(reel => 
        reel.caption.toLowerCase().includes(keyword) ||
        reel.tags?.some(tag => tag.toLowerCase().includes(keyword))
      )
      .map(reel => ({
        ...reel,
        isLiked: likedReels.has(reel.id)
      }));
  }, [likedReels]);

  // Mock comments
  const getComments = useCallback((reelId: string): Comment[] => {
    // Generate some mock comments
    return [
      {
        id: `comment_${reelId}_1`,
        reelId,
        userId: 'user_002',
        userName: 'Mike Chen',
        userAvatar: 'https://picsum.photos/seed/user002/200',
        text: 'Beautiful memories! Thanks for sharing 💕',
        likeCount: 12,
        isLiked: false,
        createdAt: new Date().toISOString(),
        replies: []
      },
      {
        id: `comment_${reelId}_2`,
        reelId,
        userId: 'user_003',
        userName: 'Mary Williams',
        userAvatar: 'https://picsum.photos/seed/user003/200',
        text: 'This brings back so many memories!',
        likeCount: 5,
        isLiked: true,
        createdAt: new Date().toISOString(),
        replies: []
      }
    ];
  }, []);

  // Add comment
  const addComment = useCallback((reelId: string, text: string) => {
    console.log('Adding comment to reel:', reelId, 'Text:', text);
    // In real app, this would update state or call API
  }, []);

  // Share reel
  const shareReel = useCallback((reelId: string) => {
    console.log('Sharing reel:', reelId);
    // In real app, this would trigger share dialog
  }, []);

  return {
    getFeed,
    getUser,
    getUserReels,
    likeReel,
    followUser,
    getTopics,
    getReelsByTopic,
    getComments,
    addComment,
    shareReel,
  };
}; 