# 🚀 AI-Powered Learning Assistant

> An intelligent educational platform powered by Google's Gemini AI, featuring local processing with Gemini Nano for enhanced privacy and performance.

[![Built with Gemini Nano](https://img.shields.io/badge/Gemini%20Nano-Built--in%20AI-blue)](https://developer.chrome.com/docs/ai/built-in)
[![Google AI Challenge 2025](https://img.shields.io/badge/Google%20AI%20Challenge-2025-green)](https://developers.google.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Gemini Nano Integration](#gemini-nano-integration)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Browser Requirements](#browser-requirements)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This AI-powered learning assistant revolutionizes the educational experience by combining cloud-based Gemini AI with local Gemini Nano processing. The platform provides students and educators with intelligent tools to create study materials, practice exercises, and interactive learning content.

**Built for the Google Built-in AI Challenge 2025**, this project showcases the power of Gemini Nano's on-device AI capabilities, offering:
- ⚡ **Lightning-fast processing** with local AI
- 🔒 **Enhanced privacy** - no data leaves your device for core features
- 🌐 **Offline capabilities** for summarization, exercises, and flashcards
- 🎓 **Comprehensive learning tools** for effective study sessions

## 📸 ScreenShots
- **Home Page**
<img width="1872" height="969" alt="projectAILearning" src="https://github.com/user-attachments/assets/88b8c514-8784-4e8e-9dbb-a50d86be1d4f" />

- **Roadmap Module**
<img width="1888" height="967" alt="Screenshot 2025-10-29 133123 - Copy" src="https://github.com/user-attachments/assets/9cb8e961-1649-425d-9eba-0971161e1608" />

- **Sumarizer Module**
<img width="1879" height="970" alt="Screenshot 2025-10-29 132846 - Copy" src="https://github.com/user-attachments/assets/09a8d279-b2b6-4482-bd83-ac2278289bbe" />

- **FlashCards Molule**
<img width="1859" height="959" alt="Screenshot 2025-10-29 133150" src="https://github.com/user-attachments/assets/579ea708-977e-4c1a-8815-e767b8454058" />


## ✨ Key Features

### 🤖 Gemini Nano Powered (Local Processing)

These features run entirely in your browser using Gemini Nano:

#### 📄 PDF Summarization
- Intelligent document analysis and summarization
- Extract key concepts and main ideas
- Multi-language support
- **100% local processing - your documents never leave your device**

#### 📝 Exercise Generation
Generate various types of exercises from any content:
- **Multiple Choice** - Questions with 3-5 answer options
- **True/False** - Statement validation exercises
- **Fill in the Blanks** - Complete the sentence activities
- **Short Answer** - Open-ended questions
- **Matching** - Connect related concepts

Each exercise includes:
- Difficulty levels (Easy, Medium, Hard)
- Correct answers with explanations
- Learning objectives
- Topic-based generation

#### 🎴 Flashcard Creation
- Automatic flashcard generation from documents
- Customizable difficulty levels
- Key terms extraction
- Tags and categorization
- Focus area specification
- **Privacy-first: all processing happens locally**

### ☁️ Gemini API Powered (Cloud Processing)

#### 🗺️ Learning Roadmaps
- Personalized learning paths
- Topic progression planning
- Milestone tracking
- Prerequisites mapping

#### 🎮 Educational Games
- **Word Search (Pupiletras)** - Find hidden words
- **Crossword Puzzles** - Interactive vocabulary building
- Topic-based game generation
- Multiple difficulty levels

## 🧠 Gemini Nano Integration

This project leverages **Google's Gemini Nano** - a lightweight AI model that runs directly in the browser. This approach offers significant advantages:

### Why Gemini Nano?

- **Privacy First**: Sensitive documents and study materials are processed locally
- **Speed**: No network latency - instant responses
- **Offline Capable**: Works without internet connection
- **Cost Effective**: No API usage costs for core features
- **Always Available**: No rate limits or service interruptions

### Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js)              │
│  ┌───────────────────────────────────┐  │
│  │    Gemini Nano Client             │  │
│  │    (Browser-based AI)             │  │
│  │  • Summarizer                     │  │
│  │  • Exercise Generator             │  │
│  │  • Flashcard Generator            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │    Gemini API Client              │  │
│  │    (Cloud-based AI)               │  │
│  │  • Learning Roadmaps              │  │
│  │  • Educational Games              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      Backend (FastAPI/Python)           │
│  • PDF Processing                       │
│  • API Integration                      │
│  • Content Management                   │
└─────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **AI Integration**: 
  - Gemini Nano (Built-in AI API)
  - Gemini API (Cloud)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

### Backend
- **Framework**: FastAPI (Python)
- **AI Integration**: 
  - Google Generative AI SDK
  - LangChain for prompt management
- **PDF Processing**: PyPDF2, pdfplumber
- **Async Support**: asyncio

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **Python** 3.9+
- **Google Chrome Canary** (for Gemini Nano features)
- Gemini API Key (for cloud features)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-learning-assistant.git
cd ai-learning-assistant
```

#### 2. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run backend
uvicorn app.main:app --reload
```

#### 3. Setup Frontend

```bash
cd frontend
npm install

# Run frontend
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── nano/              # Gemini Nano integration
│   │   │   ├── AIClient.ts    # Nano client wrapper
│   │   │   ├── exercises/     # Exercise generation
│   │   │   ├── flashcards/    # Flashcard generation
│   │   │   └── utils/         # Helper functions
│   │   ├── app/               # Next.js pages
│   │   └── components/        # React components
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── integrations/      # AI integrations
│   │   │   ├── exercises/     # Exercise templates
│   │   │   ├── flashcards/    # Flashcard templates
│   │   │   ├── games/         # Game generation
│   │   │   └── roadmap/       # Learning paths
│   │   ├── api/               # API routes
│   │   └── domain/            # Business logic
│   └── requirements.txt
│
└── README.md
```

## 💡 Usage

### Testing Gemini Nano Features

To test the Gemini Nano-powered features:

1. **Enable Gemini Nano** in Chrome Canary:
   ```
   chrome://flags/#optimization-guide-on-device-model
   chrome://flags/#prompt-api-for-gemini-nano
   ```
   Set both to "Enabled" and restart Chrome Canary

2. **Download the Model**:
   - Navigate to `chrome://components/`
   - Find "Optimization Guide On Device Model"
   - Click "Check for update"

3. **Use the Features**:
   - Upload a PDF for summarization
   - Generate exercises from any topic
   - Create flashcards from study materials

### Example: Generate Exercises

```typescript
import { generateExercises } from '@/nano/exercises/Services';

const exercises = await generateExercises({
  topic: "Photosynthesis",
  exercises_difficulty: "Medium",
  exercises_count: 5,
  exercises_types: "multiple-choice"
});
```

### Example: Create Flashcards

```typescript
import { generateFlashcards } from '@/nano/flashcards/Services';

const flashcards = await generateFlashcards({
  content: documentContent,
  flashcards_count: 10,
  difficulty_level: "medium",
  focus_area: "Key concepts"
});
```

## 🌐 Browser Requirements

### For Gemini Nano Features:
- **Google Chrome Canary** (version 128+)
- Built-in AI API enabled
- Gemini Nano model downloaded

### For Cloud Features:
- Any modern browser (Chrome, Firefox, Safari, Edge)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- Built for the **Google Built-in AI Challenge 2025**
- Powered by **Gemini Nano** and **Gemini API**
- Special thanks to the Chrome AI team for the Built-in AI APIs

---

**Note**: This project is part of the Google Built-in AI Challenge 2025 and showcases the capabilities of Gemini Nano for on-device AI processing in educational applications.
