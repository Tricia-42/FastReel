import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FeedView } from '@/components/feed/FeedView';
import { Reel } from '@/types';
import { useMockData } from '@/hooks/useMockData';

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { getFeed } = useMockData();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();

  useEffect(() => {
    const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
    if (!isTestMode && status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const { reels: feedReels, nextCursor: cursor } = getFeed();
        setReels(feedReels);
        setNextCursor(cursor);
      } catch (error) {
        console.error('Error fetching reels:', error);
      } finally {
        setLoading(false);
      }
    };

    const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
    if (session || isTestMode) {
      fetchReels();
    }
  }, [session, getFeed]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tricia Feed - AI Memory Reels</title>
        <meta name="description" content="Discover AI-generated memory reels" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <main className="h-screen bg-black overflow-hidden">
        <FeedView reels={reels} />
      </main>
    </>
  );
} 