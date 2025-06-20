
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    // Set initial greeting message only if messages array is currently empty.
    // This prevents overwriting a user's message if they interact very quickly.
    if (messages.length === 0) {
      setMessages([
        {
          id: 'initial-greeting-kgpt', // Static ID for the initial message
          sender: 'kgpt',
          text: "Hello! I'm KGPT. How can I assist you today?",
          timestamp: Date.now(), // Fine in useEffect for client components
          avatar: 'KGPT',
          suggestions: ["When is Spring Fest?", "When is Summer Break?", "When are Summer Quarter classes?"]
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once after mount.

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      timestamp: Date.now(),
      avatar: 'YOU',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setConnectionStatus('connecting');

    try {
      const result = await submitUserMessage(text);

      if (result.error) {
        const apiErrorAsMessage: Message = {
          id: crypto.randomUUID(),
          sender: 'kgpt',
          text: result.error,
          timestamp: Date.now(),
          avatar: 'KGPT',
          isError: true,
        };
        setMessages((prevMessages) => [...prevMessages, apiErrorAsMessage]);
        toast({
          title: "API Error",
          description: result.error,
          variant: "destructive",
        });
        setConnectionStatus('offline');
      } else {
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
      }
    } catch (error: any) {
      console.error("Error sending message via action:", error);
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
  }, [toast]); // Removed `messages` from dependency array

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
