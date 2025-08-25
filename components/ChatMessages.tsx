/**
 * ChatMessages component - Core chat interface that manages message display and interactions.
 * Handles:
 * - Message history display
 * - Real-time message updates
 * - Loading states
 * - Scroll behavior for message overflow
 * - Integration with global chat store
 *
 * Parents: ChatPage
 * Children: Message
 * Uses chat store for message data and local state for loading states.
 * Formats both user and assistant messages with appropriate styling.
 */
import React, { useRef, useEffect, useState } from "react";
import { Message } from "./Message";
import { useChatStore } from "../store/chatStore";
import { Modal } from "./Modal";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { Icons } from "../public/svg/svgs";

interface ChatMessagesProps {
  isLoading: boolean;
  showExpandedSources?: boolean;
}

export function ChatMessages({
  isLoading,
  showExpandedSources = false,
}: ChatMessagesProps) {
  // Get current chat from store
  const getCurrentChat = useChatStore((state) => state.getCurrentChat);
  const currentChat = getCurrentChat();

  // State for welcome modal - start with false to prevent hydration mismatch
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Create ref for messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to handle client-side mounting and show welcome modal
  useEffect(() => {
    // Only show welcome modal if there are no chats or current chat has no messages
    if (!currentChat || currentChat.messages.length === 0) {
      setShowWelcomeModal(true);
    }
  }, [currentChat]);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, isLoading]);

  // Welcome modal content
  const WelcomeContent = () => (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold text-primary mb-2">
        Speak to AI Justin
      </h2>
      <p className="text-white/70 text-lg font-bold">
        Have an initial interview with AI Justin (although real Justin is
        better)
      </p>

      <p className="text-white/70 text-lg mt-2">
        This RAG solution primarily serves as a demonstration of my technical
        proficiency in artificial intelligence and full stack development. This
        product may have limitations regarding performance as it has been
        optimised for cost efficiency.
      </p>
      <h2 className="text-xl font-semibold text-white mt-2">Tech Stack</h2>
      <div className="relative flex h-[350px] w-full flex-col items-center justify-center overflow-hidden">
        <OrbitingCircles iconSize={40} radius={140}>
          <Icons.python />
          <Icons.openai />
          <Icons.langchain />
          <Icons.chromadb />
          <Icons.fastapi />
          <Icons.aws />
          <Icons.jwt />
          {/* <Icons.vercel /> */}
          <Icons.gitHub />
        </OrbitingCircles>
        <OrbitingCircles iconSize={40} radius={70} reverse speed={2}>
          <Icons.nextjs />
          <Icons.react />
          <Icons.tailwind />
          <Icons.magicui />
          <Icons.shadcn />
          <Icons.typescript />
        </OrbitingCircles>
      </div>
      <button
        onClick={() => {
          setShowWelcomeModal(false);
          // Trigger the examples to open after a short delay to ensure the modal is closed
          setTimeout(() => {
            useChatStore.getState().setIsExamplesOpen(true);
          }, 100);
        }}
        className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
      >
        Get Started
      </button>
    </div>
  );

  // If no chat is selected, show empty chat area
  if (!currentChat) {
    return (
      <>
        <Modal
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
        >
          <WelcomeContent />
        </Modal>
        <div className="flex-1 fixed top-1/4 inset-0 -z-10 p-4 bg-transparent" />
        <div className="flex-1 fixed top-1/4 inset-0 -z-10 p-4 bg-transparent">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="relative">
              {/* Welcome screen text */}
              <div className="text-center space-y-4 ml-36 md:ml-64">
                <div className="bg-black/50 p-4 rounded-lg">
                  <h2 className="text-4xl font-semibold text-primary mb-8">
                    Speak to AI Justin
                  </h2>
                  <p className="text-white/70 text-xl">
                    Have an initial interview with AI Justin (although real
                    Justin is better).
                  </p>
                  <br />
                  <p className="text-white/70 text-xl">
                    This is largely to demonstrate my technical AI skills where
                    I have provided a few documents of myself into the RAG
                    model.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex-1 mt-6 overflow-y-auto p-4 bg-transparent">
      <Modal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      >
        <WelcomeContent />
      </Modal>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Show initial message if chat is empty */}
        {currentChat.messages.length === 0 && !isLoading && (
          <Message
            type="assistant"
            content="Please ask me anything about me and my work. I'm here to help!"
            showExpandedSources={showExpandedSources}
          />
        )}

        {/* Message display for chats */}
        {currentChat.messages.map((message, index) => (
          <div key={`message-${index}`}>
            <Message
              type={message.role}
              content={message.content}
              sources={message.sources}
              showExpandedSources={showExpandedSources}
            />
          </div>
        ))}

        {/* Show loading message if needed */}
        {isLoading && (
          <Message
            key="loading-message"
            type="assistant"
            content=""
            isLoading={true}
            showExpandedSources={showExpandedSources}
          />
        )}

        {/* Invisible div for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
