import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { formatTimestamp } from '../utils/helpers';
import { User, Bot, FileText } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-primary-600 text-white' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-primary-600 text-white rounded-br-md' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {message.presentationId && (
            <div className={`mt-2 pt-2 border-t ${
              isUser ? 'border-primary-500' : 'border-gray-200'
            } flex items-center gap-2 text-xs opacity-75`}>
              <FileText size={12} />
              <span>Presentation attached</span>
            </div>
          )}
        </div>
        
        <span className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};