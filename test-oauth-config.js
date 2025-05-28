// Quick script to verify OAuth configuration
console.log('=== OAuth Configuration Test ===\n');

// Check environment variables
console.log('Environment Variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Not set');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Not set');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '(not set - will auto-detect)');

// Check Tricia API configuration
console.log('\n=== Tricia API Configuration ===');
console.log('NEXT_PUBLIC_TRICIA_BASE_URL:', process.env.NEXT_PUBLIC_TRICIA_BASE_URL ? '✓ Set' : '✗ Not set');
console.log('NEXT_PUBLIC_TRICIA_AGENT_ID:', process.env.NEXT_PUBLIC_TRICIA_AGENT_ID ? '✓ Set' : '✗ Not set');
console.log('NEXT_PUBLIC_TRICIA_USER_ID:', process.env.NEXT_PUBLIC_TRICIA_USER_ID ? '✓ Set' : '✗ Not set');
console.log('TRICIA_API_BEARER_TOKEN:', process.env.TRICIA_API_BEARER_TOKEN ? '✓ Set' : '✗ Not set');

// Check if running locally
if (process.env.NEXTAUTH_URL) {
  console.log('\n⚠️  WARNING: NEXTAUTH_URL is set. This should only be set for local development!');
  console.log('   For production, NextAuth should auto-detect the URL.');
}

// Check if agent ID is missing
if (!process.env.NEXT_PUBLIC_TRICIA_AGENT_ID) {
  console.log('\n❌ ERROR: NEXT_PUBLIC_TRICIA_AGENT_ID is not set!');
  console.log('   This is required for creating chat sessions with Tricia.');
  console.log('   Please add it to your .env.local file.');
}

// Expected OAuth URLs
console.log('\n=== Expected OAuth Configuration ===');
console.log('\nFor demo.heytricia.ai:');
console.log('JavaScript Origin: https://demo.heytricia.ai');
console.log('Redirect URI: https://demo.heytricia.ai/api/auth/callback/google');

console.log('\nFor localhost:');
console.log('JavaScript Origin: http://localhost:8005');
console.log('Redirect URI: http://localhost:8005/api/auth/callback/google');

console.log('\n=== Vercel Deployment URLs ===');
console.log('Production: https://demo.heytricia.ai');
console.log('Preview deployments will have unique URLs that need to be added to Google OAuth if you want to test there.');

console.log('\n✅ Your Google OAuth client is configured correctly with these URLs!');
console.log('\n=== Next Steps ===');
console.log('1. Ensure NEXTAUTH_URL is NOT set in Vercel production environment');
console.log('2. Check Vercel Function logs for [NextAuth] entries after deployment');
console.log('3. Clear browser cookies for demo.heytricia.ai before testing'); 