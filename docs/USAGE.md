# Usage Guide

## Getting Started

This guide will walk you through using the MagicSlides AI application to create and edit PowerPoint presentations using conversational AI.

## Quick Start

### 1. Starting the Application

**Development Mode:**
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend  
cd frontend
npm start
```

**Production Mode:**
```bash
# From project root
npm run install-all
npm run build
npm start
```

The application will be available at `http://localhost:3000`

### 2. Initial Setup

1. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key
   - Add it to `backend/.env`: `GEMINI_API_KEY=your_key_here`

2. **First Launch:**
   - Open `http://localhost:3000` in your browser
   - You should see the MagicSlides AI interface
   - The connection status indicator should show "Connected"

## Creating Your First Presentation

### Step 1: Enter Your Prompt

In the chat interface, describe the presentation you want to create. Here are some examples:

**Basic Examples:**
- "Create a 5-slide presentation about renewable energy"
- "Make a business presentation about our new product launch"
- "Build an educational slideshow about artificial intelligence"

**Detailed Examples:**
- "Create a presentation about digital marketing strategies with 6 slides including introduction, social media, SEO, content marketing, analytics, and conclusion"
- "Make a technical presentation about machine learning algorithms covering supervised learning, unsupervised learning, and neural networks"

### Step 2: Watch the Generation Process

The application provides real-time progress updates:

1. **Analyzing** (10%): Understanding your request
2. **Generating** (30%): Creating content with AI
3. **Formatting** (60%): Structuring slides
4. **Creating** (80%): Building PowerPoint file
5. **Complete** (100%): Ready for preview and download

### Step 3: Preview Your Presentation

Once generated, you can:
- **Navigate slides** using arrow buttons or thumbnail clicks
- **View slide content** in the main preview area
- **Toggle speaker notes** with the eye icon
- **See slide counter** (e.g., "3 / 7")

## Editing Presentations

### Making Changes

Use conversational prompts to edit your presentation:

**Content Changes:**
- "Add a slide about solar power statistics"
- "Make the conclusion slide more impactful"
- "Add more bullet points to slide 3"

**Style Changes:**
- "Change the color scheme to blue and white"
- "Make the fonts larger and more readable"
- "Use a more professional theme"

**Structure Changes:**
- "Reorder the slides to put benefits before features"
- "Split slide 4 into two separate slides"
- "Remove the last slide"

### Editing Methods

**Method 1: Chat Interface**
1. Type your edit request in the chat
2. Press Enter or click Send
3. Wait for the AI to process and regenerate

**Method 2: Preview Panel**
1. Click the edit icon (pencil) in the preview header
2. Enter your edit request in the popup
3. Click "Apply Changes"

## Advanced Features

### Slide Layouts

The application supports multiple slide layouts:

**Title Layout:**
- Large main title
- Subtitle text
- Perfect for opening and section slides

**Content Layout:**
- Title at the top
- Bullet points below
- Most common layout for information

**Two Column Layout:**
- Title at the top
- Content split into left and right columns
- Great for comparisons or lists

**Image Layout:**
- Title and content on the left
- Image placeholder on the right
- Ideal for visual content

### Speaker Notes

Add speaker notes to your slides:
- "Add speaker notes to slide 2 about key statistics"
- "Include talking points for the conclusion slide"
- Toggle notes visibility with the eye icon in preview

### Themes and Styling

Customize your presentation appearance:
- "Use a dark theme with white text"
- "Apply a corporate blue color scheme"
- "Make it look more modern and minimal"
- "Use Arial font throughout the presentation"

## Downloading and Sharing

### Download Options

1. **PPTX Format:**
   - Click the "Download" button in preview
   - Saves as PowerPoint file (.pptx)
   - Compatible with Microsoft PowerPoint, Google Slides, LibreOffice

2. **File Information:**
   - View file size and creation date
   - Check download history
   - Manage saved presentations

### Sharing Your Work

**Direct Sharing:**
- Download the PPTX file
- Share via email, cloud storage, or messaging apps
- Recipients can open with any presentation software

**Online Sharing:**
- Upload to Google Drive or OneDrive
- Share presentation links
- Collaborate with team members

## Tips and Best Practices

### Writing Effective Prompts

**Be Specific:**
✅ "Create a 6-slide presentation about renewable energy including solar, wind, hydro power, benefits, challenges, and future outlook"
❌ "Make a presentation about energy"

**Include Context:**
✅ "Create a business presentation for investors about our new mobile app startup, focusing on market opportunity, product features, business model, and financial projections"
❌ "Make slides about our app"

**Specify Requirements:**
✅ "Create a technical presentation for developers about React best practices with code examples and 8 slides"
❌ "Talk about React"

### Editing Effectively

**Incremental Changes:**
- Make one change at a time for better results
- Be specific about which slide or section to modify
- Test changes before making additional edits

**Clear Instructions:**
✅ "Change slide 3 title to 'Market Analysis' and add three bullet points about target demographics"
❌ "Fix slide 3"

### Content Guidelines

**Slide Content:**
- Keep bullet points concise (1-2 lines each)
- Use 3-7 bullet points per slide
- Include clear, descriptive titles
- Add speaker notes for additional context

**Presentation Structure:**
- Start with an introduction/overview slide
- Organize content logically
- End with conclusions or next steps
- Use consistent formatting throughout

### Performance Tips

**For Better Results:**
- Wait for generation to complete before making edits
- Keep prompts under 1000 characters
- Be patient with complex requests
- Use descriptive language for better AI understanding

**Troubleshooting:**
- If generation fails, try a simpler prompt
- Check your internet connection
- Verify the backend server is running
- Clear browser cache if needed

## Common Use Cases

### Business Presentations

**Sales Pitch:**
"Create a compelling sales presentation for our new software product including problem statement, solution overview, key features, benefits, pricing, and call to action"

**Quarterly Review:**
"Build a quarterly business review presentation covering performance metrics, achievements, challenges, market analysis, and goals for next quarter"

**Project Proposal:**
"Create a project proposal presentation including project overview, objectives, timeline, resources needed, budget, and expected outcomes"

### Educational Content

**Course Lectures:**
"Create an educational presentation about photosynthesis for high school biology students with diagrams, process steps, and key concepts"

**Training Materials:**
"Build a training presentation for new employees covering company culture, policies, procedures, tools, and best practices"

**Conference Talks:**
"Create a conference presentation about emerging AI trends including current state, breakthrough technologies, industry applications, and future predictions"

### Personal Projects

**Event Planning:**
"Create a presentation for planning a wedding including timeline, budget, vendors, venue options, and checklist"

**Travel Plans:**
"Build a travel presentation for our Europe trip including itinerary, accommodations, transportation, activities, and budget"

**Investment Proposals:**
"Create a presentation for requesting startup funding including business model, market opportunity, competitive analysis, financial projections, and funding requirements"

## Keyboard Shortcuts

### Chat Interface
- `Enter`: Send message
- `Shift + Enter`: New line in message
- `Ctrl + A`: Select all text in input

### Presentation Preview
- `Left Arrow`: Previous slide
- `Right Arrow`: Next slide
- `Escape`: Close edit dialog
- `Ctrl + D`: Download presentation

## Troubleshooting

### Common Issues

**No Response from AI:**
1. Check internet connection
2. Verify Gemini API key is set correctly
3. Check backend server is running
4. Try a simpler prompt

**Poor Quality Results:**
1. Make prompts more specific and detailed
2. Include context and requirements
3. Specify the target audience
4. Break complex requests into steps

**Generation Fails:**
1. Reduce prompt length
2. Remove special characters
3. Check for API rate limits
4. Try again after a few minutes

**Download Issues:**
1. Check if file was generated successfully
2. Verify browser allows downloads
3. Check available disk space
4. Try downloading again

### Getting Help

**Documentation:**
- [Backend API Reference](./docs/backend/API.md)
- [Frontend Component Guide](./docs/frontend/README.md)
- [Deployment Instructions](./docs/DEPLOYMENT.md)

**Support:**
- Check server logs for error messages
- Review browser console for frontend issues
- Verify environment variables are set correctly
- Test API endpoints directly

## Best Practices Summary

1. **Start Simple:** Begin with basic prompts and add complexity gradually
2. **Be Specific:** Provide clear, detailed instructions for better results
3. **Iterate:** Make incremental improvements rather than major overhauls
4. **Test:** Preview presentations before important meetings
5. **Backup:** Download important presentations for safekeeping
6. **Plan:** Outline your presentation structure before generating
7. **Customize:** Use editing features to fine-tune content and style

## Advanced Usage

### API Integration

For developers wanting to integrate with other systems:

```javascript
// Generate presentation programmatically
const response = await fetch('/api/chat/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Create a technical presentation about microservices',
    sessionId: 'session_' + Date.now()
  })
});

const result = await response.json();
console.log('Generated:', result.data.filename);
```

### Batch Processing

Create multiple presentations automatically:

```javascript
const topics = [
  'Introduction to React',
  'Advanced JavaScript Concepts',
  'Database Design Principles'
];

for (const topic of topics) {
  await generatePresentation(`Create a technical presentation about ${topic}`);
}
```

### Custom Themes

Request specific branding and themes:

```
"Create a presentation using our company colors - primary blue (#1e40af), secondary green (#059669), and white background. Use our corporate font Helvetica and include our logo placeholder on each slide."
```

This comprehensive usage guide should help users at all levels make the most of the MagicSlides AI application. Whether you're creating simple presentations or complex multi-slide decks, these guidelines will help you achieve professional results efficiently.