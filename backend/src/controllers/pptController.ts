import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { PPTService } from '../services/pptService';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

const router = Router();

// Download presentation endpoint
router.get('/download/:filename', asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;

  if (!filename || !filename.endsWith('.pptx')) {
    return res.status(400).json({
      error: 'Invalid filename'
    });
  }

  const uploadsPath = process.env.UPLOAD_PATH || './uploads';
  const filepath = path.join(uploadsPath, filename);

  try {
    // Check if file exists
    await fs.promises.access(filepath);

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');

    // Stream file
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    logger.info(`File downloaded: ${filename}`);
    return;
  } catch (error) {
    logger.error('Error downloading file:', error);
    return res.status(404).json({
      error: 'File not found'
    });
  }
}));

// Get presentation info
router.get('/info/:filename', asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;

  if (!filename || !filename.endsWith('.pptx')) {
    return res.status(400).json({
      error: 'Invalid filename'
    });
  }

  const uploadsPath = process.env.UPLOAD_PATH || './uploads';
  const filepath = path.join(uploadsPath, filename);

  try {
    const stats = await fs.promises.stat(filepath);
    
    return res.json({
      success: true,
      data: {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        downloadUrl: `/api/ppt/download/${filename}`
      }
    });
  } catch (error) {
    logger.error('Error getting file info:', error);
    return res.status(404).json({
      error: 'File not found'
    });
  }
}));

// Delete presentation endpoint
router.delete('/:filename', asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;

  if (!filename || !filename.endsWith('.pptx')) {
    return res.status(400).json({
      error: 'Invalid filename'
    });
  }

  try {
    const pptService = new PPTService();
    await pptService.deletePPT(filename);

    return res.json({
      success: true,
      message: 'Presentation deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting presentation:', error);
    return res.status(500).json({
      error: 'Failed to delete presentation'
    });
  }
}));

// List all presentations (for development/debugging)
router.get('/list', asyncHandler(async (req: Request, res: Response) => {
  const uploadsPath = process.env.UPLOAD_PATH || './uploads';

  try {
    const files = await fs.promises.readdir(uploadsPath);
    const presentations = files
      .filter(file => file.endsWith('.pptx'))
      .map(async (file) => {
        const filepath = path.join(uploadsPath, file);
        const stats = await fs.promises.stat(filepath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          downloadUrl: `/api/ppt/download/${file}`
        };
      });

    const results = await Promise.all(presentations);

    return res.json({
      success: true,
      data: { presentations: results }
    });
  } catch (error) {
    logger.error('Error listing presentations:', error);
    return res.status(500).json({
      error: 'Failed to list presentations'
    });
  }
}));

export default router;