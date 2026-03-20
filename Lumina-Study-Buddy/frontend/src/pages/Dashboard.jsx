import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, FileQuestion, BookOpen, CalendarDays,
  FileText, Lightbulb, ArrowRight, Sparkles, Zap
} from 'lucide-react';

const FEATURES = [
  {
    path: '/chat',
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Ask anything about your notes or any topic. Upload a PDF for context-aware Q&A.',
    accent: 'blue',
    tag: 'Context-aware',
  },
  {
    path: '/quiz',
    icon: FileQuestion,
    title: 'Quiz Generator',
    description: 'Generate MCQ quizzes from any text or PDF. Instant scoring and explanations.',
    accent: 'amber',
    tag: 'Interactive',
  },
  {
    path: '/flashcards',
    icon: BookOpen,
    title: 'Flashcards',
    description: 'Turn your notes into interactive flip flashcards for active recall practice.',
    accent: 'teal',
    tag: 'Active recall',
  },
  {
    path: '/studyplan',
    icon: CalendarDays,
    title: 'Study Plan',
    description: 'Get a day-by-day personalized study plan tailored to your topic and timeline.',
    accent: 'rose',
    tag: 'Personalized',
  },
  {
    path: '/summarizer',
    icon: FileText,
    title: 'Smart Summarizer',
    description: 'Summarize content in 4 styles: Concise, Detailed, ELI5, or Cornell Notes.',
    accent: 'blue',
    tag: '4 styles',
  },
  {
    path: '/explain',
    icon: Lightbulb,
    title: 'Concept Explainer',
    description: 'Get any concept explained at Beginner, Intermediate, Advanced, or Feynman level.',
    accent: 'teal',
    tag: '4 levels',
  },
];

const accentStyles = {
  blue:  { card: 'hover:border-primary/40',  icon: 'bg-primary/10 text-primary',  tag: 'bg-primary/10 text-primary' },
  teal:  { card: 'hover:border-teal/40',    icon: 'bg-teal/10 text-teal',        tag: 'bg-teal/10 text-teal' },
  amber: { card: 'hover:border-amber/40',   icon: 'bg-amber/10 text-amber',      tag: 'bg-amber/10 text-amber' },
  rose:  { card: 'hover:border-rose/40',    icon: 'bg-rose/10 text-rose',        tag: 'bg-rose/10 text-rose' },
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full dot-grid">
      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Hero */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-s2 border border-border p-8">
          <div className="absolute -top-20 -right-20 w-72 h-72 glow-blue pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 glow-teal pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles size={15} className="text-white" />
              </div>
              <span className="font-display font-700 text-lg text-t1">Lumina</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                AI Study Buddy
              </span>
            </div>
            <h1 className="font-display text-3xl font-800 text-t1 leading-tight mb-2">
              Study smarter.<br />
              <span className="text-primary">Not harder.</span>
            </h1>
            <p className="text-t2 text-sm max-w-md leading-relaxed">
              Powered by Gemini 2.0 Flash. Upload your notes or PDFs and let Lumina turn them into quizzes, flashcards, study plans, and more — in seconds.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => navigate('/chat')}
                className="relative overflow-hidden btn-shine flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Zap size={14} />
                Start Studying
              </button>
              <button
                onClick={() => navigate('/studyplan')}
                className="flex items-center gap-2 px-4 py-2 bg-s3 hover:bg-border text-t1 text-sm font-medium rounded-lg transition-colors border border-border"
              >
                Create Study Plan
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div>
          <h2 className="font-display text-sm font-600 text-t3 uppercase tracking-wider mb-4">All Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => {
              const styles = accentStyles[f.accent];
              return (
                <button
                  key={f.path}
                  onClick={() => navigate(f.path)}
                  className={`group text-left p-5 bg-surface border border-border rounded-xl transition-all duration-200 hover:bg-s2 ${styles.card}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${styles.icon}`}>
                      <f.icon size={17} />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles.tag}`}>
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-600 text-t1 text-sm mb-1">{f.title}</h3>
                  <p className="text-t2 text-xs leading-relaxed">{f.description}</p>
                  <div className={`flex items-center gap-1 mt-3 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${styles.tag.split(' ')[1]}`}>
                    Open <ArrowRight size={11} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-t3 text-xs text-center mt-10">
          Lumina uses Google Gemini 2.0 Flash — responses are AI-generated. Always verify important information.
        </p>
      </div>
    </div>
  );
}