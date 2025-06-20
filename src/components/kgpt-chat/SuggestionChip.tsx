
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SuggestionChipProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
}

export function SuggestionChip({ suggestion, onClick }: SuggestionChipProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-auto py-1.5 px-3 rounded-full text-sm",
        "bg-suggestion-chip text-suggestion-chip-foreground hover:bg-suggestion-chip-hover",
        "border-border/70 shadow-sm transition-all hover:shadow-md",
        "min-w-max whitespace-normal break-words" // Added classes for layout
      )}
      onClick={() => onClick(suggestion)}
    >
      {suggestion}
    </Button>
  );
}
