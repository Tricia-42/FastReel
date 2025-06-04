import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/navigation/BottomNav';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  reelsCount: number;
  isFollowing: boolean;
}

// Mock data - replace with API calls
const mockProfile: UserProfile = {
  id: 'user1',
  name: 'Sarah Johnson',
  username: '@sarahjohnson',
  avatar: 'https://picsum.photos/seed/profile1/200',
  bio: 'Sharing my memories with AI 🎬 | Grandmother of 5 | Love gardening 🌻',
  followers: 1234,
  following: 567,
  reelsCount: 42,
  isFollowing: false,
};

export default function ProfilePage() {
  const router = useRouter();
  const { userId } = router.query;
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userId) {
      // TODO: Fetch user profile from API
      setTimeout(() => {
        setProfile(mockProfile);
        setIsFollowing(mockProfile.isFollowing);
        setLoading(false);
      }, 500);
    }
  }, [userId]);

  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
    // TODO: Call API to follow/unfollow
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">User not found</div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === userId;

  return (
    <>
      <Head>
        <title>{profile.name} - Tricia Profile</title>
        <meta name="description" content={profile.bio} />
      </Head>
      
      <div className="min-h-screen bg-black text-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h1 className="text-lg font-semibold">{profile.username}</h1>
            
            <button className="p-2 hover:bg-gray-800 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-24 h-24">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-400 text-sm">{profile.username}</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm mb-4 whitespace-pre-wrap">{profile.bio}</p>

          {/* Stats */}
          <div className="flex gap-6 mb-4">
            <div className="text-center">
              <div className="font-bold text-lg">{formatCount(profile.reelsCount)}</div>
              <div className="text-gray-400 text-sm">Reels</div>
            </div>
            <button className="text-center">
              <div className="font-bold text-lg">{formatCount(profile.followers)}</div>
              <div className="text-gray-400 text-sm">Followers</div>
            </button>
            <button className="text-center">
              <div className="font-bold text-lg">{formatCount(profile.following)}</div>
              <div className="text-gray-400 text-sm">Following</div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isOwnProfile ? (
              <>
                <button className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium">
                  Edit Profile
                </button>
                <button className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium">
                  Share Profile
                </button>
              </>
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFollow}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isFollowing
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-cyan-500 hover:bg-cyan-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </motion.button>
                <button className="py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium">
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mt-4">
          <div className="flex">
            <button className="flex-1 py-3 border-b-2 border-cyan-500 font-medium">
              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
              </svg>
            </button>
            <button className="flex-1 py-3 text-gray-400">
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-3 gap-1 p-1">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.95 }}
              className="relative aspect-[9/16] bg-gray-900 rounded overflow-hidden cursor-pointer"
              onClick={() => router.push(`/feed?reel=${i}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                <span>{Math.floor(Math.random() * 1000)}K</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </>
  );
} 