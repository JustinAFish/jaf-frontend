/**
 * frontend/src/store/chatStore.ts
 * Manages the state and actions for the chat history functionality using Zustand.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define the data structures for the chat store
export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  starred?: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

interface Source {
  title: string;
  content: string;
  document_path: string;
  document_title: string;
  relevance: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

// Define the chat store interface with state and actions
interface ChatStore {
  
  // Define states
  chats: Chat[];                    // An array of Chat objects, representing the user's chat history
  currentChatId: string | null;     // The ID of the currently active chat
  isExamplesOpen: boolean;          // Whether the example questions panel is open
  
  // Define the actions that can be performed on the chat store's state
  createChat: () => string;
  deleteChat: (id: string) => void;
  setCurrentChat: (id: string) => void;
  updateChatTitle: (id: string, title: string) => void;
  toggleStarChat: (id: string) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  getCurrentChat: () => Chat | undefined;
  ensureActiveChat: () => void;
  setChats: (chats: Chat[]) => void;
  fetchUserChats: () => Promise<void>;
  setIsExamplesOpen: (isOpen: boolean) => void;
}

// Create the chat store using Zustand
export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({

      // Initialize the state
      chats: [],
      currentChatId: null,
      isExamplesOpen: false,

      // Action to create a new chat
      createChat: () => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          lastUpdated: new Date()
        };
        
        // Add the new chat to the state
        set(state => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id
        }));

        return newChat.id;
      },

      // Action to delete a chat
      deleteChat: (id: string) => {
        const state = get();
        const currentIndex = state.chats.findIndex(chat => chat.id === id);
        const isCurrentChat = id === state.currentChatId;

        // Remove the chat from the state
        const newChats = state.chats.filter(chat => chat.id !== id);

        // Set the new current chat or create a new one if necessary
        let nextChatId: string | null = state.currentChatId;
        if (isCurrentChat) {
          if (newChats.length > 0) {
            const nextChat = newChats[currentIndex] || newChats[currentIndex - 1];
            nextChatId = nextChat ? nextChat.id : null;
          } else {
            const newChatId = get().createChat();
            nextChatId = newChatId;
          }
        }

        set({
          chats: newChats,
          currentChatId: nextChatId
        });
      },

      // Action to set the current chat
      setCurrentChat: (id: string) => {
        set({ currentChatId: id });
      },

      // Action to update the title of a chat
      updateChatTitle: (id: string, title: string) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === id ? { ...chat, title } : chat
          )
        }));
      },

      // Action to toggle the starred status of a chat
      toggleStarChat: (id: string) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === id ? { ...chat, starred: !chat.starred } : chat
          )
        }));
      },

      // Action to add a new message to a chat
      addMessage: (chatId: string, message) => {
        const fullMessage: Message = {
          id: crypto.randomUUID(),
          ...message,
          timestamp: new Date(),
          // Sources are now passed through directly since they match type
          sources: message.sources
        };

        
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, fullMessage],
                  lastUpdated: new Date(),
                  title: chat.title === 'New Chat' && chat.messages.length === 0
                    ? `${message.content.slice(0, 30)}...`
                    : chat.title
                }
              : chat
          )
        }));
      },

      // Action to get the current chat
      getCurrentChat: () => {
        const state = get();
        return state.chats.find(chat => chat.id === state.currentChatId);
      },

      // Action to ensure there is an active chat
      ensureActiveChat: () => {
        const state = get();
        if (!state.currentChatId || !state.chats.find(chat => chat.id === state.currentChatId)) {
          if (state.chats.length > 0) {
            set({ currentChatId: state.chats[0].id });
          } else {
            get().createChat();
          }
        }
      },

      // Action to set the chats
      setChats: (chats: Chat[]) => {
        set({
          chats: chats,
          currentChatId: chats.length > 0 ? chats[0].id : null
        });
      },

      // Add this function to fetch chats from the backend
      fetchUserChats: async () => {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          
          // Get token from localStorage
          const authStorageJson = localStorage.getItem('auth-storage');
          const authStorage = authStorageJson ? JSON.parse(authStorageJson) : {};
          const token = authStorage.state?.token || '';
          
          if (!token) {
            console.warn("No authentication token found, skipping chat fetch");
            return;
          }
          
          console.log("Fetching user chats...");
          
          // Use AbortController to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          try {
            const response = await fetch(`${backendUrl}/api/chat/user/chats`, {
              method: "GET",
              headers: {
                // "Authorization": `Bearer ${token}` // Temporarily disabled for testing
              },
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              if (response.status === 404) {
                console.warn("Chats endpoint not found, initializing empty chat list");
                set({ chats: [] });
                return;
              }
              console.warn(`Failed to fetch chats: ${response.status}`);
              return;
            }
            
            const data = await response.json();
            
            // Transform the data to match the store's format
            const transformedChats = Array.isArray(data.chats) ? data.chats.map((chat: { 
              id: string;
              title?: string;
              messages?: Array<{
                role: 'user' | 'assistant';
                content: string;
                sources?: Source[];
                created_at: string;
              }>;
              created_at: string;
              updated_at: string;
            }) => ({
              id: chat.id,
              title: chat.title || "New Chat",
              messages: Array.isArray(chat.messages) ? chat.messages.map(msg => ({
                role: msg.role,
                content: msg.content,
                sources: msg.sources || [],
                timestamp: new Date(msg.created_at)
              })) : [],
              createdAt: new Date(chat.created_at),
              updatedAt: new Date(chat.updated_at)
            })) : [];
            
            // Update the chats in the store
            set({ chats: transformedChats });
            
            // If there are chats and no current chat is selected, select the first one
            if (transformedChats.length > 0 && !get().currentChatId) {
              set({ currentChatId: transformedChats[0].id });
            }
            
            console.log(`Fetched ${transformedChats.length} chats from server`);
          } catch (fetchError) {
            clearTimeout(timeoutId);
            console.error("Error fetching chats:", fetchError instanceof Error ? fetchError.message : "Unknown error");
          }
        } catch (error) {
          console.error("Error in fetchUserChats:", error instanceof Error ? error.message : "Unknown error");
        }
      },

      // Action to set isExamplesOpen
      setIsExamplesOpen: (isOpen: boolean) => {
        set({ isExamplesOpen: isOpen });
      },
    }),

    {
      name: 'honda-chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId
      })
    }
  )
);