/**
 * frontend/src/pages/ChatPage.tsx
 * The main component responsible for rendering the chat interface.
 * Manages the state of the current chat and handles message processing.
 */
"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { useChatStore } from "@/store/chatStore";
import Image from "next/image";
import { getCurrentUser } from 'aws-amplify/auth';

export default function ChatPage() {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showExpandedSources] = useState(false);
  const { getCurrentChat, addMessage, ensureActiveChat, fetchUserChats } =
    useChatStore();
  const currentChat = getCurrentChat();

  // Check authentication on mount
  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const checkAuth = async () => {
      try {
        // Add a small delay to let Amplify initialize properly
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const user = await getCurrentUser();
        console.log('Chat page: User authenticated:', user.username);
        if (mounted) {
          setIsAuthLoading(false);
        }
      } catch (error) {
        console.log('Chat page: Authentication check failed:', error, `(attempt ${retryCount + 1}/${maxRetries})`);
        
        // Retry authentication check a few times before redirecting
        if (retryCount < maxRetries && mounted) {
          retryCount++;
          setTimeout(() => {
            if (mounted) {
              checkAuth();
            }
          }, 500 * retryCount); // Exponential backoff
        } else if (mounted) {
          // All retries failed, user is definitely not authenticated
          console.log('Chat page: All authentication retries failed, redirecting to sign in');
          const signInUrl = `https://main.d325l4yh4si1cx.amplifyapp.com/chat/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`
          window.location.href = signInUrl;
        }
      }
    };

    checkAuth();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Ensure an active chat is available when the component mounts
  useEffect(() => {
    if (!isAuthLoading) {
      ensureActiveChat();
    }
  }, [ensureActiveChat, isAuthLoading]);

  // Add this useEffect to fetch chats when the component mounts
  useEffect(() => {
    if (!isAuthLoading) {
      // Fetch user chats when the page loads
      fetchUserChats();
    }
  }, [fetchUserChats, isAuthLoading]);

  // Show loading while checking authentication
  if (isAuthLoading) {
    return (
      <div className="flex h-[calc(100vh-2rem)] items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/data-background.jpeg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Handle sending a new message
  const handleMessageSent = async (userMessage: string) => {
    if (!currentChat) return;
    try {
      setIsLoading(true);

      // Add temporary user message
      addMessage(currentChat.id, {
        role: "user",
        content: userMessage,
      });

      // Retrieve the last 5 messages from the chat for the conversation history
      const conversationHistory = currentChat.messages.slice(-5).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send request to the backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      // Get token from localStorage (temporarily disabled)
      // const authStorageJson = localStorage.getItem("auth-storage");
      // const authStorage = authStorageJson ? JSON.parse(authStorageJson) : {};
      // const token = authStorage.state?.token || "";

      const response = await fetch(`${backendUrl}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // Temporarily disabled for testing
        },
        body: JSON.stringify({
          content: userMessage,
          conversation_history: conversationHistory,
          chat_id: currentChat.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();

      // Update with backend-generated chat ID if new chat
      if (data.chat_id && data.chat_id !== currentChat.id) {
        const updatedChat = {
          ...currentChat,
          id: data.chat_id,
          messages: currentChat.messages.map((msg) =>
            msg.role === "user" && msg.content === userMessage
              ? { ...msg, chatId: data.chat_id }
              : msg
          ),
        };
        useChatStore
          .getState()
          .setChats(
            useChatStore
              .getState()
              .chats.map((chat) =>
                chat.id === currentChat.id ? updatedChat : chat
              )
          );
        useChatStore.getState().setCurrentChat(data.chat_id);
      }

      addMessage(data.chat_id || currentChat.id, {
        role: "assistant",
        content: data.response,
        sources: data.sources,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage(currentChat.id, {
        role: "assistant",
        content: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Actualy components you see displayed (e.g. sidebar, header, messages, input, & feature tour)
  return (
    <div className="flex h-[calc(100vh-2rem)]">
      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/data-background.jpeg"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>
          <ChatMessages
            isLoading={isLoading}
            showExpandedSources={showExpandedSources}
          />
          {/* Only show input if there's an active chat */}
          {currentChat && (
            <ChatInput
              onSendMessage={handleMessageSent}
              disabled={isLoading}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
