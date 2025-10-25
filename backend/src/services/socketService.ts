import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { GeminiService } from './geminiService';
import { PPTService } from './pptService';
import { GenerationProgress } from '../models/types';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('generate-presentation', async (data) => {
      try {
        const { prompt, sessionId } = data;
        
        if (!prompt) {
          socket.emit('error', { message: 'Prompt is required' });
          return;
        }

        // Join room for this session
        socket.join(sessionId);

        // Initialize services
        const geminiService = new GeminiService();
        const pptService = new PPTService();

        // Progress updates
        const emitProgress = (progress: GenerationProgress) => {
          io.to(sessionId).emit('generation-progress', progress);
        };

        // Step 1: Analyzing prompt
        emitProgress({
          stage: 'analyzing',
          progress: 10,
          message: 'Analyzing your request...'
        });

        // Step 2: Generating content
        emitProgress({
          stage: 'generating',
          progress: 30,
          message: 'Generating presentation content...'
        });

        const presentationData = await geminiService.generatePresentation(prompt);

        // Step 3: Formatting slides
        emitProgress({
          stage: 'formatting',
          progress: 60,
          message: 'Formatting slides...'
        });

        // Step 4: Creating PowerPoint
        emitProgress({
          stage: 'creating',
          progress: 80,
          message: 'Creating PowerPoint file...'
        });

        const filename = await pptService.generatePPT(presentationData);

        // Step 5: Complete
        emitProgress({
          stage: 'complete',
          progress: 100,
          message: 'Presentation ready!'
        });

        // Send the completed presentation data
        socket.emit('presentation-generated', {
          presentationData,
          filename,
          downloadUrl: `/uploads/${filename}`
        });

      } catch (error) {
        logger.error('Error in generate-presentation:', error);
        socket.emit('error', { 
          message: 'Failed to generate presentation. Please try again.' 
        });
      }
    });

    socket.on('edit-presentation', async (data) => {
      try {
        const { editPrompt, currentPresentation, sessionId } = data;
        
        if (!editPrompt || !currentPresentation) {
          socket.emit('error', { message: 'Edit prompt and current presentation are required' });
          return;
        }

        // Join room for this session
        socket.join(sessionId);

        const geminiService = new GeminiService();
        const pptService = new PPTService();

        // Progress updates
        const emitProgress = (progress: GenerationProgress) => {
          io.to(sessionId).emit('generation-progress', progress);
        };

        emitProgress({
          stage: 'analyzing',
          progress: 20,
          message: 'Analyzing edit request...'
        });

        const updatedPresentation = await geminiService.editPresentation(
          currentPresentation,
          editPrompt
        );

        emitProgress({
          stage: 'creating',
          progress: 70,
          message: 'Updating presentation...'
        });

        const filename = await pptService.generatePPT(updatedPresentation);

        emitProgress({
          stage: 'complete',
          progress: 100,
          message: 'Presentation updated!'
        });

        socket.emit('presentation-updated', {
          presentationData: updatedPresentation,
          filename,
          downloadUrl: `/uploads/${filename}`
        });

      } catch (error) {
        logger.error('Error in edit-presentation:', error);
        socket.emit('error', { 
          message: 'Failed to edit presentation. Please try again.' 
        });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};