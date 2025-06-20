
"use client";

import React, { useEffect, useRef } from 'react';
import type { Message } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { format, isSameDay, parseISO } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

export function MessageList({ messages, isLoading, onSuggestionClick }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const renderMessagesWithDateSeparators = () => {
    const messageElements: JSX.Element[] = [];
    let lastDate: Date | null = null;

    messages.forEach((msg, index) => {
      const messageDate = new Date(msg.timestamp);
      if (!lastDate || !isSameDay(messageDate, lastDate)) {
        messageElements.push(
          <div key={`date-${msg.id}`} className="flex justify-center my-4">
            <span className="text-xs text-date-separator-foreground bg-date-separator px-3 py-1 rounded-full shadow-sm">
              {format(messageDate, "MMMM d, yyyy")}
            </span>
          </div>
        );
        lastDate = messageDate;
      }
      messageElements.push(
        <MessageItem key={msg.id} message={msg} onSuggestionClick={onSuggestionClick} />
      );
    });
    return messageElements;
  };

  return (
    <ScrollArea className="flex-grow p-4 sm:p-6" ref={scrollAreaRef} viewportRef={viewportRef}>
      <div className="space-y-6">
        {renderMessagesWithDateSeparators()}
        {isLoading && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}
