# Troubleshooting Guide

## Console Errors and Warnings

### Common Issues

#### 1. Maximum Update Depth Exceeded

**Problem**: React infinite loop errors in development.

**Solution**: This has been fixed in the latest version by optimizing useEffect dependencies in the Playground component. If you still see this:

1. Clear your browser cache
2. Restart the development server
3. Check that you're using the latest version

#### 2. Failed to Load Resource (400 Bad Request)

**Problem**: Next.js development server trying to load source maps.

**Solution**: These are harmless development warnings. They don't affect functionality and are suppressed in production.

#### 3. Audio Permission Errors

**Problem**: "NotAllowedError: A user gesture is required" or "could not playback audio"

**Solution**: 
- Modern browsers require user interaction before playing audio
- Click anywhere on the page to enable audio
- The app handles this gracefully and will work after first interaction

#### 4. Silence Detected Warnings

**Problem**: "silence detected on local audio track"

**Solution**: 
- This is a LiveKit diagnostic warning
- It means no audio is being detected from your microphone
- Check your microphone permissions and input levels

## Configuring Logging

### Environment Variables

Add these to your `.env.local` file:

```env
# Log levels: debug, info, warn, error, none
NEXT_PUBLIC_LOG_LEVEL=info

# Comma-separated list of log categories
NEXT_PUBLIC_LOG_CATEGORIES=connection,journal,error

# Suppress development warnings
NEXT_PUBLIC_SUPPRESS_DEV_WARNINGS=true
```

### Log Categories

- `connection` - LiveKit connection events
- `journal` - Memory/journal generation events  
- `error` - Error messages
- `debug` - Detailed debugging information

### Using the Logger

```typescript
import { logger } from '@/lib/logger';

// Log by category
logger.info('connection', 'Connected to room');
logger.error('journal', 'Failed to save journal', error);

// Change log level at runtime
logger.setLevel('debug');

// Enable specific categories
logger.setEnabledCategories(['connection', 'journal']);
```

## Production vs Development

### Development Mode

- More verbose logging for debugging
- React development warnings shown
- Source map requests (can be ignored)

### Production Mode

- Minimal logging (errors only)
- No React development warnings
- Optimized console output

## Browser Console Tips

### Filter Console Output

In Chrome/Edge Developer Tools:
1. Open Console
2. Click the "Filter" box
3. Add `-Failed -silence -400` to hide common warnings
4. Or use "Errors only" filter level

### Useful Console Commands

```javascript
// Check current log level
logger.config

// Temporarily enable all logs
logger.setLevel('debug')

// Disable all logs
logger.setLevel('none')
```

## Performance Optimization

If you're seeing performance issues due to excessive logging:

1. Set `NEXT_PUBLIC_LOG_LEVEL=warn` or `error`
2. Disable categories you don't need
3. Use production build: `npm run build && npm start`

## Getting Help

If you continue to experience issues:

1. Check the [GitHub Issues](https://github.com/Tricia-42/companion-kit/issues)
2. Join our [Slack Community](https://companionkit-community.slack.com)
3. Include console logs when reporting issues (after filtering out the noise) 