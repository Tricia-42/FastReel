import { useState, useRef, useEffect } from 'react';
import { Reel } from '@/types';
import { ReelPlayer } from './ReelPlayer';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedViewProps {
  reels: Reel[];
}

export const FeedView = ({ reels }: FeedViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex < reels.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length]);

  // Handle touch events for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50;
    const isSwipeDown = distance < -50;

    if (isSwipeUp && currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isSwipeDown && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <AnimatePresence mode="wait">
        {reels.map((reel, index) => (
          <motion.div
            key={reel.id}
            className="absolute inset-0"
            initial={{ y: index > currentIndex ? '100%' : '-100%' }}
            animate={{ 
              y: index === currentIndex ? 0 : index > currentIndex ? '100%' : '-100%',
            }}
            exit={{ y: index > currentIndex ? '100%' : '-100%' }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              mass: 0.5
            }}
            style={{ zIndex: reels.length - Math.abs(index - currentIndex) }}
          >
            <ReelPlayer 
              reel={reel} 
              isActive={index === currentIndex}
              onNext={() => {
                if (currentIndex < reels.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                }
              }}
              onPrevious={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                }
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 z-50">
        {reels.map((_, index) => (
          <div
            key={index}
            className={`h-1 transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-white' : 'w-1 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Navigation hints */}
      {currentIndex > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] z-50">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/50 text-sm"
          >
            ↑ Previous
          </motion.div>
        </div>
      )}
      
      {currentIndex < reels.length - 1 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[150%] z-50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/50 text-sm"
          >
            ↓ Next
          </motion.div>
        </div>
      )}
    </div>
  );
}; 