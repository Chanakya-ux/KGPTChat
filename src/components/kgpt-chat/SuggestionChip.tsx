
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface SuggestionChipProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
}

export function SuggestionChip({ suggestion, onClick }: SuggestionChipProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-auto py-1.5 px-3 rounded-full text-sm bg-suggestion-chip text-suggestion-chip-foreground hover:bg-suggestion-chip-hover border-border/70 shadow-sm transition-all hover:shadow-md"
      onClick={() => onClick(suggestion)}
    >
      {suggestion}
    </Button>
  );
}
