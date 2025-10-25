import { io, Socket } from 'socket.io-client';
import { GenerationProgress, GenerationResult, PresentationData } from '../types';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
        this.handleReconnect();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.socket?.connect();
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    }
  }

  generatePresentation(
    prompt: string,
    sessionId: string,
    onProgress: (progress: GenerationProgress) => void,
    onComplete: (result: GenerationResult) => void,
    onError: (error: string) => void
  ) {
    if (!this.socket) {
      onError('Not connected to server');
      return;
    }

    // Set up event listeners
    this.socket.on('generation-progress', onProgress);
    this.socket.on('presentation-generated', onComplete);
    this.socket.on('error', (data: { message: string }) => {
      onError(data.message);
    });

    // Emit generation request
    this.socket.emit('generate-presentation', { prompt, sessionId });
  }

  editPresentation(
    editPrompt: string,
    currentPresentation: PresentationData,
    sessionId: string,
    onProgress: (progress: GenerationProgress) => void,
    onComplete: (result: GenerationResult) => void,
    onError: (error: string) => void
  ) {
    if (!this.socket) {
      onError('Not connected to server');
      return;
    }

    // Set up event listeners
    this.socket.on('generation-progress', onProgress);
    this.socket.on('presentation-updated', onComplete);
    this.socket.on('error', (data: { message: string }) => {
      onError(data.message);
    });

    // Emit edit request
    this.socket.emit('edit-presentation', {
      editPrompt,
      currentPresentation,
      sessionId,
    });
  }

  clearListeners() {
    if (this.socket) {
      this.socket.off('generation-progress');
      this.socket.off('presentation-generated');
      this.socket.off('presentation-updated');
      this.socket.off('error');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;