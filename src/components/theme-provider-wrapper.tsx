
"use client";

import { useTheme } from '@/hooks/useTheme';
import React from 'react';

// This simple wrapper component allows useTheme to be used because RootLayout is a Server Component
export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  useTheme(); // Initialize theme. Actual theme state is managed by the hook.
  return <>{children}</>;
}
