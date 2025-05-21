import { default as App } from "./src/app";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://ff78f3b1be74bc982073aacaa4b3beda@o4509662097244160.ingest.us.sentry.io/4509662099537920',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
export { App as default }