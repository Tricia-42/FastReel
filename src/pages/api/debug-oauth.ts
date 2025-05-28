import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow this endpoint in development or with a secret query param
  if (process.env.NODE_ENV === 'production' && req.query.secret !== 'debug-tricia-oauth') {
    return res.status(404).json({ error: 'Not found' })
  }

  const debug = {
    environment: process.env.NODE_ENV,
    nextAuthUrl: process.env.NEXTAUTH_URL || '(not set - auto-detected)',
    nextAuthUrlSet: !!process.env.NEXTAUTH_URL,
    googleClientIdSet: !!process.env.GOOGLE_CLIENT_ID,
    googleClientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
    nextAuthSecretSet: !!process.env.NEXTAUTH_SECRET,
    clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...',
    host: req.headers.host,
    protocol: req.headers['x-forwarded-proto'] || 'http',
    constructedUrl: `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`,
    vercelUrl: process.env.VERCEL_URL,
    nodeVersion: process.version,
  }

  res.status(200).json(debug)
} 