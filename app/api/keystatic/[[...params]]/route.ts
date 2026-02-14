import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

// Debug logging (will show in Vercel function logs)
console.log('[Keystatic Debug] Environment check:', {
  hasClientId: !!process.env.GITHUB_CLIENT_ID,
  hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
  hasSecret: !!process.env.KEYSTATIC_SECRET,
  hasGithubOwner: !!process.env.NEXT_PUBLIC_GITHUB_OWNER,
  hasGithubRepo: !!process.env.NEXT_PUBLIC_GITHUB_REPO,
  githubOwner: process.env.NEXT_PUBLIC_GITHUB_OWNER,
  githubRepo: process.env.NEXT_PUBLIC_GITHUB_REPO,
});

export const { GET, POST } = makeRouteHandler({
  config,
  localBaseDirectory: process.cwd(),
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  secret: process.env.KEYSTATIC_SECRET!,
});
