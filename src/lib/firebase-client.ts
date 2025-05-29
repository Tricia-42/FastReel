import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithCustomToken, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Sync NextAuth session with Firebase Auth
 */
export async function syncFirebaseAuth(session: any) {
  if (session?.firebaseToken) {
    try {
      // Sign in to Firebase with custom token
      const userCredential = await signInWithCustomToken(auth, session.firebaseToken);
      // console.log('Firebase Auth synced for user:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in with custom token:', error);
      throw error;
    }
  } else {
    // No session, sign out of Firebase
    await signOut(auth);
    // console.log('Signed out of Firebase Auth');
    return null;
  }
} 