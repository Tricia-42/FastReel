# Google OAuth Setup for Tricia

This guide will help you set up Google OAuth authentication for the Tricia application.

## Prerequisites

- Google Cloud Console account
- Access to your Vercel deployment (for production)

## Quick Setup

1. **Run the setup script**:
   ```bash
   chmod +x setup-google-oauth.sh
   ./setup-google-oauth.sh
   ```

2. **Update the generated configuration with your Google OAuth credentials**:
   - Edit `.env.local.oauth` and replace the placeholders with your actual values
   - Get these from [Google Cloud Console](https://console.cloud.google.com/)

3. **Append the configuration to your .env.local**:
   ```bash
   cat .env.local.oauth >> .env.local
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Manual Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:8005  # Use https://demo.heytricia.ai in production

# Optional: Test mode
NEXT_PUBLIC_TEST_MODE=false
```

### 2. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

## Google Cloud Console Configuration

Configure your Google OAuth app with the following:

### Authorized JavaScript Origins:
- `http://localhost:8005` (development)
- `https://demo.heytricia.ai` (production)

### Authorized Redirect URIs:
- `http://localhost:8005/api/auth/callback/google` (development)
- `https://demo.heytricia.ai/api/auth/callback/google` (production)

## Production Deployment (Vercel)

1. **Add environment variables in Vercel Dashboard**:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all the variables from your `.env.local`
   - For `NEXTAUTH_URL`, use `https://demo.heytricia.ai`

2. **Important**: Use the same `NEXTAUTH_SECRET` in both development and production

## User Flow

1. Users visit the site
2. They're prompted to "Sign in with Google"
3. After authentication, they can connect to Tricia
4. Their email is displayed in the header
5. They can sign out at any time

## Test Mode

For development/testing without authentication:
```env
NEXT_PUBLIC_TEST_MODE=true
```

## Troubleshooting

### "Configuration" Error
- Check that all environment variables are set correctly
- Ensure `NEXTAUTH_SECRET` is generated and set

### "OAuthCallback" Error
- Verify redirect URIs in Google Cloud Console match exactly
- Check that the domain is correctly configured

### Session Not Persisting
- Clear browser cookies and try again
- Ensure `NEXTAUTH_SECRET` is the same across deployments

## Security Notes

1. **Never commit** the `client_secret_*.json` file (already in .gitignore)
2. **Keep `NEXTAUTH_SECRET` secure** - it's used to encrypt session tokens
3. **Use HTTPS in production** - OAuth requires secure connections

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables) 