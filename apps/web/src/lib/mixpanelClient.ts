// @ts-ignore
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
let isInitialized = false;

export const initMixpanel = () => {
  if (isInitialized || !MIXPANEL_TOKEN) {
    if (!MIXPANEL_TOKEN) {
      console.warn('Mixpanel token is missing! Analytics disabled.');
    }
    return;
  }
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: false,
    persistence: 'localStorage',
    opt_out_tracking_by_default: true,
  });
  isInitialized = true;
};

export const trackEvent = <T extends Record<string, any>>(
  eventName: string,
  properties?: T
) => {
  if (MIXPANEL_TOKEN && mixpanel.has_opted_in_tracking()) {
    try {
      mixpanel.track(eventName, properties);
    } catch (error) {
      console.error('Mixpanel tracking error:', error);
    }
  }
};

export const optInTracking = () => {
  if (mixpanel && MIXPANEL_TOKEN) {
    mixpanel.opt_in_tracking();
    trackEvent('Page View', { path: window.location.pathname });
  }
};

export const optOutTracking = () => {
  if (mixpanel && MIXPANEL_TOKEN) {
    mixpanel.opt_out_tracking();
  }
};

export { mixpanel };
