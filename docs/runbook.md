# FastReel Developer Runbook

## CI/CD Pipeline

### Overview

Our CI/CD pipeline ensures code quality, performance, and bundle size optimization for every pull request and main branch push.

### Running Checks Locally

Before pushing your changes, run all checks locally to ensure CI will pass:

```bash
cd playground
npm run lint && npx tsc --noEmit && npm run build
```

If the build succeeds locally, it should pass CI (excluding cache differences).

### Understanding CI Results

#### PR Comment Analysis

The CI bot will comment on your PR with bundle size analysis:

- ✅ **Green tick** = No bundle regressions
- ⚠️ **Orange warning** = Route grew but under budget; investigate if intentional
- ❌ **Red cross** = Bundle or Lighthouse budget failed—must fix before merging

#### Lighthouse Performance Scores

Target scores (mobile):
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

Key metrics:
- Cumulative Layout Shift (CLS): < 0.1
- Largest Contentful Paint (LCP): < 2.5s
- First Contentful Paint (FCP): < 1.8s

### Updating Budgets

#### Bundle Size Budgets

Edit `.bundle-size-budget.json` in your PR:

```json
{
  "path": "/your-route",
  "resourceSizes": [
    {
      "resourceType": "total",
      "budget": 300  // in KB
    }
  ]
}
```

#### Performance Budgets

Edit `.lighthouserc.json` to adjust performance thresholds:

```json
{
  "assertions": {
    "categories:performance": ["error", {"minScore": 0.9}],
    "largest-contentful-paint": ["error", {"maxNumericValue": 2500}]
  }
}
```

### Common CI Failures and Fixes

#### 1. ESLint Errors

```bash
npm run lint
# Auto-fix where possible:
npm run lint -- --fix
```

#### 2. TypeScript Errors

```bash
npx tsc --noEmit
# Check specific file:
npx tsc --noEmit src/pages/your-file.tsx
```

#### 3. Bundle Size Regression

1. Run bundle analyzer locally:
   ```bash
   ANALYZE=true npm run build
   ```
2. Check `.next/analyze/client.html`
3. Common fixes:
   - Dynamic imports for large components
   - Tree-shake unused imports
   - Optimize images with next/image

#### 4. Performance Regression

1. Run Lighthouse locally:
   ```bash
   npm run build && npm run start
   # In another terminal:
   npx lighthouse http://localhost:3000 --view
   ```
2. Common fixes:
   - Lazy load below-fold content
   - Optimize critical rendering path
   - Reduce JavaScript execution time

### Build Optimizations

#### Caching Strategy

CI caches:
- `node_modules` (via package-lock.json hash)
- `.next/cache` (build cache)
- `~/.npm` (npm cache)

To bust cache locally:
```bash
rm -rf .next node_modules
npm ci
npm run build
```

#### Environment Variables

Required for CI:
- `NEXT_PUBLIC_TEST_MODE=true` (bypasses auth in CI)
- `NEXT_BUILD_REPORT=1` (generates bundle analysis)

### Deployment

#### Preview Deployments

Every PR gets a preview URL:
- Format: `pr-{number}.fastreel.vercel.app`
- Automatically updated on each push
- Deleted when PR is closed

#### Production Deployment

Merges to `main` trigger:
1. Full CI pipeline
2. Production build verification
3. Automatic deployment to production

### Monitoring

#### Weekly Reports

Automated weekly Lighthouse runs on main branch:
- Results posted to #dev-performance Slack channel
- Historical trends tracked in GitHub Pages

#### Key Metrics Dashboard

| Metric | Target | Source |
|--------|--------|--------|
| Build Duration | ≤ 4 min | GitHub Actions → Insights |
| Bundle Δ per PR | < 5 KB gzip | Bundle analysis comment |
| Lighthouse Score | ≥ 90 | LHCI weekly run |
| Deploy Time | < 2 min | Vercel dashboard |

### Troubleshooting

#### CI Hanging

1. Check for missing `await` in tests
2. Ensure all servers are properly closed
3. Add timeout to long-running operations

#### Flaky Tests

1. Check for race conditions
2. Use proper test utilities (waitFor, etc.)
3. Mock external dependencies

#### Cache Issues

Force fresh build:
```yaml
# In your commit message:
[skip cache] Your commit message
```

### Emergency Procedures

#### Rollback Production

1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"

#### Skip CI (Emergency Only)

```bash
git commit -m "fix: emergency patch [skip ci]"
```

⚠️ **Warning**: Only use for critical hotfixes. Follow up with proper PR.

### Contact

- CI/CD Issues: @devops-team
- Performance Regressions: @performance-team
- Security Concerns: @security-team 