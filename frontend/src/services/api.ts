import axios from 'axios';
import { ApiResponse, GenerationResult, PresentationData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 60000, // 60 seconds for AI generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    throw error;
  }
);

export const chatApi = {
  generatePresentation: async (prompt: string, sessionId: string): Promise<GenerationResult> => {
    const response = await apiClient.post<ApiResponse<GenerationResult>>('/chat/generate', {
      prompt,
      sessionId,
    });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to generate presentation');
    }
    
    return response.data.data;
  },

  editPresentation: async (
    editPrompt: string,
    currentPresentation: PresentationData,
    sessionId: string
  ): Promise<GenerationResult> => {
    const response = await apiClient.post<ApiResponse<GenerationResult>>('/chat/edit', {
      editPrompt,
      currentPresentation,
      sessionId,
    });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to edit presentation');
    }
    
    return response.data.data;
  },

  getSuggestions: async (): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<{ suggestions: string[] }>>('/chat/suggestions');
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch suggestions');
    }
    
    return response.data.data.suggestions;
  },
};

export const pptApi = {
  downloadPresentation: (filename: string): string => {
    return `${API_BASE_URL}/api/ppt/download/${filename}`;
  },

  getPresentationInfo: async (filename: string) => {
    const response = await apiClient.get(`/ppt/info/${filename}`);
    return response.data;
  },

  deletePresentation: async (filename: string) => {
    const response = await apiClient.delete(`/ppt/${filename}`);
    return response.data;
  },

  listPresentations: async () => {
    const response = await apiClient.get('/ppt/list');
    return response.data;
  },
};

export default apiClient;