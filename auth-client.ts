import { convexClient, crossDomainClient } from '@convex-dev/better-auth/client/plugins';
import type { AuthClient } from '@convex-dev/better-auth/react';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [convexClient(), crossDomainClient()],
});

// The Convex adapter supports Better Auth 1.6.x at runtime, but its provider
// type is generated against an earlier 1.6.x patch release.
export const providerAuthClient = authClient as unknown as AuthClient;
