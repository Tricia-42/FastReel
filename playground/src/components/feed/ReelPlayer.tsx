import { useEffect, useRef, useState } from 'react';
import { Reel, User } from '@/types';
import { EngagementBar } from './EngagementBar';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useMockData } from '@/hooks/useMockData';

interface ReelPlayerProps {
  reel: Reel;
  isActive: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ReelPlayer = ({ reel, isActive, onNext, onPrevious }: ReelPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const router = useRouter();
  const { getUser } = useMockData();
  
  // Get user data for this reel
  const user = getUser(reel.userId);

  // Auto-play/pause based on active state
  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  // Reset video when becoming active
  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(true);
    }
  }, [isActive]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoClick = () => {
    togglePlayPause();
    setShowControls(true);
    setTimeout(() => setShowControls(false), 2000);
  };

  const goToProfile = () => {
    router.push(`/profile/${reel.userId}`);
  };

  const goToChat = () => {
    router.push(`/chat/${reel.chatId}`);
  };

  return (
    <div className="relative h-full w-full bg-black">
      {/* Video Player */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.posterUrl}
          className="h-full w-full object-contain"
          loop
          playsInline
          muted // Start muted for autoplay to work
          onClick={handleVideoClick}
        />
      </div>

      {/* Play/Pause Overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
      >
        <div className="bg-black/50 rounded-full p-4">
          {isPlaying ? (
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </motion.div>

      {/* User Info Overlay */}
      <div className="absolute bottom-20 left-4 right-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* User Profile */}
          <div className="flex items-center gap-3 mb-4">
            <button onClick={goToProfile} className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                {user && (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <span className="text-white font-semibold">{user?.displayName || 'Unknown'}</span>
            </button>
            <button className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Follow
            </button>
          </div>

          {/* Caption */}
          <p className="text-white text-sm mb-2">{reel.caption}</p>

          {/* Music Info */}
          {reel.musicName && (
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <span>{reel.musicName} - {reel.musicArtist}</span>
            </div>
          )}

          {/* AI Chat Link */}
          <button
            onClick={goToChat}
            className="mt-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            View AI Chat
          </button>
        </motion.div>
      </div>

      {/* Engagement Bar */}
      <EngagementBar reel={reel} />

      {/* Navigation Areas */}
      <button
        className="absolute top-0 left-0 w-1/2 h-full"
        onClick={onPrevious}
        aria-label="Previous reel"
      />
      <button
        className="absolute top-0 right-0 w-1/2 h-full"
        onClick={onNext}
        aria-label="Next reel"
      />
    </div>
  );
}; 