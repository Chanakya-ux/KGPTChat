
"use client";

import { motion } from 'framer-motion';
import { KGPTIcon } from './icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -3, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex items-end gap-2.5 self-start mb-4 animate-fade-in">
      <Avatar className="h-8 w-8 self-start shadow-sm">
        <AvatarFallback className="bg-ai-bubble text-ai-bubble-foreground">
          <KGPTIcon className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center space-x-1.5 rounded-xl rounded-bl-none bg-ai-bubble px-4 py-3 shadow-md">
        <motion.div
          variants={dotVariants}
          initial="initial"
          animate="animate"
          className="h-2 w-2 rounded-full bg-ai-bubble-foreground/70"
          style={{ animationDelay: '0s' }}
        />
        <motion.div
          variants={dotVariants}
          initial="initial"
          animate="animate"
          className="h-2 w-2 rounded-full bg-ai-bubble-foreground/70"
          style={{ animationDelay: '0.1s' }}
        />
        <motion.div
          variants={dotVariants}
          initial="initial"
          animate="animate"
          className="h-2 w-2 rounded-full bg-ai-bubble-foreground/70"
          style={{ animationDelay: '0.2s' }}
        />
      </div>
    </div>
  );
}
