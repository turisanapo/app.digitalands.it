'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const MEASUREMENT_ID = 'G-4P23PN9CQP';

export function RouteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
} 