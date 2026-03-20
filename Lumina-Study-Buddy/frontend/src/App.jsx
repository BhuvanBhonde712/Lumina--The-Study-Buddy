import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import StudyPlan from './pages/StudyPlan';
import Summarizer from './pages/Summarizer';
import Explain from './pages/Explain';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="chat" element={<Chat />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="studyplan" element={<StudyPlan />} />
        <Route path="summarizer" element={<Summarizer />} />
        <Route path="explain" element={<Explain />} />
      </Route>
    </Routes>
  );
}