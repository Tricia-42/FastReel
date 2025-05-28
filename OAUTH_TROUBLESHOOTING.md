# OAuth Troubleshooting Guide

## Debugging 401: invalid_client Error

### 1. Check Environment Variables in Vercel

Visit your debug endpoint: `https://demo.heytricia.ai/api/debug-oauth?secret=debug-tricia-oauth`

This will show you:
- If NEXTAUTH_URL is set (it should NOT be set in production)
- If all required environment variables are present
- What URL NextAuth is constructing

### 2. Verify Vercel Environment Variables

In your Vercel dashboard, ensure you have ONLY these variables set for production:

```
GOOGLE_CLIENT_ID=188615960167-2smqfv04qqmcv5erq23c1hnn7lj6n197.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-secret-here
NEXTAUTH_SECRET=your-generated-secret-here
```

⚠️ **DO NOT SET NEXTAUTH_URL in production!**

### 3. Google OAuth Console Checklist

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (tricia-e00ce)
3. Navigate to APIs & Services → Credentials
4. Click on your OAuth 2.0 Client ID

Verify these settings:

**Authorized JavaScript origins:**
- `https://demo.heytricia.ai` ✓
- `http://localhost:8005` ✓

**Authorized redirect URIs:**
- `https://demo.heytricia.ai/api/auth/callback/google` ✓
- `http://localhost:8005/api/auth/callback/google` ✓

### 4. Common Issues and Solutions

#### Issue: 401 invalid_client on production
**Cause**: NEXTAUTH_URL is set in Vercel production environment
**Solution**: Remove NEXTAUTH_URL from Vercel production environment variables

#### Issue: Redirect URI mismatch
**Cause**: The callback URL doesn't match Google's configuration
**Solution**: Ensure the exact URL (including https://) is in Google OAuth settings

#### Issue: Works on localhost but not production
**Cause**: Different environment variable configuration
**Solution**: Use the debug endpoint to compare environments

### 5. Testing OAuth Flow

1. **Clear all cookies** for demo.heytricia.ai
2. Visit `https://demo.heytricia.ai`
3. Click "Sign in with Google"
4. Check browser DevTools Network tab for:
   - The redirect to Google (should include correct redirect_uri)
   - The callback from Google
   - Any error responses

### 6. Vercel Preview Deployments

Preview deployments (like `web-n4y7k4iuv-tricia-open-web.vercel.app`) won't work with OAuth unless you:
1. Add their URLs to Google OAuth config (not recommended)
2. Use a staging OAuth app with wildcard support
3. Test OAuth only on the main domain

### 7. Quick Fixes to Try

```bash
# 1. Ensure latest deployment
git push origin pilot

# 2. Clear Vercel cache
# In Vercel dashboard: Settings → Functions → Purge Cache

# 3. Redeploy with cleared cache
# In Vercel dashboard: Deployments → Redeploy
```

### 8. Environment Variable Verification

Run this locally to generate a new NEXTAUTH_SECRET if needed:
```bash
openssl rand -base64 32
```

### 9. If Nothing Works

1. Create a new OAuth client in Google Console
2. Update the client ID and secret in Vercel
3. Ensure the OAuth consent screen is published (not in testing mode)
4. Check if your Google Workspace has any restrictions

## Debug Information

After visiting the debug endpoint, you should see something like:
```json
{
  "environment": "production",
  "nextAuthUrl": "(not set - auto-detected)",
  "nextAuthUrlSet": false,  // ← This MUST be false in production
  "googleClientIdSet": true,
  "googleClientSecretSet": true,
  "nextAuthSecretSet": true,
  "clientIdPrefix": "1886159601...",
  "host": "demo.heytricia.ai",
  "protocol": "https",
  "constructedUrl": "https://demo.heytricia.ai"
}
``` 