import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { GeminiService } from '../services/geminiService';
import { PPTService } from '../services/pptService';
import { logger } from '../utils/logger';
import Joi from 'joi';

const router = Router();

// Validation schemas
const generateSchema = Joi.object({
  prompt: Joi.string().required().min(10).max(1000),
  sessionId: Joi.string().required()
});

const editSchema = Joi.object({
  editPrompt: Joi.string().required().min(5).max(500),
  currentPresentation: Joi.object().required(),
  sessionId: Joi.string().required()
});

// Generate presentation endpoint
router.post('/generate', asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = generateSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }

  const { prompt, sessionId } = value;

  try {
    const geminiService = new GeminiService();
    const pptService = new PPTService();

    logger.info(`Generating presentation for session: ${sessionId}`);

    const presentationData = await geminiService.generatePresentation(prompt);
    const filename = await pptService.generatePPT(presentationData);

    return res.json({
      success: true,
      data: {
        presentationData,
        filename,
        downloadUrl: `/uploads/${filename}`,
        sessionId
      }
    });
  } catch (error) {
    logger.error('Error in /generate endpoint:', error);
    return res.status(500).json({
      error: 'Failed to generate presentation',
      message: 'Please try again later'
    });
  }
}));

// Edit presentation endpoint
router.post('/edit', asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = editSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }

  const { editPrompt, currentPresentation, sessionId } = value;

  try {
    const geminiService = new GeminiService();
    const pptService = new PPTService();

    logger.info(`Editing presentation for session: ${sessionId}`);

    const updatedPresentation = await geminiService.editPresentation(
      currentPresentation,
      editPrompt
    );
    const filename = await pptService.generatePPT(updatedPresentation);

    return res.json({
      success: true,
      data: {
        presentationData: updatedPresentation,
        filename,
        downloadUrl: `/uploads/${filename}`,
        sessionId
      }
    });
  } catch (error) {
    logger.error('Error in /edit endpoint:', error);
    return res.status(500).json({
      error: 'Failed to edit presentation',
      message: 'Please try again later'
    });
  }
}));

// Get chat suggestions
router.get('/suggestions', asyncHandler(async (req: Request, res: Response) => {
  const suggestions = [
    "Create a presentation about renewable energy with 5 slides",
    "Build a marketing strategy presentation for a new product launch",
    "Make a educational presentation about artificial intelligence",
    "Create slides about project management best practices",
    "Design a presentation about healthy lifestyle tips",
    "Build a business plan presentation for startups"
  ];

  return res.json({
    success: true,
    data: { suggestions }
  });
}));

export default router;