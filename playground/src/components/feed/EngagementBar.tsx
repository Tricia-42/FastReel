import { useState } from 'react';
import { Reel } from '@/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useMockData } from '@/hooks/useMockData';

interface EngagementBarProps {
  reel: Reel;
}

export const EngagementBar = ({ reel }: EngagementBarProps) => {
  const [isLiked, setIsLiked] = useState(reel.isLiked || false);
  const [likes, setLikes] = useState(reel.likeCount);
  const [showHeart, setShowHeart] = useState(false);
  const router = useRouter();
  const { likeReel, getUser } = useMockData();
  
  // Get user data for share message
  const user = getUser(reel.userId);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(newIsLiked ? likes + 1 : likes - 1);
    
    if (newIsLiked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }

    // Use mock data provider
    likeReel(reel.id);
  };

  const handleComment = () => {
    router.push(`/reel/${reel.id}?comments=true`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this reel by ${user?.displayName || 'a user'}`,
          text: reel.caption,
          url: `${window.location.origin}/reel/${reel.id}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/reel/${reel.id}`);
      // TODO: Show toast notification
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <>
      {/* Heart animation overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showHeart ? 1 : 0, 
          scale: showHeart ? [0, 1.5, 1.2] : 0 
        }}
        transition={{ duration: 0.5 }}
      >
        <svg className="w-32 h-32 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>

      {/* Engagement buttons */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-10">
        {/* Like button */}
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-3 rounded-full ${isLiked ? 'bg-red-500/20' : 'bg-white/10'}`}>
            <svg 
              className={`w-7 h-7 ${isLiked ? 'text-red-500' : 'text-white'}`} 
              fill={isLiked ? 'currentColor' : 'none'} 
              stroke={!isLiked ? 'currentColor' : 'none'}
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="text-white text-xs font-medium">{formatCount(likes)}</span>
        </motion.button>

        {/* Comment button */}
        <motion.button
          onClick={handleComment}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 rounded-full bg-white/10">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
          </div>
          <span className="text-white text-xs font-medium">{formatCount(reel.commentCount)}</span>
        </motion.button>

        {/* Share button */}
        <motion.button
          onClick={handleShare}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 rounded-full bg-white/10">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.658a3 3 0 10-5.266 2.684 3 3 0 005.266-2.684zm0-9.316a3 3 0 10-5.266-2.684 3 3 0 005.266 2.684z" />
            </svg>
          </div>
          <span className="text-white text-xs font-medium">{formatCount(reel.shareCount)}</span>
        </motion.button>

        {/* More options */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 rounded-full bg-white/10">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
        </motion.button>
      </div>
    </>
  );
}; 