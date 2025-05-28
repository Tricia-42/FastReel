# Technical Debt Documentation

## ESLint Deprecation Warning

**Issue**: During Vercel builds, we see deprecation warnings:
- `@humanwhocodes/config-array@0.13.0` is deprecated
- `eslint@8.57.1` is deprecated and no longer supported

**Root Cause**: 
- ESLint 8.x has reached end-of-life and ESLint 9.x is the current supported version
- However, `eslint-config-next` (used by Next.js) only supports ESLint 7.x and 8.x
- The `@humanwhocodes/config-array` warning is a transitive dependency from ESLint 8.x

**Current Solution**:
- We're intentionally staying on ESLint 8.57.1 (the latest 8.x version)
- Added a comment in `package.json` explaining this constraint
- The warnings are informational only and don't affect the build

**Future Resolution**:
1. Monitor Next.js releases for ESLint 9 support
2. Check periodically: `npm info eslint-config-next peerDependencies`
3. When Next.js adds ESLint 9 support, update both packages:
   ```bash
   npm install --save-dev eslint@^9 eslint-config-next@latest
   ```

**Tracking**:
- Next.js Issue: https://github.com/vercel/next.js/issues (search for ESLint 9 support)
- Last checked: January 2025
- Next check: February 2025

## Other Known Issues

(Add other technical debt items here as they arise) 