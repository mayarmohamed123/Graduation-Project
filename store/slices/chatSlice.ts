// store/slices/chatSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatApi } from '@/Services/chatApi';
import { signalRService } from '@/Services/signalRServices';
import type { ChatThread, ChatMessage } from '@/types/chat';

interface ChatState {
  threads: ChatThread[];
  currentThread: ChatThread | null;
  messages: ChatMessage[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  loading: boolean;
  error: string | null;
  sendingMessages: Record<number, boolean>; // threadId -> isSending
}

const initialState: ChatState = {
  threads: [],
  currentThread: null,
  messages: [],
  connectionStatus: 'disconnected',
  loading: false,
  error: null,
  sendingMessages: {}
};

// Async Thunks
export const fetchThreads = createAsyncThunk(
  'chat/fetchThreads',
  async () => {
    const response = await chatApi.getMyThreads();
    return response;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (threadId: number) => {
    const response = await chatApi.getMessages(threadId);
    return { threadId, messages: response };
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ threadId, content }: { threadId: number; content: string }, { dispatch }) => {
    const tempId = Date.now(); // Use number for temp ID to match type
    
    // Optimistically add message
    const optimisticMessage: ChatMessage = {
      id: tempId,
      threadId,
      senderId: 'current-user', // This should come from auth
      text: content,
      sentAt: new Date().toISOString(),
      read: true,
      thread: null,
      sender: null
    };
    
    dispatch(addOptimisticMessage(optimisticMessage));
    
    try {
      // Try to send via SignalR first (optional, don't fail if unavailable)
      try {
        await signalRService.sendMessage(threadId, content);
        console.log('Message sent via SignalR');
      } catch (signalrError) {
        console.warn('SignalR unavailable, using HTTP API fallback:', signalrError);
      }
      
      // Always call HTTP API for persistence guarantee
      const response = await chatApi.sendMessage(threadId, content);
      
      // Replace temp message with actual one
      dispatch(replaceMessage({ tempId, actualMessage: response }));
      
      return response;
    } catch (error) {
      console.error('Failed to send message via HTTP API:', error);
      throw error;
    }
  }
);

export const startConversation = createAsyncThunk(
  'chat/startConversation',
  async ({ type, id }: { type: 'pharmacist' | 'doctor', id: string | number }, { dispatch }) => {
    const apiCall = type === 'pharmacist' 
      ? chatApi.startConversationWithPharmacist
      : chatApi.startConversationWithDoctor;
    
    const response = await apiCall(id);
    
    // Refresh threads list
    dispatch(fetchThreads());
    
    return response.id; // Return thread ID
  }
);

export const connectToSignalR = createAsyncThunk(
  'chat/connectToSignalR',
  async (_, { dispatch }) => {
    const token = localStorage.getItem('authToken');
    await signalRService.connect(token || undefined);
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentThread: (state, action: PayloadAction<ChatThread | null>) => {
      state.currentThread = action.payload;
      if (action.payload) {
        // Clear messages when switching threads
        state.messages = [];
        // Join thread in SignalR
        signalRService.joinThread(action.payload.id);
      }
    },
    
    messageReceived: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload;
      
      // Avoid duplicates
      if (state.messages.some(msg => msg.id === message.id)) {
        return;
      }
      
      // Add to messages if it's for current thread
      if (state.currentThread?.id === message.threadId) {
        state.messages.push(message);
      }
      
      // Update thread's last message time
      const threadIndex = state.threads.findIndex(t => t.id === message.threadId);
      if (threadIndex !== -1) {
        state.threads[threadIndex].lastMessage = {
          text: message.text,
          sentAt: message.sentAt
        };
      }
    },
    
    addOptimisticMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    
    replaceMessage: (state, action: PayloadAction<{ tempId: number; actualMessage: ChatMessage }>) => {
      const { tempId, actualMessage } = action.payload;
      const index = state.messages.findIndex(msg => msg.id === tempId);
      if (index !== -1) {
        state.messages[index] = actualMessage;
      }
    },
    
    setConnectionStatus: (state, action: PayloadAction<ChatState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Threads
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch threads';
      });
    
    // Fetch Messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      });
    
    // Send Message
    builder
      .addCase(sendMessage.pending, (state, action) => {
        const { threadId } = action.meta.arg;
        state.sendingMessages[threadId] = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { threadId } = action.meta.arg;
        state.sendingMessages[threadId] = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        const { threadId } = action.meta.arg;
        state.sendingMessages[threadId] = false;
        state.error = action.error.message || 'Failed to send message';
      });
    
    // Connect to SignalR
    builder
      .addCase(connectToSignalR.fulfilled, (state) => {
        state.connectionStatus = 'connected';
      })
      .addCase(connectToSignalR.rejected, (state) => {
        state.connectionStatus = 'disconnected';
      });
  }
});

export const {
  setCurrentThread,
  messageReceived,
  addOptimisticMessage,
  replaceMessage,
  setConnectionStatus,
  clearError
} = chatSlice.actions;

export default chatSlice.reducer;