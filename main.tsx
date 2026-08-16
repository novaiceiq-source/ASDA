import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ConvexProvider, ConvexReactClient} from 'convex/react';
import App from './App.tsx';
import InstallPrompt from './InstallPrompt.tsx';
import './index.css';

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error('Convex deployment URL is not configured');
}

const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
      <InstallPrompt />
    </ConvexProvider>
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
    });
  });
}
