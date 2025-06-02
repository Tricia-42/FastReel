# Contributing to CompanionKit

Thank you for your interest in contributing to CompanionKit! This guide covers the technical aspects of contributing. For our full contribution philosophy and guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).

## Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 18.0+
- npm or yarn
- Git

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/companion-kit.git
cd companion-kit

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

## Code Style

We use ESLint and Prettier for code formatting:

```bash
# Run linter
npm run lint

# Fix formatting
npm run format
```

### TypeScript Guidelines

- Use explicit types for function parameters and return values
- Avoid `any` type unless absolutely necessary
- Prefer interfaces over type aliases for object shapes
- Use enums for fixed sets of values

Example:

```typescript
// Good
interface MemoryOptions {
  userId: string
  companionId: string
  duration?: number
}

export async function createMemory(options: MemoryOptions): Promise<Memory> {
  // Implementation
}

// Avoid
export async function createMemory(options: any) {
  // Implementation
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

### Writing Tests

Place test files next to the code they test:

```
src/
  components/
    Button.tsx
    Button.test.tsx
  lib/
    memory.ts
    memory.test.ts
```

Example test:

```typescript
import { createMemory } from './memory'

describe('createMemory', () => {
  it('should create a memory with required fields', async () => {
    const memory = await createMemory({
      userId: 'user-123',
      companionId: 'sarah-gentle-guide'
    })
    
    expect(memory).toHaveProperty('id')
    expect(memory.userId).toBe('user-123')
  })
})
```

## Pull Request Process

### Before Submitting

1. **Test your changes** - Ensure all tests pass
2. **Update documentation** - If you changed APIs
3. **Check accessibility** - Use keyboard navigation and screen readers
4. **Add tests** - Cover new functionality
5. **Update types** - Keep TypeScript definitions current

### PR Title Format

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Maintenance tasks

Examples:
```
feat: add voice activity detection
fix: resolve memory leak in audio processing
docs: update API reference for v2
```

### PR Description Template

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
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.logs left
```

## Project Structure

```
companion-kit/
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Generic UI components
│   │   └── features/   # Feature-specific components
│   ├── pages/          # Next.js pages
│   │   └── api/        # API routes
│   ├── lib/            # Core libraries
│   │   ├── ai/         # AI-related utilities
│   │   ├── companion/  # Companion management
│   │   └── auth/       # Authentication
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript definitions
│   └── utils/          # Utility functions
├── public/             # Static assets
├── tests/              # Test utilities
└── docs/               # Documentation
```

## API Development

### Adding New Endpoints

1. Create route in `pages/api/`
2. Add TypeScript types
3. Implement error handling
4. Add rate limiting if needed
5. Document in API reference

Example:

```typescript
// pages/api/memories/[id]/share.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { authenticate } from '@/lib/auth'
import { shareMemory } from '@/lib/memory'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await authenticate(req)
    const { id } = req.query
    const result = await shareMemory(id as string, req.body, user)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

## Component Development

### Creating New Components

1. Use functional components with TypeScript
2. Include proper accessibility attributes
3. Support both light and dark themes
4. Make components responsive
5. Add Storybook stories for UI components

Example:

```typescript
// components/MemoryCard.tsx
interface MemoryCardProps {
  memory: Memory
  onShare?: () => void
  className?: string
}

export function MemoryCard({ memory, onShare, className }: MemoryCardProps) {
  return (
    <article 
      className={cn('memory-card', className)}
      aria-label={`Memory: ${memory.title}`}
    >
      <h3>{memory.title}</h3>
      <p>{memory.summary}</p>
      {onShare && (
        <button
          onClick={onShare}
          aria-label={`Share memory: ${memory.title}`}
        >
          Share
        </button>
      )}
    </article>
  )
}
```

## Performance Guidelines

1. **Lazy load components** - Use dynamic imports
2. **Optimize images** - Use Next.js Image component
3. **Minimize bundle size** - Check with `npm run analyze`
4. **Cache API responses** - Use SWR or React Query
5. **Debounce user input** - Prevent excessive API calls

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Validate all inputs** - Both client and server side
3. **Sanitize user content** - Prevent XSS attacks
4. **Use HTTPS only** - No mixed content
5. **Implement CSRF protection** - For state-changing operations

## Questions?

- **Technical questions**: Post in #dev-help on [Slack](https://companionkit-community.slack.com)
- **Feature discussions**: Create a GitHub Discussion
- **Bug reports**: Open a GitHub Issue
- **Security issues**: Email security@companionkit.ai

Thank you for contributing to CompanionKit! 🤝 