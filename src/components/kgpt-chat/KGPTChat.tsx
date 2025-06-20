
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Message } from '@/types';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { submitUserMessage } from '@/app/actions/chatActions';
import { useToast } from '@/hooks/use-toast';
import { KGPTIcon } from './icons';

export function KGPTChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');
  const { toast } = useToast();

  useEffect(() => {
    // Initial greeting message
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: 'kgpt',
        text: "Hello! I'm KGPT. How can I assist you today?",
        timestamp: Date.now(),
        avatar: 'KGPT', // Placeholder for actual icon logic in MessageItem
        suggestions: ["What is KGPT?", "Tell me a fun fact", "How does AI work?"]
      },
    ]);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      timestamp: Date.now(),
      avatar: 'YOU', // Placeholder for actual icon logic
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setConnectionStatus('connecting');

    try {
      const result = await submitUserMessage(text);

      if (result.error) {
        throw new Error(result.error);
      }

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'kgpt',
        text: result.answer,
        timestamp: Date.now(),
        avatar: 'KGPT',
        suggestions: result.suggestions,
        isError: false,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setConnectionStatus('online');
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessageText = error.message || 'Failed to get a response. Please try again.';
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'kgpt',
        text: errorMessageText,
        timestamp: Date.now(),
        avatar: 'KGPT',
        isError: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      toast({
        title: "Error",
        description: errorMessageText,
        variant: "destructive",
      });
      setConnectionStatus('offline');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };
  
  return (
    <div className="flex flex-col h-full w-full bg-card shadow-2xl rounded-xl overflow-hidden border-2 border-border/30">
      <ChatHeader connectionStatus={connectionStatus} />
      <MessageList messages={messages} isLoading={isLoading} onSuggestionClick={handleSuggestionClick} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
