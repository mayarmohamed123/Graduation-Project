// hooks/useChat.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { 
  setCurrentThread, 
  fetchThreads, 
  fetchMessages, 
  sendMessage, 
  startConversation,
  connectToSignalR
} from '@/store/slices/chatSlice';

export const useChat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatState = useSelector((state: RootState) => state.chat);

  return {
    // State
    ...chatState,
    
    // Actions
    selectThread: (threadId: number) => {
      const thread = chatState.threads.find(t => t.id === threadId);
      if (thread) {
        dispatch(setCurrentThread(thread));
        dispatch(fetchMessages(threadId));
      }
    },
    
    loadThreads: () => dispatch(fetchThreads()),
    
    sendMessage: (content: string) => {
      if (!chatState.currentThread) return;
      return dispatch(sendMessage({ 
        threadId: chatState.currentThread.id, 
        content 
      })).unwrap();
    },
    
    startNewConversation: (type: 'pharmacist' | 'doctor', id: string | number) => 
      dispatch(startConversation({ type, id })).unwrap(),
    
    connect: () => dispatch(connectToSignalR()),
    
    disconnect: () => {
      // You might want to add disconnect action to slice
      // For now, we'll handle it differently
    }
  };
};