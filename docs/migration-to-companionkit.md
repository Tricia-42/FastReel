# Migration Guide: StayReel to CompanionKit

## Overview

CompanionKit is the evolution of StayReel, expanding from memory preservation to a comprehensive toolkit for building AI-powered companion applications. This guide helps you migrate existing projects.

## Repository Renaming (Simplest Approach)

### On GitHub:

1. Go to your GitHub repository settings
2. Under "General", find "Repository name"
3. Change from `StayReel` to `CompanionKit`
4. GitHub automatically creates redirects from old URLs

### On Vercel:

1. Go to your Vercel project settings
2. Under "General", update the project name
3. Update environment variables if needed
4. Redeploy from the renamed GitHub repository

### Benefits of Renaming:
- ✅ Preserves all commit history
- ✅ Keeps existing issues and PRs
- ✅ Maintains stars and watchers
- ✅ Automatic URL redirects
- ✅ No need to update local clones (git handles it)

## Code Changes

### 1. Update Package Name

```json
// package.json
{
  "name": "companionkit",
  "description": "CompanionKit - Open-source toolkit for building AI-powered companion applications"
}
```

### 2. Update Page Title

```tsx
// src/pages/_app.tsx
<Head>
  <title>CompanionKit - AI Companion Platform</title>
  <meta
    name="description"
    content="Build empathetic AI-powered companion applications"
  />
</Head>
```

### 3. Update Environment Variables

No changes needed - all existing environment variables remain the same:
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `NEXT_PUBLIC_FIREBASE_*`
- `TRICIA_API_KEY`

### 4. Update Local Development

```bash
# If you haven't pulled latest changes
git pull origin main

# Update remote URL (if GitHub repo was renamed)
git remote set-url origin https://github.com/Tricia-42/CompanionKit.git
```

## Conceptual Changes

### From Memory Preservation to Companion Platform

**Before (StayReel):**
- Focused on memory capture and preservation
- Primarily for dementia care
- Memory-centric UI/UX

**After (CompanionKit):**
- Toolkit for any AI companion use case
- Supports mental health, education, elder care, and more
- Modular, empathy-driven design

### New Capabilities

CompanionKit maintains all StayReel features while adding:
- Modular component architecture
- Multiple companion personality support
- Extended use case templates
- Enhanced developer documentation

## Documentation Updates

All documentation has been updated to reflect:
- New branding and terminology
- Expanded use cases
- Developer-first approach
- Community collaboration focus

## Community Migration

- **Slack**: New workspace at `companionkit-community`
- **Twitter**: Follow `@companionkit`
- **Support**: `enterprise@companionkit.ai`

## No Breaking Changes

CompanionKit is fully backward compatible with StayReel:
- All APIs remain the same
- No database migrations needed
- Existing deployments continue to work
- Gradual migration supported

## Questions?

- **Technical Support**: [Slack Community](https://companionkit-community.slack.com)
- **Migration Help**: [GitHub Discussions](https://github.com/Tricia-42/CompanionKit/discussions)
- **Enterprise Support**: enterprise@companionkit.ai

---

Welcome to the CompanionKit community! 🤝 