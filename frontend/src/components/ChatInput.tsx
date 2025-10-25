import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { isValidPrompt } from '../utils/helpers';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Describe the presentation you want to create...",
  suggestions = []
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (trimmedMessage && isValidPrompt(trimmedMessage) && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const isValid = isValidPrompt(message.trim());

  return (
    <div className="relative">
      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
            Suggestions
          </div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
            >
              <Sparkles size={14} className="text-primary-500 flex-shrink-0" />
              <span className="truncate">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={placeholder}
              className="w-full resize-none border-none outline-none text-sm leading-relaxed min-h-[40px] max-h-[120px] placeholder-gray-400"
              disabled={isLoading}
              rows={1}
            />
            
            {/* Character count */}
            <div className="absolute -bottom-5 right-0 text-xs text-gray-400">
              {message.length}/1000
            </div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isValid && !isLoading
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        {/* Validation Message */}
        {message.trim() && !isValid && (
          <div className="mt-2 text-xs text-red-500">
            {message.trim().length < 10 
              ? 'Please enter at least 10 characters' 
              : 'Message too long (max 1000 characters)'
            }
          </div>
        )}
      </form>
    </div>
  );
};