# Deployment Guide

This guide covers deployment options for CompanionKit, focusing on quick cloud deployments using Tricia's managed backend.

## Quick Deployment with Vercel (Recommended)

The fastest way to deploy CompanionKit:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTricia-42%2FCompanionKit)

### Manual Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to configure
```

### Required Environment Variables

Set these in your Vercel dashboard:

```env
# LiveKit Configuration (Required)
LIVEKIT_API_KEY=your_key
LIVEKIT_API_SECRET=your_secret
LIVEKIT_WS_URL=wss://your-instance.livekit.cloud

# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project

# Tricia Backend (Required)
TRICIA_API_KEY=your_api_key # Get from https://developers.heytricia.ai
```

## Alternative Cloud Platforms

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Google Cloud Run

```bash
# Build and deploy
gcloud run deploy companionkit \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Getting Your API Keys

### 1. Tricia API Key (Required)
- Sign up at [Tricia Developer Portal](https://developers.heytricia.ai)
- Create a new project
- Copy your API key

### 2. LiveKit Credentials
- Create account at [LiveKit Cloud](https://livekit.io)
- Generate API key and secret
- Note your WebSocket URL

### 3. Firebase Setup
- Create project at [Firebase Console](https://console.firebase.google.com)
- Enable Authentication
- Get your configuration values

## Production Considerations

### Performance Optimization

1. **Enable Vercel Edge Functions** for faster response times
2. **Configure caching headers** for static assets
3. **Use Vercel Analytics** to monitor performance

### Security Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **API Rate Limiting**: Configure in Vercel dashboard
3. **CORS Settings**: Restrict to your domains only

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Connect Sentry or similar service
- **Uptime Monitoring**: Use Vercel's built-in monitoring

## Scaling

CompanionKit automatically scales on Vercel. For high-traffic applications:

1. **Upgrade Vercel Plan** for more resources
2. **Enable ISR** (Incremental Static Regeneration)
3. **Configure Edge Config** for global data

## Custom Deployments

If you need a fully self-hosted solution with your own database and infrastructure, you'll need to:

1. Set up your own AI backend
2. Configure your own database
3. Implement authentication system
4. Handle media storage
5. Set up monitoring and logging

For custom deployments, refer to the architecture documentation and implement based on your specific requirements.

## Troubleshooting

### Common Issues

1. **LiveKit Connection Failed**
   - Verify API credentials
   - Check WebSocket URL format
   - Ensure firewall allows WebRTC

2. **Authentication Errors**
   - Verify Firebase configuration
   - Check API key permissions
   - Ensure domains are authorized

3. **API Rate Limits**
   - Upgrade Tricia plan if needed
   - Implement client-side caching
   - Use connection pooling

### Debug Mode

Enable debug logging in development:

```env
NEXT_PUBLIC_LOG_LEVEL=debug
```

## Support

- **Documentation**: [CompanionKit Docs](https://docs.companionkit.ai)
- **Community**: [Slack](https://companionkit-community.slack.com)
- **Enterprise Support**: enterprise@companionkit.ai 