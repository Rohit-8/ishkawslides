# Backend Documentation

## Overview

The MagicSlides AI backend is a Node.js/Express server that provides REST API endpoints and WebSocket connections for generating and editing PowerPoint presentations using Google's Gemini AI model and pptxgenjs library.

## Architecture

### Core Technologies
- **Node.js & Express**: Web server framework
- **TypeScript**: Type-safe JavaScript development
- **Socket.io**: Real-time WebSocket communication
- **Google Gemini AI**: Content generation and editing
- **pptxgenjs**: PowerPoint presentation generation
- **Winston**: Logging system

### Project Structure
```
backend/
├── src/
│   ├── controllers/       # HTTP route handlers
│   │   ├── chatController.ts    # Chat and generation endpoints
│   │   └── pptController.ts     # PPT management endpoints
│   ├── services/          # Business logic
│   │   ├── geminiService.ts     # AI integration
│   │   ├── pptService.ts        # PPT generation
│   │   └── socketService.ts     # WebSocket handlers
│   ├── models/            # Data types and interfaces
│   │   └── types.ts
│   ├── middleware/        # Express middleware
│   │   └── errorHandler.ts
│   ├── utils/             # Utility functions
│   │   └── logger.ts
│   └── index.ts           # Main server file
├── uploads/               # Generated PPT files
├── logs/                  # Application logs
├── package.json
├── tsconfig.json
└── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Gemini API key from Google AI Studio

### Installation
1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=10485760
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Chat Endpoints

#### POST /api/chat/generate
Generate a new presentation from a prompt.

**Request Body:**
```typescript
{
  prompt: string;        // User's presentation request (10-1000 chars)
  sessionId: string;     // Unique session identifier
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    presentationData: PresentationData;
    filename: string;
    downloadUrl: string;
    sessionId: string;
  }
}
```

#### POST /api/chat/edit
Edit an existing presentation.

**Request Body:**
```typescript
{
  editPrompt: string;              // Edit instructions (5-500 chars)
  currentPresentation: PresentationData;
  sessionId: string;
}
```

#### GET /api/chat/suggestions
Get suggested prompts for inspiration.

**Response:**
```typescript
{
  success: boolean;
  data: {
    suggestions: string[];
  }
}
```

### PPT Management Endpoints

#### GET /api/ppt/download/:filename
Download a generated presentation file.

**Parameters:**
- `filename`: The PPTX filename to download

**Response:** File download stream

#### GET /api/ppt/info/:filename
Get information about a presentation file.

**Response:**
```typescript
{
  success: boolean;
  data: {
    filename: string;
    size: number;
    created: Date;
    modified: Date;
    downloadUrl: string;
  }
}
```

#### DELETE /api/ppt/:filename
Delete a presentation file.

#### GET /api/ppt/list
List all generated presentations (development only).

## WebSocket Events

### Client → Server Events

#### generate-presentation
Request generation of a new presentation.
```typescript
{
  prompt: string;
  sessionId: string;
}
```

#### edit-presentation
Request editing of existing presentation.
```typescript
{
  editPrompt: string;
  currentPresentation: PresentationData;
  sessionId: string;
}
```

### Server → Client Events

#### generation-progress
Progress updates during generation.
```typescript
{
  stage: 'analyzing' | 'generating' | 'formatting' | 'creating' | 'complete';
  progress: number;      // 0-100
  message: string;
}
```

#### presentation-generated
Completed presentation data.
```typescript
{
  presentationData: PresentationData;
  filename: string;
  downloadUrl: string;
}
```

#### presentation-updated
Updated presentation after editing.

#### error
Error occurred during processing.
```typescript
{
  message: string;
}
```

## Data Models

### PresentationData
```typescript
interface PresentationData {
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
```

### SlideContent
```typescript
interface SlideContent {
  title: string;
  content: string[];
  layout?: 'title' | 'content' | 'twoColumn' | 'image';
  notes?: string;
}
```

## Services

### GeminiService
Handles AI content generation and editing using Google's Gemini model.

**Key Methods:**
- `generatePresentation(prompt: string): Promise<PresentationData>`
- `editPresentation(current: PresentationData, editPrompt: string): Promise<PresentationData>`

### PPTService
Manages PowerPoint file creation using pptxgenjs.

**Key Methods:**
- `generatePPT(presentationData: PresentationData): Promise<string>`
- `deletePPT(filename: string): Promise<void>`

**Supported Layouts:**
- **Title**: Large title with subtitle
- **Content**: Title with bullet points
- **Two Column**: Split content into two columns
- **Image**: Content with image placeholder

## Error Handling

The application uses structured error handling:

1. **Validation Errors** (400): Invalid request data
2. **Rate Limiting** (429): Too many requests
3. **Server Errors** (500): Internal processing errors
4. **File Errors** (404): File not found

All errors are logged with Winston and include:
- Error message and stack trace
- Request details (URL, method, IP)
- Timestamp and user agent

## Security Features

- **CORS Protection**: Configurable origins
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi schema validation
- **File Upload Limits**: Prevents large file attacks
- **Environment Variables**: Sensitive data protection

## Logging

Winston logger with multiple transports:
- **Console**: Development logging
- **File**: Production log files
- **Error Logs**: Separate error tracking

Log levels: error, warn, info, debug

## Performance Considerations

- **Connection Pooling**: Efficient database connections
- **File Cleanup**: Automatic cleanup of old presentations
- **Memory Management**: Streaming file downloads
- **Caching**: In-memory caching for frequently accessed data

## Development

### Scripts
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
npm test           # Run test suite
npm run lint       # Run ESLint
npm run lint:fix   # Fix linting issues
```

### Testing
- Jest for unit and integration tests
- Supertest for API endpoint testing
- Mock services for external dependencies

### Debugging
- VS Code debug configuration included
- Detailed logging for troubleshooting
- Error tracking and monitoring

## Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
GEMINI_API_KEY=prod_api_key
PORT=3001
CORS_ORIGIN=https://your-domain.com
UPLOAD_PATH=/app/uploads
```

### Docker Support
Dockerfile included for containerized deployment.

### Health Checks
- `GET /health` endpoint for monitoring
- Graceful shutdown handling
- Process monitoring compatibility