import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  eventType: string;
  eventData?: any;
  postId?: string;
}

export function useAnalytics() {
  const location = useLocation();

  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: event.eventType,
          eventData: event.eventData || {},
          postId: event.postId,
        }),
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  };

  const trackPageView = (postId?: string) => {
    trackEvent({
      eventType: 'page_view',
      eventData: {
        path: location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      },
      postId,
    });
  };

  const trackClick = (element: string, postId?: string) => {
    trackEvent({
      eventType: 'click',
      eventData: {
        element,
        path: location.pathname,
        timestamp: new Date().toISOString(),
      },
      postId,
    });
  };

  // Auto-track page views
  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  return {
    trackEvent,
    trackPageView,
    trackClick,
  };
}