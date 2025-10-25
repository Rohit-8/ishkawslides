# API Reference

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

## Authentication
Currently, no authentication is required. In production, consider implementing:
- API Keys for rate limiting
- JWT tokens for user sessions
- OAuth for third-party integrations

## Rate Limiting
- **Window**: 15 minutes (900,000ms)
- **Limit**: 100 requests per IP
- **Headers**: Rate limit info in response headers

## Error Responses

All errors follow this structure:
```json
{
  "error": "Error description",
  "message": "User-friendly message",
  "timestamp": "2023-12-07T10:00:00.000Z"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Chat API

### Generate Presentation
Create a new presentation from a text prompt.

**Endpoint:** `POST /chat/generate`

**Request:**
```json
{
  "prompt": "Create a presentation about renewable energy with 5 slides",
  "sessionId": "session_1699123456789_abc123"
}
```

**Validation Rules:**
- `prompt`: Required, 10-1000 characters
- `sessionId`: Required, string

**Response (200):**
```json
{
  "success": true,
  "data": {
    "presentationData": {
      "title": "Renewable Energy Solutions",
      "subtitle": "A Sustainable Future",
      "author": "MagicSlides AI",
      "slides": [
        {
          "title": "Introduction to Renewable Energy",
          "content": [
            "Clean energy sources from natural processes",
            "Reduces greenhouse gas emissions",
            "Sustainable for long-term use"
          ],
          "layout": "content",
          "notes": "Introduce the concept and importance of renewable energy"
        }
      ],
      "theme": {
        "primaryColor": "#1f2937",
        "secondaryColor": "#3b82f6",
        "backgroundColor": "#ffffff",
        "fontFamily": "Arial"
      }
    },
    "filename": "presentation_uuid.pptx",
    "downloadUrl": "/uploads/presentation_uuid.pptx",
    "sessionId": "session_1699123456789_abc123"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    "\"prompt\" is required",
    "\"prompt\" length must be at least 10 characters long"
  ]
}
```

### Edit Presentation
Modify an existing presentation based on user instructions.

**Endpoint:** `POST /chat/edit`

**Request:**
```json
{
  "editPrompt": "Add a slide about solar power statistics",
  "currentPresentation": {
    "title": "Renewable Energy Solutions",
    "slides": [...]
  },
  "sessionId": "session_1699123456789_abc123"
}
```

**Validation Rules:**
- `editPrompt`: Required, 5-500 characters
- `currentPresentation`: Required, valid PresentationData object
- `sessionId`: Required, string

**Response:** Same structure as generate endpoint

### Get Suggestions
Retrieve suggested prompts for user inspiration.

**Endpoint:** `GET /chat/suggestions`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "Create a presentation about renewable energy with 5 slides",
      "Build a marketing strategy presentation for a new product launch",
      "Make an educational presentation about artificial intelligence",
      "Create slides about project management best practices",
      "Design a presentation about healthy lifestyle tips",
      "Build a business plan presentation for startups"
    ]
  }
}
```

## PPT Management API

### Download Presentation
Download a generated PowerPoint file.

**Endpoint:** `GET /ppt/download/:filename`

**Parameters:**
- `filename`: The PPTX filename (must end with .pptx)

**Response:**
- **Content-Type:** `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- **Content-Disposition:** `attachment; filename="presentation.pptx"`
- **Body:** Binary file stream

**Error Response (404):**
```json
{
  "error": "File not found"
}
```

### Get File Information
Retrieve metadata about a presentation file.

**Endpoint:** `GET /ppt/info/:filename`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "filename": "presentation_uuid.pptx",
    "size": 2048576,
    "created": "2023-12-07T10:00:00.000Z",
    "modified": "2023-12-07T10:00:00.000Z",
    "downloadUrl": "/api/ppt/download/presentation_uuid.pptx"
  }
}
```

### Delete Presentation
Remove a presentation file from the server.

**Endpoint:** `DELETE /ppt/:filename`

**Response (200):**
```json
{
  "success": true,
  "message": "Presentation deleted successfully"
}
```

### List Presentations
Get all presentation files (development only).

**Endpoint:** `GET /ppt/list`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "presentations": [
      {
        "filename": "presentation_uuid1.pptx",
        "size": 2048576,
        "created": "2023-12-07T10:00:00.000Z",
        "downloadUrl": "/api/ppt/download/presentation_uuid1.pptx"
      },
      {
        "filename": "presentation_uuid2.pptx",
        "size": 1536000,
        "created": "2023-12-07T09:30:00.000Z",
        "downloadUrl": "/api/ppt/download/presentation_uuid2.pptx"
      }
    ]
  }
}
```

## WebSocket API

### Connection
Connect to WebSocket server for real-time communication.

**URL:** `ws://localhost:3001` (development)

**Events:** See backend documentation for complete WebSocket API

### Example Usage (JavaScript)
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Generate presentation
socket.emit('generate-presentation', {
  prompt: 'Create a presentation about AI',
  sessionId: 'session_123'
});

// Listen for progress
socket.on('generation-progress', (progress) => {
  console.log(`${progress.stage}: ${progress.progress}%`);
});

// Handle completion
socket.on('presentation-generated', (result) => {
  console.log('Presentation ready:', result.filename);
});

// Handle errors
socket.on('error', (error) => {
  console.error('Error:', error.message);
});
```

## Data Types

### PresentationData
```typescript
interface PresentationData {
  title: string;                    // Presentation title
  subtitle?: string;                // Optional subtitle
  author?: string;                  // Author name (default: "MagicSlides AI")
  slides: SlideContent[];           // Array of slides
  theme?: {                         // Optional theme customization
    primaryColor?: string;          // Hex color for headings
    secondaryColor?: string;        // Hex color for accents
    backgroundColor?: string;       // Hex color for backgrounds
    fontFamily?: string;            // Font family name
  };
}
```

### SlideContent
```typescript
interface SlideContent {
  title: string;                    // Slide title
  content: string[];                // Array of content items/bullet points
  layout?: 'title' | 'content' | 'twoColumn' | 'image';  // Slide layout
  notes?: string;                   // Speaker notes
}
```

### Layout Types
- **title**: Title slide with large heading and subtitle
- **content**: Standard content slide with title and bullet points
- **twoColumn**: Content split into two columns
- **image**: Content with image placeholder area

### ChatMessage
```typescript
interface ChatMessage {
  id: string;                       // Unique message ID
  role: 'user' | 'assistant';       // Message sender
  content: string;                  // Message text
  timestamp: Date;                  // When message was sent
  presentationId?: string;          // Associated presentation ID
}
```

### GenerationProgress
```typescript
interface GenerationProgress {
  stage: 'analyzing' | 'generating' | 'formatting' | 'creating' | 'complete';
  progress: number;                 // 0-100 percentage
  message: string;                  // Human-readable status message
}
```

## Usage Examples

### cURL Examples

**Generate Presentation:**
```bash
curl -X POST http://localhost:3001/api/chat/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a presentation about machine learning",
    "sessionId": "session_123"
  }'
```

**Download Presentation:**
```bash
curl -o presentation.pptx \
  http://localhost:3001/api/ppt/download/presentation_uuid.pptx
```

### JavaScript Fetch Examples

**Generate Presentation:**
```javascript
const response = await fetch('/api/chat/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Create a presentation about blockchain technology',
    sessionId: 'session_' + Date.now()
  })
});

const result = await response.json();
if (result.success) {
  console.log('Presentation generated:', result.data.filename);
}
```

**Edit Presentation:**
```javascript
const response = await fetch('/api/chat/edit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    editPrompt: 'Make the slides more technical',
    currentPresentation: existingPresentation,
    sessionId: sessionId
  })
});
```

## Best Practices

### API Usage
1. **Session Management**: Use consistent sessionId for related requests
2. **Error Handling**: Always check response.success before using data
3. **Rate Limiting**: Implement client-side throttling for frequent requests
4. **File Management**: Clean up downloaded files after use

### Performance Tips
1. **Caching**: Cache presentation data to avoid regeneration
2. **Chunking**: Use streaming for large file downloads
3. **Compression**: Enable gzip compression for API responses
4. **Timeouts**: Set appropriate timeout values for AI generation requests

### Security Considerations
1. **Input Validation**: Validate all user inputs on client side
2. **File Names**: Never trust server-provided filenames without validation
3. **CORS**: Configure appropriate CORS settings for production
4. **API Keys**: Protect API keys and use environment variables