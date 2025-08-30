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
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

export default function ChatPage() {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [showExpandedSources] = useState(false);
  const { getCurrentChat, addMessage, ensureActiveChat, fetchUserChats } =
    useChatStore();
  const currentChat = getCurrentChat();

  // Ensure an active chat is available when the component mounts
  useEffect(() => {
    ensureActiveChat();
  }, [ensureActiveChat]);

  // Add this useEffect to fetch chats when the component mounts
  useEffect(() => {
    // Fetch user chats when the page loads
    fetchUserChats();
  }, [fetchUserChats]);

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
