
"use client";

import React, { useState } from 'react';
import type { Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { KGPTIcon, UserIcon, CopyIcon, ReactionIcon, ErrorIcon } from './icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { SuggestionChip } from './SuggestionChip';

interface MessageItemProps {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
}

export function MessageItem({ message, onSuggestionClick }: MessageItemProps) {
  const { toast } = useToast();
  const [showActions, setShowActions] = useState(false);

  const isUser = message.sender === 'user';
  const isAI = message.sender === 'kgpt';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    toast({ title: "Copied to clipboard!", duration: 2000 });
  };

  const getAvatarFallback = () => {
    if (isAI) return <KGPTIcon className="h-5 w-5" />;
    if (isUser) return <UserIcon className="h-5 w-5" />;
    return <UserIcon className="h-5 w-5" />; // Default fallback
  };

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2.5 group animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isAI && (
        <Avatar className="h-8 w-8 self-start shadow-sm">
          {/* AI might have image avatars in the future, for now uses fallback */}
          <AvatarFallback className="bg-ai-bubble text-ai-bubble-foreground">{getAvatarFallback()}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col gap-1 w-full", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "relative px-4 py-2.5 shadow-md break-words min-h-0", // Added min-h-0
            "rounded-xl",
            isUser 
              ? "bg-user-bubble text-user-bubble-foreground rounded-br-none max-w-[80%] sm:max-w-[75%]" 
              : "bg-ai-bubble text-ai-bubble-foreground rounded-bl-none max-w-[60%] sm:max-w-[50%]", 
            message.isError && "bg-destructive text-destructive-foreground"
          )}
        >
          {message.isError && <ErrorIcon className="inline-block h-4 w-4 mr-1.5 mb-0.5 text-destructive-foreground" />}
          <ReactMarkdown
            className="markdown-content"
            remarkPlugins={[remarkGfm]}
            components={{
              // Customize if needed, e.g., for syntax highlighting
            }}
          >
            {message.text}
          </ReactMarkdown>
          {showActions && !message.isError && (
            <div className={cn(
              "absolute -top-3.5 flex gap-1 p-0.5 rounded-full bg-card border shadow-sm transition-opacity opacity-0 group-hover:opacity-100",
              isUser ? "right-2" : "left-2"
            )}>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy} title="Copy text">
                <CopyIcon className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" title="React">
                <ReactionIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
        <span className={cn("text-xs text-muted-foreground px-1", isUser ? "text-right" : "text-left")}>
          {format(new Date(message.timestamp), "p")}
        </span>

        {isAI && message.suggestions && message.suggestions.length > 0 && (
           <div className="flex overflow-x-auto space-x-2 p-2 max-w-full">
            {message.suggestions.map((suggestion, index) => (
              <SuggestionChip key={index} suggestion={suggestion} onClick={onSuggestionClick} />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 self-start shadow-sm">
           {message.avatar && typeof message.avatar === 'string' && !message.avatar.match(/^[A-Z]+$/) ? <AvatarImage src={message.avatar} alt="User Avatar" /> : null}
          <AvatarFallback className="bg-user-bubble text-user-bubble-foreground">{getAvatarFallback()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
