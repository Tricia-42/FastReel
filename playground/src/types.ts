// Core data types for the TikTok-like AI chat platform

export interface Reel {
  id: string;
  userId: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  createdAt: string;
  duration: number;
  chatId?: string;
  tags?: string[];
  musicName?: string;
  musicArtist?: string;
  isLiked?: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  reelCount: number;
  isFollowing?: boolean;
  isVerified?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  reelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  reelCount: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  roomName: string;
  participantName: string;
  startedAt: string;
  endedAt?: string;
  transcription?: string;
  journalContent?: {
    title: string;
    text: string;
    images: string[];
  };
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  reelId?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
} 