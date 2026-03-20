# Lumina — AI Study Buddy

> Transforming the way students learn. Upload your notes, get quizzes, flashcards, study plans, summaries, and concept explanations — all powered by Google Gemini AI.

---

## Overview

Lumina is a full-stack AI-powered study assistant built for the modern learner. It takes raw study material — pasted text or uploaded PDFs — and transforms it into structured, interactive learning tools in seconds. Instead of passively reading notes, students actively engage with their material through quizzes, flashcards, and personalized plans tailored to their pace and level.

Built with a React + Vite frontend, a Node.js + Express backend, and Google Gemini 2.5 Flash as the AI engine, Lumina delivers fast, accurate, and genuinely useful study tools that adapt to any subject.

---

## Features

### AI Chat
Context-aware conversational AI grounded in the student's own notes. Upload a PDF and every response is anchored to that specific material. Full conversation history is maintained throughout the session.

### Quiz Generator
Converts any text or PDF into a fully interactive multiple choice quiz. Supports 5, 10, 15, or 20 questions across easy, medium, and hard difficulty levels. Live scoring, per-question explanations, and color-coded correct/incorrect feedback on submission.

### Flashcard Generator
Produces animated 3D flip flashcards from study material with active recall tracking. Students mark cards as "Got it" to track mastery, shuffle the deck for spaced repetition, and navigate via a visual card grid.

### Personalized Study Plan
Generates a day-by-day study roadmap based on topic, current level, available time per day, and learning goals. Outputs weekly themes, daily tasks, milestone checkpoints, and actionable study tips — all structured and collapsible for easy navigation.

### Smart Summarizer
Condenses any content into four distinct styles — Concise bullet points, Detailed structured notes, ELI5 (plain language for beginners), and Cornell Notes format with cue questions and summary. Side-by-side input and output layout for efficient workflow.

### Concept Explainer
Explains any concept at four depth levels — Beginner, Intermediate, Advanced, and Feynman Technique. Each explanation follows a consistent structure: definition, core explanation, real-world analogy, and key takeaways formatted in markdown.

### PDF Upload
Drag-and-drop or click-to-browse PDF upload across all features. Extracts clean text from uploaded PDFs and feeds it directly into any tool — chat context, quiz generation, flashcard creation, or summarization.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client for API calls |
| react-markdown + remark-gfm | Markdown rendering in chat and explanations |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Google Generative AI SDK | Gemini 2.5 Flash integration |
| pdf-parse | Server-side PDF text extraction |
| Multer | Multipart file upload handling |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |
| nodemon | Development auto-restart |

---

## Project Structure

```
lumina-study-buddy/
│
├── backend/
│   ├── routes/
│   │   ├── chat.js          AI chat with conversation history
│   │   ├── quiz.js          MCQ quiz generation
│   │   ├── flashcards.js    Flashcard set generation
│   │   ├── studyplan.js     Personalized study plan
│   │   ├── summarize.js     4-style content summarization
│   │   ├── explain.js       4-level concept explanation
│   │   └── upload.js        PDF text extraction
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js         Axios API client with interceptors
│   │   ├── components/
│   │   │   ├── Layout.jsx        Sidebar navigation
│   │   │   ├── PageHeader.jsx    Reusable page header
│   │   │   ├── PDFUpload.jsx     Drag-and-drop uploader
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── MarkdownRenderer.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Flashcards.jsx
│   │   │   ├── StudyPlan.jsx
│   │   │   ├── Summarizer.jsx
│   │   │   └── Explain.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md
├── .gitignore
└── package.json
```

---

## Local Setup

### Prerequisites
- Node.js v18 or higher
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/lumina-study-buddy.git
cd lumina-study-buddy
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`. You should see:
```
Lumina backend running on port 5000
```

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`. Vite proxies all `/api` requests to the backend automatically during development.

---

## Deployment

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect the GitHub repository
3. Set the following configuration:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |

4. Add environment variable: `GEMINI_API_KEY` = your actual key
5. Deploy — Render provides a public URL for the backend

### Frontend — Vercel

1. Create a `vercel.json` file inside the `frontend/` folder:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://your-render-url.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

2. Create a new project on [Vercel](https://vercel.com)
3. Import the GitHub repository
4. Set **Root Directory** to `frontend`
5. Deploy — Vercel provides the live frontend URL

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send a message with optional PDF context |
| POST | `/api/quiz` | Generate MCQ quiz from content |
| POST | `/api/flashcards` | Generate flashcard set from content |
| POST | `/api/studyplan` | Generate personalized study plan |
| POST | `/api/summarize` | Summarize content in selected style |
| POST | `/api/explain` | Explain a concept at selected level |
| POST | `/api/upload/pdf` | Extract text from uploaded PDF |
| GET | `/health` | Backend health check |

---

## Design Decisions

**Why Gemini 2.0 Flash?**
Speed matters in a study tool. Gemini 2.0 Flash delivers high-quality responses with significantly lower latency than larger models, making the experience feel instant rather than laggy.

**Why a separate backend instead of calling Gemini directly from the frontend?**
Keeping the API key server-side is a non-negotiable security requirement. The backend also handles PDF parsing, prompt engineering, and response validation — concerns that do not belong in the browser.

**Why structured JSON prompts for quiz and flashcard generation?**
Prompting Gemini to return strict JSON with a defined schema gives full control over UI rendering. Each question, option, and explanation maps directly to a component with no parsing guesswork.

**Why pdf-parse over browser-side extraction?**
Server-side extraction is more reliable across PDF types, handles larger files gracefully, and keeps the frontend bundle lean.

---

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API key**
4. Create a new project or select an existing one
5. Copy the key and paste it into `backend/.env`

---

## Author

**Bhuvan Bhonde**
