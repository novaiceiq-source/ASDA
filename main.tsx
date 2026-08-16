import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ConvexBetterAuthProvider} from '@convex-dev/better-auth/react';
import {Authenticated, AuthLoading, ConvexReactClient, Unauthenticated} from 'convex/react';
import App from './App.tsx';
import AuthScreen from './AuthScreen.tsx';
import {authClient, providerAuthClient} from './auth-client.ts';
import './index.css';

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

if (!convexUrl || !convexSiteUrl) {
  throw new Error('Convex deployment URLs are not configured');
}

const convex = new ConvexReactClient(convexUrl, {expectAuth: true});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexBetterAuthProvider client={convex} authClient={providerAuthClient}>
      <AuthLoading>
        <main className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
          <p className="font-bold text-slate-600">جاري التحقق من الجلسة...</p>
        </main>
      </AuthLoading>
      <Unauthenticated>
        <AuthScreen />
      </Unauthenticated>
      <Authenticated>
        <div className="fixed left-3 top-3 z-[100]">
          <button
            className="rounded-lg bg-white/90 px-3 py-2 text-xs font-bold text-slate-600 shadow-md backdrop-blur"
            type="button"
            onClick={() => void authClient.signOut()}
          >
            تسجيل الخروج
          </button>
        </div>
        <App />
      </Authenticated>
    </ConvexBetterAuthProvider>
  </StrictMode>,
);
