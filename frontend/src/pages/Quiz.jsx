import { useState } from 'react';
import { FileQuestion, ChevronRight, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { quizAPI } from '../api';
import PageHeader from '../components/PageHeader';
import PDFUpload from '../components/PDFUpload';
import LoadingSpinner from '../components/LoadingSpinner';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const COUNTS = [5, 10, 15, 20];

export default function Quiz() {
  const [content, setContent] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQ, setCurrentQ] = useState(0);

  const generate = async () => {
    if (!content.trim() || content.length < 50) {
      setError('Please provide at least 50 characters of study material.');
      return;
    }
    setError('');
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setCurrentQ(0);
    try {
      const res = await quizAPI.generate(content, numQuestions, difficulty);
      setQuiz(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => setSubmitted(true);

  const score = quiz ? quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0) : 0;
  const pct = quiz ? Math.round((score / quiz.questions.length) * 100) : 0;

  const reset = () => {
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setCurrentQ(0);
  };

  return (
    <div className="min-h-full px-8 py-8 max-w-4xl mx-auto">
      <PageHeader icon={FileQuestion} title="Quiz Generator" subtitle="Generate interactive MCQ quizzes from any text or PDF" accent="amber" />

      {!quiz && !loading && (
        <div className="space-y-5 animate-slide-up">
          {/* Content input */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-t2 text-xs font-medium mb-3 uppercase tracking-wide">Study Material</p>
            <PDFUpload onExtracted={(text) => setContent(text)} compact />
            <div className="mt-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Or paste your notes, textbook excerpts, or any text here..."
                rows={6}
                className="w-full bg-s2 border border-border hover:border-border-2 focus:border-amber/50 text-t1 placeholder-t3 text-sm px-4 py-3 rounded-xl outline-none transition-colors resize-none leading-relaxed"
              />
              <p className="text-t3 text-xs mt-1">{content.length} characters</p>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-t2 text-xs font-medium mb-3 uppercase tracking-wide">Number of Questions</p>
              <div className="flex gap-2">
                {COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumQuestions(n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border
                      ${numQuestions === n ? 'bg-amber/10 border-amber/40 text-amber' : 'bg-s3 border-border text-t2 hover:text-t1'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-t2 text-xs font-medium mb-3 uppercase tracking-wide">Difficulty</p>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors border
                      ${difficulty === d ? 'bg-amber/10 border-amber/40 text-amber' : 'bg-s3 border-border text-t2 hover:text-t1'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-rose text-sm px-1">{error}</p>}

          <button
            onClick={generate}
            disabled={!content.trim()}
            className="w-full py-3 bg-amber/90 hover:bg-amber disabled:opacity-40 disabled:cursor-not-allowed text-base font-semibold text-black rounded-xl transition-colors font-display"
          >
            Generate Quiz
          </button>
        </div>
      )}

      {loading && <LoadingSpinner message={`Generating ${numQuestions} ${difficulty} questions...`} />}

      {quiz && !loading && (
        <div className="animate-slide-up">
          {/* Quiz header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-700 text-t1 text-lg">{quiz.title}</h2>
              <p className="text-t2 text-xs mt-0.5 capitalize">{quiz.difficulty} · {quiz.questions.length} questions</p>
            </div>
            <div className="flex items-center gap-3">
              {!submitted && (
                <span className="text-t2 text-sm">
                  {Object.keys(answers).length}/{quiz.questions.length} answered
                </span>
              )}
              <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 bg-s3 border border-border rounded-lg text-t2 hover:text-t1 text-xs transition-colors">
                <RotateCcw size={12} /> New Quiz
              </button>
            </div>
          </div>

          {/* Score card (after submit) */}
          {submitted && (
            <div className={`flex items-center gap-4 p-5 rounded-xl border mb-6
              ${pct >= 80 ? 'bg-teal/5 border-teal/20' : pct >= 50 ? 'bg-amber/5 border-amber/20' : 'bg-rose/5 border-rose/20'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-display font-800
                ${pct >= 80 ? 'bg-teal/15 text-teal' : pct >= 50 ? 'bg-amber/15 text-amber' : 'bg-rose/15 text-rose'}`}>
                {pct}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Trophy size={15} className={pct >= 80 ? 'text-teal' : pct >= 50 ? 'text-amber' : 'text-rose'} />
                  <span className="font-display font-600 text-t1">
                    {pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good effort!' : 'Keep studying!'}
                  </span>
                </div>
                <p className="text-t2 text-sm mt-0.5">{score} out of {quiz.questions.length} correct</p>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-4">
            {quiz.questions.map((q, qi) => (
              <div
                key={qi}
                className={`bg-surface border rounded-xl p-5 transition-colors
                  ${submitted && answers[qi] === q.correct ? 'border-teal/30' :
                    submitted && answers[qi] !== undefined ? 'border-rose/30' : 'border-border'}`}
              >
                <p className="text-t2 text-xs mb-2 font-medium">Question {qi + 1}</p>
                <p className="text-t1 text-sm font-medium mb-4 leading-relaxed">{q.question}</p>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = answers[qi] === oi;
                    const isCorrect = q.correct === oi;
                    let style = 'bg-s3 border-border text-t2 hover:border-border-2 hover:text-t1';
                    if (!submitted && isSelected) style = 'bg-primary/10 border-primary/40 text-t1';
                    if (submitted && isCorrect) style = 'bg-teal/10 border-teal/40 text-teal';
                    if (submitted && isSelected && !isCorrect) style = 'bg-rose/10 border-rose/40 text-rose';

                    return (
                      <button
                        key={oi}
                        onClick={() => selectAnswer(qi, oi)}
                        disabled={submitted}
                        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}
                      >
                        <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                          {submitted && isCorrect ? <CheckCircle size={16} className="text-teal" /> :
                           submitted && isSelected && !isCorrect ? <XCircle size={16} className="text-rose" /> :
                           <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">
                             {['A','B','C','D'][oi]}
                           </span>}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div className="mt-3 flex items-start gap-2 p-3 bg-s3 rounded-lg">
                    <ChevronRight size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-t2 text-xs leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!submitted && (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < quiz.questions.length}
              className="w-full mt-6 py-3 bg-amber/90 hover:bg-amber disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors font-display"
            >
              Submit Quiz ({Object.keys(answers).length}/{quiz.questions.length} answered)
            </button>
          )}
        </div>
      )}
    </div>
  );
}