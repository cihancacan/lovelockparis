'use client';

import Link from 'next/link';
import { ReactNode, MouseEvent } from 'react';

export function ConversionLink({
  href,
  children,
  className,
  eventType = 'home_cta_click',
}: {
  href: string;
  children: ReactNode;
  className?: string;
  eventType?: string;
}) {
  const track = (_event: MouseEvent<HTMLAnchorElement>) => {
    try {
      let visitorId = localStorage.getItem('llp_conversion_visitor');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('llp_conversion_visitor', visitorId);
      }
      fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          eventType,
          visitorId,
          locale: document.documentElement.lang || 'en',
          path: window.location.pathname,
          metadata: { href },
        }),
      }).catch(() => null);
    } catch {}
  };

  return <Link href={href} onClick={track} className={className}>{children}</Link>;
}
