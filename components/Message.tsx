// Message.tsx
/**
 * Message component - Individual message display for both user and assistant messages.
 * Features:
 * - Distinct styling for user vs assistant messages
 * - Source document display for assistant responses
 * - Loading state animation
 * - Error state handling
 * 
 * Used by ChatMessages to render each message in the conversation.
 * Handles both simple text and complex responses with sources.
 */
import React from 'react';
import { User, BookOpen, Bot } from 'lucide-react';
import { SourceDocumentCard } from './SourceDocumentCard';
import type { Source } from '../types/chat';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  type: 'user' | 'assistant';
  content: string;
  sources?: Source[] | string; 
  isLoading?: boolean;
  showExpandedSources?: boolean;
}

export function Message({ type, content, sources, isLoading, showExpandedSources = false  }: MessageProps) {
  
  // Render user message
  if (type === 'user') {
    return (
      <div className="w-full my-4 animate-fadeIn">
        <div className="card hover-lift bg-secondary/50 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            {/* User message content */}
            <div className="flex-1">
              <p className="text-white leading-relaxed">{content}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render assistant message
  return (
    <div className="w-full my-4 animate-fadeIn">
      <div className="card hover-lift bg-card p-6 rounded-2xl ai-glow">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1">
            {/* Loading state */}
            {isLoading ? (
              <div className="loading-dots flex gap-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
              </div>
            ) : (
              <>
                {/* Assistant message content with markdown */}
                <div className="text-white leading-relaxed mb-4 prose prose-invert max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
                
                {/* Source documents */}
                {sources && (
                  <div className="mt-6 animate-fadeIn">
                    <div className="flex items-center gap-2 text-base font-medium text-muted-foreground mb-4">
                      <BookOpen className="w-4 h-4" />
                      <span>Source Documents</span>
                    </div>
                  
                    {/* Display sources */}
                    {typeof sources === 'string' ? (
                      <p className="text-sm text-muted-foreground">{sources}</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
                        {sources.map((source, index) => (
                          <div className="h-fit transition-all" key={`${source.document_path}-${index}`}>
                            <SourceDocumentCard 
                              source={source}
                              forceExpanded={showExpandedSources}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}