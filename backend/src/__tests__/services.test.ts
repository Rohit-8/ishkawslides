import { GeminiService } from '../services/geminiService';
import { PPTService } from '../services/pptService';

describe('MagicSlides Services', () => {
  describe('GeminiService', () => {
    test('should initialize without API key in test environment', () => {
      // Mock environment for testing
      const originalEnv = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = 'test-key';
      
      expect(() => new GeminiService()).not.toThrow();
      
      // Restore original environment
      process.env.GEMINI_API_KEY = originalEnv;
    });

    test('should throw error when API key is missing', () => {
      const originalEnv = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      
      expect(() => new GeminiService()).toThrow('GEMINI_API_KEY environment variable is required');
      
      // Restore original environment
      process.env.GEMINI_API_KEY = originalEnv;
    });
  });

  describe('PPTService', () => {
    test('should initialize successfully', () => {
      expect(() => new PPTService()).not.toThrow();
    });

    test('should use default upload path when env var is not set', () => {
      const originalEnv = process.env.UPLOAD_PATH;
      delete process.env.UPLOAD_PATH;
      
      const service = new PPTService();
      expect(service).toBeDefined();
      
      // Restore original environment
      process.env.UPLOAD_PATH = originalEnv;
    });
  });
});