/**
 * frontend/src/components/ChatInput.tsx
 * ChatInput component - Handles user message input and submission.
 * Features:
 * - Message input field
 * - Send button with loading state
 * - Example questions button with lightbulb icon
 * - Hint animation for new chats
 * 
 * Pure presentational component that delegates all data handling to parent.
 * Manages only UI-specific state (input field value).
 */
import React, { useState, useEffect } from 'react';
import { Send, Lightbulb } from 'lucide-react';
import { ExampleQuestions } from './ExampleQuestions';
import { useChatStore } from '@/store/chatStore';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  messageCount?: number;
  isLoading?: boolean;
}

export function ChatInput({ 
  onSendMessage, 
  disabled, 
  messageCount = 0,
  isLoading 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const { isExamplesOpen, setIsExamplesOpen } = useChatStore();

  useEffect(() => {
    if (messageCount === 0) {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [messageCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentMessage = message.trim();
    if (!currentMessage || disabled) return;

    onSendMessage(currentMessage);
    setMessage('');
    setShowHint(false);
  };

  const handleExamplesButtonClick = () => {
    setIsExamplesOpen(!isExamplesOpen);
    setShowHint(false);
  };
  
  const handleExampleClick = (question: string) => {
    onSendMessage(question);
    setIsExamplesOpen(false);
    setShowHint(false);
  };

  return (
    <div className="sticky bottom-0">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto w-full">
        <div className="card hover-lift flex items-center gap-2 p-2 transition-all duration-300">
          <div className="relative">
            <button 
              type="button"
              onClick={handleExamplesButtonClick}
              className="relative p-2.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all duration-200 group"
              disabled={disabled}
            >
              <Lightbulb 
                className={`w-5 h-5 transition-all duration-300 ${
                  showHint ? 'animate-pulse text-primary' : ''
                }`}
              />
              
              {showHint && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-card text-white text-xs rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 border border-border/50">
                  Click for example questions
                </div>
              )}
            </button>

            <ExampleQuestions 
              isOpen={isExamplesOpen}
              onClose={() => setIsExamplesOpen(false)}
              onQuestionClick={handleExampleClick}
            />
          </div>
          
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 p-3 bg-transparent text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
            disabled={disabled}
          />
          
          <button 
            type="submit"
            disabled={disabled || isLoading}
            className={`p-2.5 bg-primary hover:bg-primary/90 rounded-lg text-primary-foreground flex items-center justify-center transition-all duration-200 ${
              (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:scale-105'
            }`}
          >
            <Send className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </form>
    </div>
  );
}