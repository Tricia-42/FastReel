# Cursor Rules for FastReel

This directory contains coding rules and guidelines for the FastReel project, specifically optimized for Next.js 14 with Pages Router.

## Rule Structure

### Core Rules (Always Applied)
- **clean-code.mdc** - General clean code principles
- **codequality.mdc** - Code quality guidelines
- **typescript.mdc** - TypeScript best practices for Next.js
- **gitflow.mdc** - Git workflow rules

### Frontend-Specific Rules
- **nextjs-pages-frontend.mdc** - Next.js Pages Router frontend patterns
- **react.mdc** - React best practices for Next.js
- **tailwind.mdc** - Tailwind CSS guidelines

### Backend-Specific Rules
- **nextjs-pages-backend.mdc** - API route patterns and backend rules

### Project Organization
- **playground-rules.mdc** - Master rules for the playground folder
- **.cursorrules** - Automatic rule application configuration

## How Rules Are Applied

### Automatic Application
Cursor will automatically apply rules based on file paths:

1. **Frontend files** (pages, components, hooks):
   - All core rules
   - nextjs-pages-frontend
   - react
   - tailwind

2. **Backend files** (API routes, server utilities):
   - All core rules
   - nextjs-pages-backend

3. **Shared files** (lib directory):
   - Rules applied based on context and imports

### Manual Rule Selection
You can manually request specific rules using the `fetch_rules` tool:
- For frontend work: `fetch_rules(['nextjs-pages-frontend', 'react', 'tailwind'])`
- For backend work: `fetch_rules(['nextjs-pages-backend'])`
- For general work: `fetch_rules(['clean-code', 'typescript'])`

## File Path Patterns

### Frontend Paths
```
playground/src/pages/**/*.tsx (excluding api/)
playground/src/components/**/*
playground/src/hooks/**/*
playground/src/styles/**/*
playground/public/**/*
```

### Backend Paths
```
playground/src/pages/api/**/*
playground/src/middleware.ts
playground/src/lib/api/**/*
playground/src/lib/auth/**/*
playground/src/lib/db/**/*
```

## Key Differences from App Router

Since this project uses Next.js 14 with **Pages Router**, not App Router:
- Use `getStaticProps` and `getServerSideProps` for data fetching
- API routes go in `pages/api/` directory
- Use `_app.tsx` and `_document.tsx` for app-level configuration
- Client-side routing with `next/router`
- No React Server Components
- No `app/` directory structure

## Adding New Rules

When adding new rules:
1. Create a new `.mdc` file in this directory
2. Update `.cursorrules` to include the new rule in appropriate contexts
3. Update this README with the new rule description
4. Test that the rule applies correctly to relevant files

## Best Practices

1. **Keep rules focused** - Each rule file should cover a specific domain
2. **Avoid conflicts** - Ensure rules don't contradict each other
3. **Stay current** - Update rules as the project evolves
4. **Document changes** - Update this README when modifying rules
5. **Test thoroughly** - Verify rules work as expected before committing 