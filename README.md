# MagicSlides AI - PowerPoint Generation Chat Application

An AI-powered chat application that generates and edits PowerPoint presentations using the Gemini Reasoning Model and pptxgenjs.

## 🚀 Features

- **Interactive Chat Interface**: Clean, intuitive chat UI similar to MagicSlides AI-Slide
- **AI-Powered Content Generation**: Uses Gemini 2.5 Pro Preview model for intelligent slide creation
- **Dynamic PPT Generation**: Real-time PowerPoint creation using pptxgenjs
- **Live Editing**: Update presentations through conversational prompts
- **Preview & Download**: View generated presentations and download as PPTX or PDF
- **Chat History**: Persistent conversation history for revisiting past edits
- **Streaming Progress**: Real-time progress updates during presentation generation

## 🏗️ Architecture

### Frontend (React)
- Modern React application with TypeScript
- Tailwind CSS for styling
- Socket.io for real-time communication
- Responsive design with mobile support

### Backend (Node.js)
- Express.js server with TypeScript
- Gemini AI integration
- PPT generation with pptxgenjs
- WebSocket support for real-time updates
- File management and storage

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Gemini API key
- Modern web browser

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd magicsliedes
   npm run install-all
   ```

2. **Environment Setup**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # For demo mode (no API key required):
   # Set GEMINI_API_KEY=mock in backend/.env
   
   # For full AI functionality:
   # Add your Gemini API key to backend/.env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Start Development Servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:3001
   - Frontend application on http://localhost:3000

## 🎮 Demo Mode

The application includes a **mock mode** for testing without API calls:

- **Demo Mode**: Set `GEMINI_API_KEY=mock` in `backend/.env`
  - ✅ Test all UI features
  - ✅ Generate sample presentations
  - ✅ Test editing functionality
  - ✅ Download sample PPTX files
  - ❌ No real AI generation

- **Full AI Mode**: Add your real Gemini API key
  - ✅ Real AI-powered content generation
  - ✅ Intelligent presentation creation
  - ✅ Smart editing capabilities
  - ✅ Custom content based on prompts

## 📁 Project Structure

```
magicsliedes/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Utility functions
│   ├── uploads/             # Generated PPT files
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── package.json
├── docs/                    # Documentation
│   ├── frontend/            # Frontend documentation
│   └── backend/             # Backend documentation
└── README.md
```

## 🔧 Development Scripts

```bash
# Install dependencies for all projects
npm run install-all

# Start development servers
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Build for production
npm run build

# Run tests
npm run test
```

## 📚 Documentation

- [Frontend Documentation](./docs/frontend/README.md)
- [Backend Documentation](./docs/backend/README.md)
- [API Reference](./docs/backend/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🔑 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
UPLOAD_PATH=./uploads
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SOCKET_URL=http://localhost:3001
```

## 🎯 Usage

1. **Start a Conversation**: Type your presentation topic or requirements in the chat
2. **Generate Slides**: The AI will create a structured presentation based on your input
3. **Preview & Edit**: View the generated slides and request modifications
4. **Download**: Save your presentation as PPTX or PDF

### Example Prompts

- "Create a presentation about renewable energy with 5 slides"
- "Add a slide about solar power statistics"
- "Make the title slide more engaging"
- "Change the theme to a professional blue color scheme"

## 🧪 Testing

Run the test suite:

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Run all tests
npm run test
```

## 🚀 Deployment

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions on deploying to various platforms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Gemini AI](https://ai.google.dev/) for powerful language model capabilities
- [pptxgenjs](https://gitbrent.github.io/PptxGenJS/) for PowerPoint generation
- [MagicSlides](https://www.magicslides.app/) for UI inspiration

## 📞 Support

For support, email support@magicslides.dev or create an issue in the repository.