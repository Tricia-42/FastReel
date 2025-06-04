import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProfileRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      router.replace(`/profile/${session.user.id}`);
    } else if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-white">Loading...</div>
    </div>
  );
} 