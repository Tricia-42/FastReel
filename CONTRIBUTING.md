# Contributing to StayReel

Thanks for your interest in contributing to StayReel! This guide will help you get started.

## 🎯 Current Priorities

We're actively working on:

1. **Google Veo3 Integration** - Video generation in conversations
2. **OpenAI Image Pipeline** - Multi-turn image editing for reels
3. **UI/UX Improvements** - Better mobile experience, animations
4. **Documentation** - API docs, tutorials, examples

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- Vercel CLI (for deployment testing)
- Basic knowledge of React, Next.js, and WebRTC

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see README)
4. Run development server: `npm run dev`

### Code Style

We use:
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting

Run `npm run lint` before committing.

## 🔧 Development Workflow

### 1. Pick an Issue

- Check [open issues](https://github.com/Tricia-42/StayReel/issues)
- Comment to claim an issue
- Create new issues for bugs/features

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Changes

- Write clean, documented code
- Add tests where applicable
- Update documentation
- Test thoroughly

### 4. Submit PR

- Clear description of changes
- Link related issues
- Include screenshots for UI changes
- Pass all CI checks

## 📁 Project Structure

```
src/
├── components/     # React components
├── pages/         # Next.js pages & API routes
├── lib/           # Utilities & API clients
├── hooks/         # Custom React hooks
├── styles/        # Global styles
└── types/         # TypeScript definitions
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific component
npm test -- Playground

# E2E tests
npm run test:e2e
```

## 📝 Documentation

- Update README for new features
- Add JSDoc comments to functions
- Document API changes
- Include usage examples

## 🎨 UI/UX Guidelines

- Mobile-first design
- Accessible (WCAG 2.1 AA)
- Dark mode support
- Smooth animations (60fps)
- Loading states for all async operations

## 🔐 Security

- Never commit secrets
- Validate all inputs
- Use HTTPS for external APIs
- Follow OWASP guidelines
- Report security issues privately

## 📦 Submitting Changes

### Commit Messages

Follow conventional commits:

```
feat: add Veo3 video generation
fix: resolve WebRTC connection timeout
docs: update API reference
style: format code with prettier
refactor: extract LiveKit hooks
test: add unit tests for auth flow
chore: update dependencies
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots
(if applicable)

## Related Issues
Fixes #123
```

## 🤝 Code Review

PRs require:
- One maintainer approval
- Passing CI/CD checks
- No merge conflicts
- Updated documentation

## 📞 Getting Help

- [Discord](https://discord.gg/stayreel) - Quick questions
- [GitHub Issues](https://github.com/Tricia-42/StayReel/issues) - Bugs & features
- [Discussions](https://github.com/Tricia-42/StayReel/discussions) - Ideas & help

## 🎉 Recognition

Contributors are:
- Listed in README
- Given Discord roles
- Invited to planning meetings
- Credited in releases

Thank you for contributing to StayReel! 🚀 