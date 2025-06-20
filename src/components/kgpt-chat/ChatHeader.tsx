
"use client";

import React from 'react';
import { KGPTIcon, SunIcon, MoonIcon, OnlineIcon, OfflineIcon, RetryingIcon } from './icons';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface ChatHeaderProps {
  connectionStatus: 'online' | 'offline' | 'connecting';
}

export function ChatHeader({ connectionStatus }: ChatHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const StatusIcon = () => {
    switch (connectionStatus) {
      case 'online':
        return <OnlineIcon className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <OfflineIcon className="h-5 w-5 text-red-500" />;
      case 'connecting':
        return <RetryingIcon className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <OnlineIcon className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-card/80 backdrop-blur-md"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex items-center gap-2">
        <KGPTIcon className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-headline font-semibold text-foreground">KGPT Chat</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5" title={`Status: ${connectionStatus}`}>
          <StatusIcon />
          <span className="text-xs text-muted-foreground hidden sm:inline">{connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
