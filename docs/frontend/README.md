# Frontend Documentation

## Overview

The MagicSlides AI frontend is a modern React application built with TypeScript that provides an intuitive chat-based interface for generating and editing PowerPoint presentations. The application features real-time communication, beautiful UI components, and comprehensive presentation management.

## Architecture

### Core Technologies
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Socket.io Client**: Real-time WebSocket communication
- **Axios**: HTTP client for API requests
- **React Hot Toast**: Beautiful toast notifications
- **Lucide React**: Modern icon library
- **Framer Motion**: Smooth animations (optional)

### Project Structure
```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ChatMessage.tsx      # Individual chat message
│   │   ├── ChatInput.tsx        # Message input with suggestions
│   │   ├── ProgressIndicator.tsx # Generation progress display
│   │   └── PresentationPreview.tsx # PPT preview and editing
│   ├── hooks/             # Custom React hooks
│   │   ├── useSocket.ts         # WebSocket management
│   │   └── useChat.ts           # Chat state management
│   ├── services/          # External service integrations
│   │   ├── api.ts               # HTTP API client
│   │   └── socket.ts            # WebSocket service
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── helpers.ts
│   ├── App.tsx            # Main application component
│   ├── App.css            # Custom styles
│   └── index.tsx          # Application entry point
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── package.json
└── tsconfig.json
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_SOCKET_URL=http://localhost:3001
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   
   Application will be available at `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

### 1. Chat Interface
- **Real-time messaging** with AI assistant
- **Message history** with persistent storage
- **Typing indicators** and loading states
- **Suggestion system** for inspiration
- **Input validation** and character limits

### 2. Presentation Generation
- **AI-powered content creation** using prompts
- **Real-time progress tracking** with stage indicators
- **Multiple slide layouts** (title, content, two-column, image)
- **Theme customization** with colors and fonts
- **Instant preview** of generated slides

### 3. Presentation Editing
- **Conversational editing** through chat prompts
- **In-place editing** with preview updates
- **Version history** tracking
- **Slide navigation** with thumbnails
- **Speaker notes** management

### 4. File Management
- **Direct download** of PPTX files
- **File information** display
- **Preview functionality** before download
- **Automatic cleanup** of temporary files

## Components

### ChatMessage
Displays individual chat messages with proper styling and metadata.

**Props:**
```typescript
interface ChatMessageProps {
  message: ChatMessage;
}
```

**Features:**
- User/Assistant differentiation
- Timestamp formatting
- Presentation attachment indicators
- Responsive design

### ChatInput
Advanced input component with suggestions and validation.

**Props:**
```typescript
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
}
```

**Features:**
- Auto-expanding textarea
- Character count display
- Suggestion dropdown
- Send on Enter (Shift+Enter for new line)
- Validation feedback

### ProgressIndicator
Visual progress tracker for presentation generation.

**Props:**
```typescript
interface ProgressIndicatorProps {
  progress: GenerationProgress;
}
```

**Features:**
- Stage-based progress bar
- Icon indicators for each stage
- Animated transitions
- Percentage display

### PresentationPreview
Comprehensive presentation viewer and editor.

**Props:**
```typescript
interface PresentationPreviewProps {
  presentation: PresentationData;
  filename: string;
  downloadUrl: string;
  onEdit?: (prompt: string) => void;
}
```

**Features:**
- Slide navigation with thumbnails
- Multiple layout rendering
- In-line editing capabilities
- Speaker notes toggle
- Download functionality
- Theme visualization

## Custom Hooks

### useSocket
Manages WebSocket connection and real-time communication.

**Returns:**
```typescript
interface UseSocketReturn {
  isConnected: boolean;
  generatePresentation: (prompt: string, sessionId: string) => void;
  editPresentation: (editPrompt: string, currentPresentation: PresentationData, sessionId: string) => void;
  progress: GenerationProgress | null;
  result: GenerationResult | null;
  error: string | null;
  isGenerating: boolean;
  clearResult: () => void;
}
```

**Features:**
- Automatic connection management
- Reconnection with exponential backoff
- Event listener cleanup
- Error handling and retry logic

### useChat
Manages chat state and message history.

**Returns:**
```typescript
interface UseChatReturn {
  messages: ChatMessage[];
  sessionId: string;
  addMessage: (role: 'user' | 'assistant', content: string, presentationId?: string) => void;
  clearHistory: () => void;
  loadHistory: () => void;
}
```

**Features:**
- Persistent message storage
- Session management
- History loading/clearing
- Automatic saving

## Services

### API Service
HTTP client for REST API communication.

**Key Methods:**
- `chatApi.generatePresentation(prompt, sessionId)`
- `chatApi.editPresentation(editPrompt, currentPresentation, sessionId)`
- `chatApi.getSuggestions()`
- `pptApi.downloadPresentation(filename)`

**Features:**
- Request/response interceptors
- Error handling and retry logic
- Timeout management
- Loading states

### Socket Service
WebSocket client for real-time communication.

**Key Methods:**
- `connect()`: Establish WebSocket connection
- `generatePresentation()`: Request presentation generation
- `editPresentation()`: Request presentation editing
- `disconnect()`: Close connection

**Features:**
- Connection state management
- Event listener management
- Automatic reconnection
- Error handling

## Styling

### Tailwind CSS Configuration
Custom color palette and utilities:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
}
```

### Component Utilities
Pre-defined CSS classes for common patterns:

```css
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500;
}
```

## State Management

### Local State Pattern
Using React hooks for component-level state:

```typescript
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [currentPresentation, setCurrentPresentation] = useState<PresentationData | null>(null);
const [isLoading, setIsLoading] = useState(false);
```

### Persistent Storage
Local storage integration for data persistence:

```typescript
// Save data
storage.set('chat_history', messages);

// Load data
const savedMessages = storage.get('chat_history', []);

// Clear data
storage.remove('chat_history');
```

## User Experience

### Loading States
- **Skeleton screens** during initial load
- **Progress indicators** for generation
- **Spinners** for quick actions
- **Disabled states** during processing

### Error Handling
- **Toast notifications** for errors
- **Inline validation** messages
- **Retry mechanisms** for failed requests
- **Graceful degradation** for offline scenarios

### Responsive Design
- **Mobile-first** approach
- **Flexible layouts** with CSS Grid/Flexbox
- **Touch-friendly** interface elements
- **Optimized typography** for all screen sizes

### Accessibility
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **High contrast** color schemes
- **Focus management** for modals and forms

## Performance Optimization

### Code Splitting
```typescript
// Lazy loading components
const PresentationPreview = React.lazy(() => import('./components/PresentationPreview'));

// Route-based splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

### Memoization
```typescript
// Prevent unnecessary re-renders
const MemoizedChatMessage = React.memo(ChatMessage);

// Memoize expensive calculations
const processedMessages = useMemo(() => {
  return messages.map(processMessage);
}, [messages]);
```

### Image Optimization
- **Lazy loading** for presentation previews
- **WebP format** with fallbacks
- **Responsive images** for different screen sizes
- **Placeholder images** during loading

## Development

### Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

### Hot Reload
Development server with hot module replacement for instant updates.

### TypeScript Configuration
Strict type checking with comprehensive type definitions:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Code Quality
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **TypeScript** for type safety

## Testing

### Testing Strategy
- **Unit tests** for utility functions
- **Component tests** with React Testing Library
- **Integration tests** for API interactions
- **E2E tests** with Cypress (planned)

### Test Examples
```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './ChatMessage';

test('renders user message correctly', () => {
  const message = {
    id: '1',
    role: 'user',
    content: 'Hello AI',
    timestamp: new Date()
  };
  
  render(<ChatMessage message={message} />);
  expect(screen.getByText('Hello AI')).toBeInTheDocument();
});
```

## Deployment

### Build Process
```bash
npm run build
```
Generates optimized production build in `build/` directory.

### Environment Variables
```env
# Production
REACT_APP_API_URL=https://api.magicslides.com
REACT_APP_SOCKET_URL=https://api.magicslides.com
```

### Static Hosting
Compatible with:
- **Netlify** (recommended)
- **Vercel**
- **AWS S3 + CloudFront**
- **GitHub Pages**

### Performance Monitoring
- **Bundle size** analysis with webpack-bundle-analyzer
- **Runtime performance** with React DevTools
- **Web Vitals** monitoring

## Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- **Core functionality** works without JavaScript
- **Enhanced features** with modern browser APIs
- **Fallbacks** for older browsers

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check backend server is running
   - Verify CORS settings
   - Check firewall/proxy settings

2. **API Requests Failing**
   - Verify API URL in environment variables
   - Check network connectivity
   - Review browser console for errors

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors
   - Verify all dependencies are installed

### Debug Mode
Enable debug logging:
```javascript
localStorage.setItem('debug', 'magicslides:*');
```

### Development Tools
- **React DevTools** for component inspection
- **Redux DevTools** for state debugging
- **Network tab** for API monitoring
- **Console logs** for error tracking