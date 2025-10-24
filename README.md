# Gemini Thumbnail Editor

## 🌟 Connect & Learn More

[![Join AI Community](https://img.shields.io/badge/🚀_Join-AI_Community_(FREE)-4F46E5?style=for-the-badge)](https://www.skool.com/ai-for-your-business)
[![GitHub Profile](https://img.shields.io/badge/GitHub-Follow%20me%20for%20more%20free%20source%20code-181717?style=for-the-badge&logo=github)](https://github.com/coffeefuelbump)
[![Link Tree](https://img.shields.io/badge/Linktree-Everything-green?style=for-the-badge&logo=linktree&logoColor=white)](https://linktr.ee/corbin_brown)
[![YouTube Membership](https://img.shields.io/badge/YouTube-Become%20a%20Builder%20%26%20get%20perks-red?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/channel/UCJFMlSxcvlZg5yZUYJT0Pug/join)
[![Twitter Follow](https://img.shields.io/badge/Twitter-Follow%20@corbin__braun-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/corbin_braun)

## 🎨 About This Project

**Gemini Thumbnail Editor** is an AI-powered image editing tool that revolutionizes how content creators design and edit thumbnails. Built with React and powered by Google's Gemini 2.5 Flash Image model, this application makes professional thumbnail creation accessible to everyone.

### ✨ Key Features

- **🤖 AI-Powered Editing**: Use natural language prompts to edit images with Google's Gemini AI
- **📱 Modern Interface**: Clean, dark-themed UI optimized for thumbnail editing (16:9 aspect ratio)
- **🔄 Version Control**: Undo/redo functionality to navigate through your editing history
- **💬 Chat Interface**: Visual chat history showing all your prompts and AI responses
- **📎 Context Images**: Attach reference images to guide the AI's editing process
- **⬇️ Easy Export**: Download your edited thumbnails in various formats
- **⚡ Real-time Processing**: Fast AI-powered image generation and editing

### 🎯 Perfect For

- **Content Creators**: YouTube, TikTok, Instagram thumbnail design
- **Social Media Managers**: Quick image editing for posts and stories
- **Marketing Teams**: Rapid prototyping of visual content
- **Anyone**: Who wants to create professional-looking thumbnails without design skills

### 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **AI Integration**: Google Gemini 2.5 Flash Image API
- **Styling**: Tailwind CSS (inline styles)
- **Image Processing**: Base64 encoding/decoding

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/coffeefuelbump/gemini-thumbnail-editor.git
   cd gemini-thumbnail-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   - Get your Gemini API key from Google AI Studio
   - Create a `.env.local` file in the root directory
   - Add your API key:
     ```env
     API_KEY=your_gemini_api_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to start editing thumbnails!

## 🎮 How to Use

1. **Upload Your Image**: Click "Upload Image" to select your base thumbnail
2. **Describe Your Edit**: Type a natural language prompt describing what you want to change
3. **Add Context (Optional)**: Attach a reference image to guide the AI
4. **Generate**: Click send and watch the AI create your edited thumbnail
5. **Iterate**: Use undo/redo to explore different versions
6. **Download**: Save your final thumbnail when you're satisfied

### Example Prompts

- "Make the text more bold and add a glowing effect"
- "Change the background to a sunset gradient"
- "Add a shocked expression to the person's face"
- "Make the colors more vibrant and eye-catching"
- "Add a 'NEW' badge in the top right corner"

## 📁 Project Structure

```
gemini-thumbnail-editor/
├── components/
│   └── Icons.tsx          # SVG icon components
├── services/
│   └── geminiService.ts   # Gemini AI integration
├── App.tsx                # Main application component
├── types.ts               # TypeScript type definitions
└── index.tsx              # Application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for the powerful image editing capabilities
- React team for the amazing framework
- Vite for the lightning-fast build tool

---

**Made with ❤️ by [Corbin Brown](https://github.com/coffeefuelbump)**
