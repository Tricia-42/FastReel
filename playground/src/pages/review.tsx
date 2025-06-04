import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function ReviewPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isPublishing, setIsPublishing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Check for recorded audio from create page
  useEffect(() => {
    const recordedAudio = sessionStorage.getItem('recordedAudio');
    if (recordedAudio) {
      setAudioUrl(recordedAudio);
    }
  }, []);
  
  // Mock reel data - in real app, this would come from the generation process
  const [reelData] = useState({
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterUrl: 'https://picsum.photos/seed/review/400/600',
    caption: 'Just had an amazing conversation with Tricia about my garden memories! 🌻',
    duration: 30,
    generatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
    if (!isTestMode && status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark as published and redirect to feed
      localStorage.setItem('lastPublishedReel', JSON.stringify({
        ...reelData,
        publishedAt: new Date().toISOString(),
      }));
      
      router.push('/feed');
    } catch (error) {
      console.error('Error publishing reel:', error);
      setIsPublishing(false);
    }
  };

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard this reel?')) {
      router.push('/create');
    }
  };

  const handleEdit = () => {
    // In a real app, this would go to an edit page
    alert('Edit functionality coming soon!');
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Review Your Reel - Tricia</title>
        <meta name="description" content="Review and publish your AI-generated memory reel" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={handleDiscard}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h1 className="text-lg font-semibold">Review Your Reel</h1>
            
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-[9/16] max-h-[calc(100vh-200px)] mx-auto bg-gray-900">
          <video
            src={reelData.videoUrl}
            poster={reelData.posterUrl}
            controls
            className="w-full h-full object-contain"
          />
          
          {/* Duration badge */}
          <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded text-sm">
            {Math.floor(reelData.duration / 60)}:{(reelData.duration % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Audio Preview (if available) */}
        {audioUrl && (
          <div className="p-4 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-2">Your recorded audio:</p>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Caption */}
        <div className="p-4">
          <textarea
            value={reelData.caption}
            onChange={(e) => {
              // In real app, update caption
              console.log('Caption updated:', e.target.value);
            }}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white resize-none"
            rows={3}
            placeholder="Add a caption..."
          />
        </div>

        {/* Tags */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {['#memories', '#garden', '#tricia'].map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
            <button className="px-3 py-1 border border-gray-700 rounded-full text-sm hover:bg-gray-800">
              + Add tag
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4">
          <div className="flex gap-3 max-w-md mx-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDiscard}
              className="flex-1 py-3 bg-gray-800 rounded-full font-medium hover:bg-gray-700 transition-colors"
              disabled={isPublishing}
            >
              Discard
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePublish}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publishing...
                </span>
              ) : (
                'Publish'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
} 