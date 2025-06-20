
"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon } from './icons';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MAX_TEXTAREA_ROWS = 4;
const BASE_TEXTAREA_HEIGHT = 24; // Approximate height for one line in px

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      const currentRows = Math.round(scrollHeight / BASE_TEXTAREA_HEIGHT);
      
      if (currentRows <= MAX_TEXTAREA_ROWS) {
        textareaRef.current.style.height = `${scrollHeight}px`;
      } else {
        // Cap height at MAX_TEXTAREA_ROWS equivalent
        textareaRef.current.style.height = `${MAX_TEXTAREA_ROWS * BASE_TEXTAREA_HEIGHT + (MAX_TEXTAREA_ROWS * 8)}px`; // + padding
        textareaRef.current.style.overflowY = 'auto';
      }
      
      if (currentRows < MAX_TEXTAREA_ROWS) {
         textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [inputValue]);

  const handleSubmit = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput && !isLoading) {
      onSendMessage(trimmedInput);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height after send
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 border-t bg-card/80 backdrop-blur-md">
      <div className="flex items-end gap-2 relative">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask KGPT anything..."
          className="flex-grow resize-none pr-12 py-2.5 min-h-[44px] max-h-[120px] rounded-xl shadow-sm focus-visible:ring-primary focus-visible:ring-2 disabled:opacity-70 text-base"
          rows={1}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <Button
          type="button"
          size="icon"
          className={cn(
            "absolute right-2 bottom-1.5 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-opacity duration-200",
            (!inputValue.trim() || isLoading) ? "opacity-50 cursor-not-allowed" : "opacity-100",
            isLoading && "opacity-70"
          )}
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isLoading}
          aria-label="Send message"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
