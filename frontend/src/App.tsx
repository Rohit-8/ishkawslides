import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sparkles, MessageSquare, Presentation, Trash2, RefreshCw } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ProgressIndicator } from './components/ProgressIndicator';
import { PresentationPreview } from './components/PresentationPreview';
import { useSocket } from './hooks/useSocket';
import { useChat } from './hooks/useChat';
import { chatApi } from './services/api';
import './App.css';

function App() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const {
    isConnected,
    generatePresentation,
    editPresentation,
    progress,
    result,
    error,
    isGenerating,
    clearResult,
  } = useSocket();
  
  const { messages, sessionId, addMessage, clearHistory, loadHistory } = useChat();

  // Load chat history and suggestions on mount
  useEffect(() => {
    loadHistory();
    
    const fetchSuggestions = async () => {
      try {
        const fetchedSuggestions = await chatApi.getSuggestions();
        setSuggestions(fetchedSuggestions);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };
    
    fetchSuggestions();
  }, [loadHistory]);

  const handleSendMessage = (message: string) => {
    // Add user message to chat
    addMessage('user', message);
    
    if (result) {
      // If we have a current presentation, this is an edit request
      editPresentation(message, result.presentationData, sessionId);
      addMessage('assistant', `Editing presentation: ${message}`);
    } else {
      // This is a new presentation request
      generatePresentation(message, sessionId);
      addMessage('assistant', `Creating presentation: ${message}`);
    }
  };

  const handleEditPresentation = (editPrompt: string) => {
    if (result) {
      addMessage('user', editPrompt);
      editPresentation(editPrompt, result.presentationData, sessionId);
      addMessage('assistant', `Applying changes: ${editPrompt}`);
    }
  };

  const handleNewPresentation = () => {
    clearResult();
    clearHistory();
  };

  const ConnectionStatus = () => (
    <div className={`flex items-center gap-2 text-sm ${
      isConnected ? 'text-green-600' : 'text-red-500'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-500' : 'bg-red-500'
      }`} />
      {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">MagicSlides AI</h1>
                <p className="text-sm text-gray-600">Create presentations with AI</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ConnectionStatus />
              {result && (
                <button
                  onClick={handleNewPresentation}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  New Presentation
                </button>
              )}
              {messages.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear chat history"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]">
          {/* Chat Panel */}
          <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-gray-200">
              <MessageSquare size={20} className="text-primary-600" />
              <h2 className="font-semibold text-gray-900">Chat</h2>
              <span className="text-sm text-gray-500">({messages.length})</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <Sparkles size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Welcome to MagicSlides AI
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Describe the presentation you want to create and I'll generate it for you.
                    </p>
                    <div className="text-left space-y-2">
                      <p className="text-sm font-medium text-gray-700">Try these examples:</p>
                      {suggestions.slice(0, 3).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                        >
                          "{suggestion}"
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {/* Progress Indicator */}
                  {progress && (
                    <div className="px-4">
                      <ProgressIndicator progress={progress} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isGenerating}
                placeholder={result 
                  ? "Ask me to edit the presentation..." 
                  : "Describe the presentation you want to create..."
                }
                suggestions={suggestions}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-gray-200">
              <Presentation size={20} className="text-primary-600" />
              <h2 className="font-semibold text-gray-900">Preview</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {result ? (
                <PresentationPreview
                  presentation={result.presentationData}
                  filename={result.filename}
                  downloadUrl={result.downloadUrl}
                  onEdit={handleEditPresentation}
                />
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <Presentation size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Presentation Yet
                    </h3>
                    <p className="text-gray-600">
                      Start a conversation to generate your first presentation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
