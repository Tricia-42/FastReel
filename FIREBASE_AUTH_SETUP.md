# Firebase Authentication Setup

This app now integrates NextAuth with Firebase Authentication, allowing users to:
1. Sign in with Google via NextAuth
2. Automatically create corresponding Firebase Auth users
3. Have users appear in Firebase Console
4. Create users in the Tricia backend API on first sign-in

## Setup Instructions

### 1. Firebase Admin SDK Setup

1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate a new private key
3. Add the following to your `.env.local`:

```env
# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=tricia-e00ce
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tricia-e00ce.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

### 2. Firebase Client SDK Setup

Add these to your `.env.local`:

```env
# Firebase Client SDK (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tricia-e00ce.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tricia-e00ce
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tricia-e00ce.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Enable Google Sign-In in Firebase

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable Google provider
3. Add your Google OAuth client ID and secret (same ones used for NextAuth)

## How It Works

1. **User signs in with Google** via NextAuth
2. **NextAuth creates a session** with the Google OAuth user data
3. **Firebase user is created** server-side using Firebase Admin SDK
4. **Custom token is generated** and added to the NextAuth session
5. **Client-side Firebase Auth** signs in using the custom token
6. **Backend user is created** via API call on first sign-in

## Authentication Flow

```
Google OAuth → NextAuth → Firebase Admin (server) → Custom Token 
                    ↓                                      ↓
                NextAuth Session ← ← ← ← ← ← ← ← ← ← ← ← ↓
                    ↓
                Client App → Firebase Auth (client) ← ← ← ↓
                    ↓
                Tricia API (create user on first sign-in)
```

## User Data Mapping

- **NextAuth User ID** = Google OAuth sub claim (e.g., "117649875334679864523")
- **Firebase UID** = Same as NextAuth User ID
- **Tricia User ID** = Same as Firebase UID

## Debugging

Check the console logs for:
- `[NextAuth] Sign in attempt:` - When user attempts to sign in
- `Firebase Admin initialized successfully` - Admin SDK is ready
- `New Firebase user created:` - First-time user created in Firebase
- `[NextAuth] Creating new user in backend` - Creating user in Tricia API
- `Firebase authenticated as:` - Client-side Firebase auth successful

## Firestore Security Rules

Now that users are authenticated with Firebase, you can use security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

1. Sign out completely
2. Sign in with a new Google account
3. Check Firebase Console > Authentication - user should appear
4. Check backend logs - user should be created via API
5. Check Firestore - can now use authenticated requests 