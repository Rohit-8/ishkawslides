import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';
import { PresentationData } from '../models/types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any = null;
  private modelInitialized: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    
    logger.info('GeminiService initialized with API key');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async ensureModelInitialized() {
    if (this.modelInitialized && this.model) {
      return;
    }

    // Try different model names in order of preference
    const modelNames = [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-pro',
      'gemini-1.0-pro',
      'models/gemini-pro'
    ];

    for (const modelName of modelNames) {
      try {
        logger.info(`Trying model: ${modelName}`);
        this.model = this.genAI.getGenerativeModel({ model: modelName });
        
        // Test the model with a simple prompt
        const testResult = await this.model.generateContent("Hello");
        const testResponse = await testResult.response;
        await testResponse.text();
        
        logger.info(`Successfully initialized model: ${modelName}`);
        this.modelInitialized = true;
        return;
      } catch (error) {
        logger.warn(`Model ${modelName} not available:`, error instanceof Error ? error.message : String(error));
        continue;
      }
    }
    
    throw new Error('No compatible Gemini model found for your API key. Please check your API key permissions and billing status.');
  }

  async generatePresentation(prompt: string): Promise<PresentationData> {
    try {
      logger.info('Generating presentation for prompt:', prompt);
      
      // Ensure model is initialized
      await this.ensureModelInitialized();
      
      logger.info('Using Gemini AI for presentation generation');
      const enhancedPrompt = this.buildPresentationPrompt(prompt);
      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      return this.parsePresentationResponse(text);
    } catch (error) {
      logger.error('Error generating presentation:', error);
      throw new Error(`Failed to generate presentation with Gemini AI: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async editPresentation(
    currentPresentation: PresentationData,
    editPrompt: string
  ): Promise<PresentationData> {
    try {
      logger.info('Editing presentation with prompt:', editPrompt);
      
      // Ensure model is initialized
      await this.ensureModelInitialized();
      
      logger.info('Using Gemini AI for presentation editing');
      const enhancedPrompt = this.buildEditPrompt(currentPresentation, editPrompt);
      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      return this.parsePresentationResponse(text);
    } catch (error) {
      logger.error('Error editing presentation:', error);
      throw new Error(`Failed to edit presentation with Gemini AI: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private buildPresentationPrompt(userPrompt: string): string {
    return `
Create a PowerPoint presentation based on the following request: "${userPrompt}"

Please respond with a JSON object that follows this exact structure:
{
  "title": "Main presentation title",
  "subtitle": "Optional subtitle",
  "author": "MagicSlides AI",
  "slides": [
    {
      "title": "Slide title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "layout": "content",
      "notes": "Optional speaker notes"
    }
  ],
  "theme": {
    "primaryColor": "#1f2937",
    "secondaryColor": "#3b82f6",
    "backgroundColor": "#ffffff",
    "fontFamily": "Arial"
  }
}

Guidelines:
1. Create 5-8 slides unless specifically requested otherwise
2. Use clear, concise bullet points
3. Choose appropriate layouts: "title", "content", "twoColumn", or "image"
4. Include speaker notes for important slides
5. Select professional color schemes
6. Make content engaging and informative
7. Ensure logical flow between slides

Respond only with the JSON object, no additional text.
    `;
  }

  private buildEditPrompt(currentPresentation: PresentationData, editPrompt: string): string {
    return `
Current presentation data:
${JSON.stringify(currentPresentation, null, 2)}

Edit request: "${editPrompt}"

Please modify the presentation according to the edit request and respond with the updated JSON object following the same structure:
{
  "title": "Main presentation title",
  "subtitle": "Optional subtitle", 
  "author": "MagicSlides AI",
  "slides": [...],
  "theme": {...}
}

Guidelines:
1. Preserve existing content unless specifically asked to change it
2. Make targeted changes based on the edit request
3. Maintain consistency in style and theme
4. Ensure smooth transitions between slides
5. Keep professional formatting

Respond only with the updated JSON object, no additional text.
    `;
  }

  private parsePresentationResponse(response: string): PresentationData {
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const jsonString = jsonMatch[0];
      const parsedData = JSON.parse(jsonString);

      // Validate required fields
      if (!parsedData.title || !parsedData.slides || !Array.isArray(parsedData.slides)) {
        throw new Error('Invalid presentation data structure');
      }

      // Set defaults
      const presentationData: PresentationData = {
        title: parsedData.title,
        subtitle: parsedData.subtitle || '',
        author: parsedData.author || 'MagicSlides AI',
        slides: parsedData.slides.map((slide: any) => ({
          title: slide.title || 'Untitled Slide',
          content: Array.isArray(slide.content) ? slide.content : [slide.content || ''],
          layout: slide.layout || 'content',
          notes: slide.notes || ''
        })),
        theme: {
          primaryColor: parsedData.theme?.primaryColor || '#1f2937',
          secondaryColor: parsedData.theme?.secondaryColor || '#3b82f6',
          backgroundColor: parsedData.theme?.backgroundColor || '#ffffff',
          fontFamily: parsedData.theme?.fontFamily || 'Arial'
        }
      };

      return presentationData;
    } catch (error) {
      logger.error('Error parsing presentation response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

}