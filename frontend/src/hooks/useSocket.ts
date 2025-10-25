import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socket';
import { GenerationProgress, GenerationResult, PresentationData } from '../types';
import toast from 'react-hot-toast';

interface UseSocketReturn {
  isConnected: boolean;
  generatePresentation: (prompt: string, sessionId: string) => void;
  editPresentation: (editPrompt: string, currentPresentation: PresentationData, sessionId: string) => void;
  progress: GenerationProgress | null;
  result: GenerationResult | null;
  error: string | null;
  isGenerating: boolean;
  clearResult: () => void;
}

export const useSocket = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        await socketService.connect();
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect to socket:', error);
        setIsConnected(false);
        toast.error('Failed to connect to server');
      }
    };

    connect();

    return () => {
      socketService.disconnect();
      setIsConnected(false);
    };
  }, []);

  const handleProgress = useCallback((progressData: GenerationProgress) => {
    setProgress(progressData);
  }, []);

  const handleComplete = useCallback((resultData: GenerationResult) => {
    setResult(resultData);
    setProgress(null);
    setIsGenerating(false);
    socketService.clearListeners();
    toast.success('Presentation generated successfully!');
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setProgress(null);
    setIsGenerating(false);
    socketService.clearListeners();
    toast.error(errorMessage);
  }, []);

  const generatePresentation = useCallback((prompt: string, sessionId: string) => {
    setError(null);
    setResult(null);
    setProgress(null);
    setIsGenerating(true);

    socketService.generatePresentation(
      prompt,
      sessionId,
      handleProgress,
      handleComplete,
      handleError
    );
  }, [handleProgress, handleComplete, handleError]);

  const editPresentation = useCallback((
    editPrompt: string,
    currentPresentation: PresentationData,
    sessionId: string
  ) => {
    setError(null);
    setProgress(null);
    setIsGenerating(true);

    socketService.editPresentation(
      editPrompt,
      currentPresentation,
      sessionId,
      handleProgress,
      handleComplete,
      handleError
    );
  }, [handleProgress, handleComplete, handleError]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setProgress(null);
  }, []);

  return {
    isConnected,
    generatePresentation,
    editPresentation,
    progress,
    result,
    error,
    isGenerating,
    clearResult,
  };
};