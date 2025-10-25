import pptxgen from 'pptxgenjs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { PresentationData, SlideContent } from '../models/types';

export class PPTService {
  private uploadsPath: string;

  constructor() {
    this.uploadsPath = process.env.UPLOAD_PATH || './uploads';
  }

  async generatePPT(presentationData: PresentationData): Promise<string> {
    try {
      logger.info('Generating PPT for presentation:', presentationData.title);

      const pres = new pptxgen();

      // Set presentation properties
      pres.author = presentationData.author || 'MagicSlides AI';
      pres.title = presentationData.title;
      pres.subject = presentationData.subtitle || '';

      // Apply theme
      this.applyTheme(pres, presentationData.theme);

      // Add slides
      for (const slideData of presentationData.slides) {
        this.addSlide(pres, slideData, presentationData.theme);
      }

      // Generate unique filename
      const filename = `presentation_${uuidv4()}.pptx`;
      const filepath = path.join(this.uploadsPath, filename);

      // Save presentation
      await pres.writeFile({ fileName: filepath });

      logger.info('PPT generated successfully:', filename);
      return filename;
    } catch (error) {
      logger.error('Error generating PPT:', error);
      throw new Error('Failed to generate PowerPoint presentation');
    }
  }

  private applyTheme(pres: any, theme: any = {}) {
    // Set default theme colors
    const primaryColor = theme.primaryColor || '#1f2937';
    const secondaryColor = theme.secondaryColor || '#3b82f6';
    const backgroundColor = theme.backgroundColor || '#ffffff';

    // Define slide master/layout
    pres.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: backgroundColor },
      objects: [
        {
          line: {
            x: 0.5,
            y: 6.9,
            w: 12.5,
            h: 0,
            line: { color: secondaryColor, width: 3 }
          }
        }
      ]
    });
  }

  private addSlide(pres: any, slideData: SlideContent, theme: any = {}) {
    const slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });

    const primaryColor = theme.primaryColor || '#1f2937';
    const secondaryColor = theme.secondaryColor || '#3b82f6';
    const fontFamily = theme.fontFamily || 'Arial';

    switch (slideData.layout) {
      case 'title':
        this.addTitleSlide(slide, slideData, { primaryColor, secondaryColor, fontFamily });
        break;
      case 'twoColumn':
        this.addTwoColumnSlide(slide, slideData, { primaryColor, secondaryColor, fontFamily });
        break;
      case 'image':
        this.addImageSlide(slide, slideData, { primaryColor, secondaryColor, fontFamily });
        break;
      default:
        this.addContentSlide(slide, slideData, { primaryColor, secondaryColor, fontFamily });
    }

    // Add speaker notes if present
    if (slideData.notes) {
      slide.addNotes(slideData.notes);
    }
  }

  private addTitleSlide(slide: any, slideData: SlideContent, theme: any) {
    // Main title
    slide.addText(slideData.title, {
      x: 1,
      y: 2.5,
      w: 11,
      h: 1.5,
      fontSize: 44,
      fontFace: theme.fontFamily,
      color: theme.primaryColor,
      bold: true,
      align: 'center'
    });

    // Subtitle (first content item)
    if (slideData.content && slideData.content.length > 0) {
      slide.addText(slideData.content[0], {
        x: 1,
        y: 4.2,
        w: 11,
        h: 1,
        fontSize: 28,
        fontFace: theme.fontFamily,
        color: theme.secondaryColor,
        align: 'center'
      });
    }
  }

  private addContentSlide(slide: any, slideData: SlideContent, theme: any) {
    // Slide title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      w: 12,
      h: 0.8,
      fontSize: 32,
      fontFace: theme.fontFamily,
      color: theme.primaryColor,
      bold: true
    });

    // Content bullets
    if (slideData.content && slideData.content.length > 0) {
      const bulletText = slideData.content.map(item => `• ${item}`).join('\n');
      
      slide.addText(bulletText, {
        x: 0.5,
        y: 1.5,
        w: 11.5,
        h: 5,
        fontSize: 18,
        fontFace: theme.fontFamily,
        color: theme.primaryColor,
        valign: 'top',
        lineSpacing: 28
      });
    }
  }

  private addTwoColumnSlide(slide: any, slideData: SlideContent, theme: any) {
    // Slide title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      w: 12,
      h: 0.8,
      fontSize: 32,
      fontFace: theme.fontFamily,
      color: theme.primaryColor,
      bold: true
    });

    // Split content into two columns
    const midpoint = Math.ceil(slideData.content.length / 2);
    const leftContent = slideData.content.slice(0, midpoint);
    const rightContent = slideData.content.slice(midpoint);

    // Left column
    if (leftContent.length > 0) {
      const leftText = leftContent.map(item => `• ${item}`).join('\n');
      slide.addText(leftText, {
        x: 0.5,
        y: 1.5,
        w: 5.5,
        h: 5,
        fontSize: 18,
        fontFace: theme.fontFamily,
        color: theme.primaryColor,
        valign: 'top',
        lineSpacing: 28
      });
    }

    // Right column
    if (rightContent.length > 0) {
      const rightText = rightContent.map(item => `• ${item}`).join('\n');
      slide.addText(rightText, {
        x: 6.5,
        y: 1.5,
        w: 5.5,
        h: 5,
        fontSize: 18,
        fontFace: theme.fontFamily,
        color: theme.primaryColor,
        valign: 'top',
        lineSpacing: 28
      });
    }
  }

  private addImageSlide(slide: any, slideData: SlideContent, theme: any) {
    // Slide title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      w: 12,
      h: 0.8,
      fontSize: 32,
      fontFace: theme.fontFamily,
      color: theme.primaryColor,
      bold: true
    });

    // Content text (reduced height to make room for image placeholder)
    if (slideData.content && slideData.content.length > 0) {
      const bulletText = slideData.content.map(item => `• ${item}`).join('\n');
      
      slide.addText(bulletText, {
        x: 0.5,
        y: 1.5,
        w: 5.5,
        h: 4,
        fontSize: 16,
        fontFace: theme.fontFamily,
        color: theme.primaryColor,
        valign: 'top',
        lineSpacing: 24
      });
    }

    // Image placeholder
    slide.addText('[Image Placeholder]\n\nAdd your image here', {
      x: 6.5,
      y: 2,
      w: 5,
      h: 3.5,
      fontSize: 14,
      fontFace: theme.fontFamily,
      color: theme.secondaryColor,
      align: 'center',
      valign: 'middle',
      fill: { color: '#f3f4f6' },
      border: { pt: 1, color: theme.secondaryColor }
    });
  }

  async deletePPT(filename: string): Promise<void> {
    try {
      const filepath = path.join(this.uploadsPath, filename);
      const fs = require('fs').promises;
      await fs.unlink(filepath);
      logger.info('PPT file deleted:', filename);
    } catch (error) {
      logger.error('Error deleting PPT file:', error);
      // Don't throw error for file deletion failures
    }
  }
}