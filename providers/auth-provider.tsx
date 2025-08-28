'use client';

import {
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
} from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { systemTheme } = useTheme();

  return (
    <ClerkProvider
      standardBrowser
      appearance={{
        baseTheme: systemTheme ? shadcn : undefined,
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
          shimmer: true,
          animations: true,
        },
      }}>
      <ClerkLoading>Auth Loading</ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
      <ClerkFailed>
        <div>Auth Provider Failed to load</div>
      </ClerkFailed>
    </ClerkProvider>
  );
}
