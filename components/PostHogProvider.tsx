'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';

function initPostHog() {
  if (typeof window === 'undefined') return;
  if (posthog.__loaded) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    // Session replay off site-wide — rrweb bundle (~90 KiB) isn't worth it for
    // an advocacy site. Pageview/funnel analytics still work. Match the MRA
    // decision documented in that repo's instrumentation-client.ts.
    disable_session_recording: true,
    disable_surveys: true,
    debug: process.env.NODE_ENV === 'development',
  });
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !posthog.__loaded) return;
    let url = window.origin + pathname;
    const search = searchParams?.toString();
    if (search) url += '?' + search;
    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </Provider>
  );
}
