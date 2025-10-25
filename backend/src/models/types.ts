export interface SlideContent {
  title: string;
  content: string[];
  layout?: 'title' | 'content' | 'twoColumn' | 'image';
  notes?: string;
}

export interface PresentationData {
  title: string;
  subtitle?: string;
  author?: string;
  slides: SlideContent[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  presentationId?: string;
}

export interface GenerationProgress {
  stage: 'analyzing' | 'generating' | 'formatting' | 'creating' | 'complete';
  progress: number;
  message: string;
}