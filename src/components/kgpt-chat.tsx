"use client";

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import type { Message } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SendHorizontal, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

// Changed to use the internal Next.js API route for proxying
const KGPT_API_URL = '/api/kgpt';

export function KGPTChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Focus input on load
    inputRef.current?.focus();
    // Add an initial welcome message from KGPT
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: 'kgpt',
        text: "Hello! I'm KGPT. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, []);

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: trimmedInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(KGPT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.text }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json(); // Our API route returns { error: "message" }
        } catch (parseError) {
          // If response is not JSON, use generic error
        }
        // Use errorData.error if available (from our proxy), otherwise default message
        throw new Error(errorData?.error || `API request failed with status ${response.status}`);
      }

      const data = await response.json(); // Our API route forwards the { answer: "..." } structure on success
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'kgpt',
        text: data.answer || "Sorry, I couldn't get a valid response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error connecting to API:", error);
      const errorMessageText = error instanceof Error ? error.message : 'Error connecting to API.';
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'kgpt',
        text: errorMessageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <Card className="flex flex-col w-full h-full shadow-2xl rounded-xl overflow-hidden border-2 border-border/50">
      <CardHeader className="p-4 border-b bg-card-foreground/[.03]">
        <CardTitle className="text-xl font-headline font-semibold text-center text-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          KGPT Chat
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-grow bg-background/30">
        <div className="p-4 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-end gap-2 animate-in fade-in-0 zoom-in-95 duration-300",
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.sender === 'kgpt' && (
                <Avatar className="h-8 w-8 self-start shadow-sm">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">AI</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col max-w-[75%] sm:max-w-[70%]">
                <div
                  className={cn(
                    'px-4 py-2.5 text-sm shadow-md break-words',
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-t-xl rounded-l-xl'
                      : 'bg-card text-foreground rounded-t-xl rounded-r-xl border border-border/50',
                    msg.text.startsWith('Error') || (msg.sender === 'kgpt' && !msg.text.includes("Hello! I'm KGPT.")) && (messages[messages.indexOf(msg)-1]?.sender === 'user' && !msg.text.startsWith("Sorry, I couldn't get a valid response.") && !msg.text.startsWith("External API error"))  ? 'bg-destructive text-destructive-foreground' : ''
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.timestamp && (
                   <span className={cn(
                     "text-xs text-muted-foreground mt-1 px-1",
                     msg.sender === 'user' ? 'text-right' : 'text-left'
                   )}>
                     {msg.timestamp}
                   </span>
                )}
              </div>
               {msg.sender === 'user' && (
                <Avatar className="h-8 w-8 self-start shadow-sm">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">YOU</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <CardFooter className="p-3 sm:p-4 border-t bg-card-foreground/[.03]">
        <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask KGPT anything..."
            className="flex-grow h-10 text-base sm:text-sm focus-visible:ring-accent focus-visible:ring-2 disabled:opacity-70"
            disabled={isLoading}
            aria-label="Chat message input"
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="h-10 w-10 sm:w-auto sm:px-4 shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground"
            aria-label="Send message"
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <SendHorizontal className="h-5 w-5 sm:mr-0 md:mr-2" />
                <span className="hidden md:inline">Send</span>
              </>
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
