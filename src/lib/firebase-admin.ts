import * as admin from 'firebase-admin';

// Check if Firebase Admin credentials are available
const hasFirebaseCredentials = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

let isInitialized = false;

// Initialize Firebase Admin SDK only if credentials are available
if (!admin.apps.length && hasFirebaseCredentials) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') as string,
      }),
    });
    isInitialized = true;
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
} else if (!hasFirebaseCredentials) {
  console.warn('Firebase Admin credentials not found. Firebase features will be disabled.');
}

export const adminAuth = isInitialized ? admin.auth() : null;
export const adminDb = isInitialized ? admin.firestore() : null;

/**
 * Creates or gets a Firebase user and returns a custom token
 */
export async function createFirebaseUser(user: {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}) {
  if (!isInitialized || !adminAuth) {
    console.warn('Firebase Admin not initialized. Skipping Firebase user creation.');
    return {
      firebaseUser: null,
      customToken: null,
      isNewUser: false,
    };
  }
  
  try {
    let firebaseUser;
    let isNewUser = false;
    
    // Try to get existing user
    try {
      firebaseUser = await adminAuth.getUser(user.id);
      console.log('Existing Firebase user found:', firebaseUser.uid);
    } catch (error: any) {
      // User doesn't exist, create new one
      if (error.code === 'auth/user-not-found') {
        const createUserPayload: admin.auth.CreateRequest = {
          uid: user.id,
          email: user.email || undefined,
          displayName: user.name || undefined,
          photoURL: user.image || undefined,
          emailVerified: true, // Since they signed in with Google
        };
        
        firebaseUser = await adminAuth.createUser(createUserPayload);
        console.log('New Firebase user created:', firebaseUser.uid);
        isNewUser = true; // Mark as new user
      } else {
        throw error;
      }
    }
    
    // Create custom token for client-side auth
    const customToken = await adminAuth.createCustomToken(user.id);
    
    return {
      firebaseUser,
      customToken,
      isNewUser,
    };
  } catch (error) {
    console.error('Error in createFirebaseUser:', error);
    throw error;
  }
} 