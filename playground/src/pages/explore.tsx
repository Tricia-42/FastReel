import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/navigation/BottomNav';
import { useMockData } from '@/hooks/useMockData';
import { Topic } from '@/types';

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  gray: 'bg-gray-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
};

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { getTopics } = useMockData();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
    if (!isTestMode && status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        const topicsData = getTopics();
        setTopics(topicsData);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
    if (session || isTestMode) {
      fetchTopics();
    }
  }, [session, getTopics]);

  const handleTopicClick = (topic: Topic) => {
    // Navigate to feed with topic filter
    router.push(`/feed?topic=${encodeURIComponent(topic.name)}`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading topics...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Explore Topics - Tricia</title>
        <meta name="description" content="Explore memory topics and discover reels" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="min-h-screen bg-black text-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Explore Topics</h1>
            
            <button className="p-2 hover:bg-gray-800 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {topics.map((topic, index) => (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTopicClick(topic)}
                className={`relative overflow-hidden rounded-2xl p-6 text-left ${
                  colorClasses[topic.color] || 'bg-gray-700'
                } bg-opacity-20 backdrop-blur-sm border border-white/10`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 ${colorClasses[topic.color]} opacity-10`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{topic.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{topic.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">{topic.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
                    </svg>
                    <span>{topic.reelCount.toLocaleString()} reels</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Trending Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Trending Now</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {['#memories', '#family', '#recipes', '#wartime', '#childhood'].map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/feed?tag=${encodeURIComponent(tag)}`)}
                  className="px-4 py-2 bg-gray-800 rounded-full text-sm whitespace-nowrap hover:bg-gray-700 transition-colors"
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Featured Creators */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Featured Storytellers</h2>
            <div className="space-y-3">
              {[
                    { name: 'Mary Williams', handle: '@marywilliams', followers: '2.1K', avatar: 'https://picsum.photos/seed/mary/200' },
    { name: 'Robert Smith', handle: '@robertsmith', followers: '1.8K', avatar: 'https://picsum.photos/seed/robert/200' },
    { name: 'Helen Davis', handle: '@helendavis', followers: '1.5K', avatar: 'https://picsum.photos/seed/helen/200' },
              ].map((creator, index) => (
                <motion.button
                  key={creator.handle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/profile/${creator.handle.slice(1)}`)}
                  className="flex items-center gap-3 w-full p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{creator.name}</div>
                    <div className="text-sm text-gray-400">{creator.handle}</div>
                  </div>
                  <div className="text-sm text-gray-400">{creator.followers} followers</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
} 