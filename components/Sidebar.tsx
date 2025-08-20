"use client"

// Sidebar.tsx
/**
* Sidebar component - Manages chat history and new conversation creation.
* Features:
* - New Chat button to start fresh conversations (limited to one "New Chat" at a time)
* - Search functionality for past chats
* - List of previous conversations with preview
* - Rounded selection highlighting
* - Star/favorite shown inline when active
* - Custom delete confirmation popup
*/

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Star, Trash2, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const {
    chats,
    currentChatId,
    createChat,
    deleteChat,
    setCurrentChat,
    toggleStarChat,
    updateChatTitle
  } = useChatStore();

  const existingNewChat = chats.find(chat => chat.title === "New Chat");
  const isOnNewChat = currentChatId !== null && existingNewChat?.id === currentChatId;

  const handleNewChatClick = () => {
    if (existingNewChat) {
      setCurrentChat(existingNewChat.id);
    } else {
      createChat();
    }
  };

  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  const startEditing = (chat: { id: string, title: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleTitleSubmit = () => {
    if (editingChatId) {
      const newTitle = editingTitle.trim();
      if (newTitle) {
        updateChatTitle(editingChatId, newTitle);
      }
      setEditingChatId(null);
      setEditingTitle('');
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingChatId(null);
      setEditingTitle('');
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.starred && !b.starred) return -1;
    if (!a.starred && b.starred) return 1;
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });

  const handleDeleteClick = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatToDelete(chatId);
  };

  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete);
      setChatToDelete(null);
    }
  };

  return (
    <div className="flex">
      <div className="w-36 md:w-64 bg-foreground/80 backdrop-blur-lg flex flex-col min-h-screen pt-16">
        <div className="p-4">
          <button 
            onClick={handleNewChatClick}
            disabled={isOnNewChat}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isOnNewChat 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-white text-foreground hover:bg-white/90 hover:shadow-md'
            }`}
          >
            <Plus className="w-4 h-4" />
            {existingNewChat && !isOnNewChat ? 'New Chat' : 'New Chat'}
          </button>
        </div>
        
        <div className="px-4 pb-4">
          <div className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full bg-black text-white pl-9 pr-4 py-2 rounded-lg placeholder-white/60 border-2 border-white/20 focus:border-white/40 focus:outline-none transition-all duration-200"
            />
            <Search className="w-4 h-4 text-white/60 absolute left-3 top-3" />
          </div>
        </div>

        <div className="mx-2 border-t border-border/30 mb-2" />

        <div className="flex-1 overflow-y-auto px-2">
          {sortedChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChat(chat.id)}
              className={`
                group mx-2 rounded-lg cursor-pointer mb-1 transition-all duration-200
                ${chat.id === currentChatId 
                  ? 'bg-primary/20 text-primary border-l-4 border-primary translate-y-[-2px]' 
                  : 'bg-transparent hover:bg-secondary/20 border-l-4 border-transparent'}
              `}
            >
              <div className="px-3 py-3">
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1 pr-2 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2 w-full overflow-hidden">
                      <div className="flex-shrink-0">
                        {chat.starred && (
                          <Star className="w-4 h-4 text-primary fill-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        {editingChatId === chat.id ? (
                          <input
                            ref={editInputRef}
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={handleTitleSubmit}
                            onKeyDown={handleTitleKeyDown}
                            className="text-white font-medium bg-white/10 rounded px-2 py-1 w-full outline-none transition-all duration-200"
                            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                              e.stopPropagation();
                            }}
                          />
                        ) : (
                          <div 
                            onDoubleClick={(e) => startEditing(chat, e)}
                            className={`font-medium truncate transition-all duration-200 ${
                              chat.id === currentChatId ? 'text-primary' : 'text-white'
                            }`}
                          >
                            {chat.title}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`text-xs mt-1 transition-all duration-200 ${
                      chat.id === currentChatId ? 'text-primary/70' : 'text-muted-foreground'
                    }`}>
                      {new Date(chat.lastUpdated).toLocaleDateString()} · {new Date(chat.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="md:flex items-center gap-1 hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarChat(chat.id);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-black/20 rounded transition-all duration-200"
                    >
                      <Star 
                        className={`w-4 h-4 text-white ${chat.starred ? 'fill-white' : ''}`}
                      />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(chat.id, e)}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-black/20 rounded transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-white hover:text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {chatToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-foreground">Delete Chat</h3>
                <button 
                  onClick={() => setChatToDelete(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this chat? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setChatToDelete(null)}
                  className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}