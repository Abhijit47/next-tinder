// app/analytics.tsx
'use client';

import { track } from '@databuddy/sdk';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    track('screen_view', {
      screen_name: pathname,
      screen_class: 'Next.js',
      url: url,
    });
  }, [pathname, searchParams]);

  return null;
}
