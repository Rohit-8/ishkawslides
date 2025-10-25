import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { generateSessionId } from '../utils/helpers';
import { storage } from '../utils/helpers';

const CHAT_HISTORY_KEY = 'magicslides_chat_history';

interface UseChatReturn {
  messages: ChatMessage[];
  sessionId: string;
  addMessage: (role: 'user' | 'assistant', content: string, presentationId?: string) => void;
  clearHistory: () => void;
  loadHistory: () => void;
}

export const useChat = (): UseChatReturn => {
  const [sessionId] = useState(() => generateSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = useCallback((
    role: 'user' | 'assistant',
    content: string,
    presentationId?: string
  ) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      presentationId,
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      // Save to localStorage
      storage.set(CHAT_HISTORY_KEY, updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    storage.remove(CHAT_HISTORY_KEY);
  }, []);

  const loadHistory = useCallback(() => {
    const savedMessages = storage.get<ChatMessage[]>(CHAT_HISTORY_KEY, []);
    // Convert timestamp strings back to Date objects
    const messagesWithDates = savedMessages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
    setMessages(messagesWithDates);
  }, []);

  return {
    messages,
    sessionId,
    addMessage,
    clearHistory,
    loadHistory,
  };
};