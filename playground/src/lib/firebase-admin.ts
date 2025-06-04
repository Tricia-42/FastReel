import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Try to load service account from environment variable
let serviceAccount: any = null;

// First, try to use individual environment variables
const hasFirebaseCredentials = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

// If not available, try to load from FIREBASE_SERVICE_ACCOUNT_KEY env var
if (!hasFirebaseCredentials && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('Loaded Firebase service account from environment variable');
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
  }
}

// As a last resort, try to load from file (development only)
if (!hasFirebaseCredentials && !serviceAccount && process.env.NODE_ENV === 'development') {
  try {
    const serviceAccountPath = path.join(process.cwd(), 'tricia-e00ce-689fa22ff901.json');
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      console.log('Loaded Firebase service account from file (development mode)');
    }
  } catch (error) {
    console.error('Failed to load service account file:', error);
  }
}

let isInitialized = false;

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    if (serviceAccount) {
      // Use service account from file
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      isInitialized = true;
      console.log('Firebase Admin initialized successfully with service account file');
    } else if (hasFirebaseCredentials) {
      // Use environment variables
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID as string,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') as string,
        }),
      });
      isInitialized = true;
      console.log('Firebase Admin initialized successfully with environment variables');
    } else {
      console.warn('Firebase Admin credentials not found. Firebase features will be disabled.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
} else {
  isInitialized = true;
  console.log('Firebase Admin already initialized');
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