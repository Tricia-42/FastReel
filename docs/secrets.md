# Secrets Management

## Overview

This document outlines the secrets required for CI/CD and how to rotate them safely.

## Required Secrets

### GitHub Repository Secrets

| Secret Name | Purpose | Rotation Frequency | Owner |
|------------|---------|-------------------|-------|
| `VERCEL_TOKEN` | Deploy previews and production | 90 days | DevOps |
| `VERCEL_ORG_ID` | Vercel organization identifier | Never | DevOps |
| `VERCEL_PROJECT_ID` | Vercel project identifier | Never | DevOps |
| `LHCI_GITHUB_APP_TOKEN` | Lighthouse CI GitHub integration | 90 days | DevOps |
| `SLACK_WEBHOOK_URL` | Performance alerts | 180 days | DevOps |

### Environment Variables (Non-Secret)

These are configured in CI but are not sensitive:

- `NEXT_PUBLIC_TEST_MODE=true`
- `NEXT_BUILD_REPORT=1`
- `NODE_ENV=production`

## Rotation Procedures

### Rotating VERCEL_TOKEN

1. **Generate new token**:
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Name: `fastreel-ci-{date}`
   - Scope: Full Account
   - Expiration: 90 days

2. **Update GitHub secret**:
   ```bash
   gh secret set VERCEL_TOKEN --repo=your-org/FastReel
   ```

3. **Test deployment**:
   - Create a test PR
   - Verify preview deployment works
   - Check logs for any auth errors

4. **Revoke old token**:
   - Return to Vercel tokens page
   - Delete the old token

### Rotating LHCI_GITHUB_APP_TOKEN

1. **Generate new token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Name: `lhci-fastreel-{date}`
   - Scopes: `repo`, `workflow`
   - Expiration: 90 days

2. **Update secret**:
   ```bash
   gh secret set LHCI_GITHUB_APP_TOKEN --repo=your-org/FastReel
   ```

3. **Verify**:
   - Run CI on a PR
   - Check Lighthouse results are posted

### Rotating SLACK_WEBHOOK_URL

1. **Create new webhook**:
   - Go to Slack App settings
   - Incoming Webhooks → Add New Webhook
   - Channel: #dev-performance

2. **Update secret**:
   ```bash
   gh secret set SLACK_WEBHOOK_URL --repo=your-org/FastReel
   ```

3. **Test**:
   - Trigger weekly report workflow manually
   - Verify message appears in Slack

## Security Best Practices

### Do's

- ✅ Use GitHub's secret scanning
- ✅ Set expiration dates on all tokens
- ✅ Use least-privilege scopes
- ✅ Rotate immediately if compromised
- ✅ Use separate tokens for dev/staging/prod
- ✅ Document rotation in team calendar

### Don'ts

- ❌ Never commit secrets to code
- ❌ Don't share tokens via Slack/email
- ❌ Don't use personal tokens for CI
- ❌ Don't reuse tokens across projects
- ❌ Never log secret values

## Monitoring

### Secret Usage Audit

Check token usage monthly:

1. **Vercel**: Account Settings → Audit Log
2. **GitHub**: Settings → Security log
3. **Slack**: App Management → Activity logs

### Alerts

Set up alerts for:
- Failed authentications in CI
- Tokens nearing expiration (30 days)
- Unusual API usage patterns

## Emergency Response

### If a Secret is Compromised

1. **Immediately revoke** the compromised token
2. **Generate new token** following procedures above
3. **Update** GitHub secret
4. **Audit** recent usage for suspicious activity
5. **Notify** security team
6. **Document** incident in security log

### CI Breakage Due to Expired Token

Quick fix:
1. Generate temporary token (24hr expiry)
2. Update secret
3. Schedule proper rotation within 24hrs

## Appendix

### Useful Commands

```bash
# List all secrets (names only)
gh secret list --repo=your-org/FastReel

# Set secret from file
gh secret set VERCEL_TOKEN < token.txt --repo=your-org/FastReel

# Set secret interactively
gh secret set VERCEL_TOKEN --repo=your-org/FastReel

# Remove secret
gh secret remove OLD_SECRET --repo=your-org/FastReel
```

### Token Formats

For validation when rotating:

- **Vercel**: Starts with `Bearer ` followed by 24 characters
- **GitHub PAT**: Starts with `ghp_` followed by 36 characters
- **Slack Webhook**: URL format `https://hooks.slack.com/services/...` 