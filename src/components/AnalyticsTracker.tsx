'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const heartbeatRef = useRef<any>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Do not track admin panels or api endpoints
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    // Get or create persistent anonymous visitor ID
    let visitorId = '';
    try {
      visitorId = localStorage.getItem('ruangsiar_vid') || '';
      if (!visitorId) {
        visitorId = 'vid_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
        localStorage.setItem('ruangsiar_vid', visitorId);
      }
    } catch {
      visitorId = 'vid_anon_' + Math.random().toString(36).substring(2, 10);
    }

    const sendBeacon = () => {
      try {
        const payload = JSON.stringify({
          visitorId,
          path: pathname,
          pageTitle: document.title || 'Ruang Siar',
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/track', payload);
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    };

    // Send immediate view tracking on page arrival
    const timer = setTimeout(sendBeacon, 1200);

    // Heartbeat every 2 minutes while tab is active to keep session alive
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    heartbeatRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sendBeacon();
      }
    }, 120000);

    return () => {
      clearTimeout(timer);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [pathname]);

  return null;
}
