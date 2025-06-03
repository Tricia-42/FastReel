import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, syncFirebaseAuth } from '@/lib/firebase-client';

export function useFirebaseAuth() {
  const { data: session, status } = useSession();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Sync Firebase Auth when NextAuth session changes
  useEffect(() => {
    if (status === 'loading') return;

    const syncAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const user = await syncFirebaseAuth(session);
        setFirebaseUser(user);
      } catch (err) {
        console.error('Error syncing Firebase auth:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    syncAuth();
  }, [session, status]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log('Firebase auth state changed:', user?.uid || 'signed out');
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, []);

  return {
    firebaseUser,
    isLoading,
    error,
    isAuthenticated: !!firebaseUser,
  };
} 