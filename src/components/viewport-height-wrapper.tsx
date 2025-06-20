"use client";

import { useEffect } from 'react';

export function ViewportHeightWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty(
        '--app-height',
        `${window.innerHeight}px`
      );
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  return <>{children}</>;
}
