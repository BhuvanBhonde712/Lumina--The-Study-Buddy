import { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react';
import { flashcardsAPI } from '../api';
import PageHeader from '../components/PageHeader';
import PDFUpload from '../components/PDFUpload';
import LoadingSpinner from '../components/LoadingSpinner';

const COUNTS = [10, 15, 20, 25];

export default function Flashcards() {
  const [content, setContent] = useState('');
  const [numCards, setNumCards] = useState(15);
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [known, setKnown] = useState(new Set());

  const generate = async () => {
    if (!content.trim() || content.length < 50) {
      setError('Please provide at least 50 characters of study material.');
      return;
    }
    setError('');
    setLoading(true);
    setDeck(null);
    try {
      const res = await flashcardsAPI.generate(content, numCards);
      setDeck(res.data);
      setCards(res.data.cards);
      setCurrent(0);
      setFlipped(false);
      setKnown(new Set());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    setFlipped(false);
    setTimeout(() => setCurrent((c) => Math.min(c + 1, cards.length - 1)), 200);
  };

  const prev = () => {
    setFlipped(false);
    setTimeout(() => setCurrent((c) => Math.max(c - 1, 0)), 200);
  };

  const shuffle = () => {
    setCards((c) => [...c].sort(() => Math.random() - 0.5));
    setCurrent(0);
    setFlipped(false);
    setKnown(new Set());
  };

  const markKnown = () => {
    setKnown((prev) => new Set([...prev, cards[current].id]));
    if (current < cards.length - 1) next();
  };

  const reset = () => { setDeck(null); setCards([]); setContent(''); };

  return (
    <div className="min-h-full px-8 py-8 max-w-3xl mx-auto">
      <PageHeader icon={BookOpen} title="Flashcards" subtitle="Active recall practice with animated flip cards" accent="teal" />

      {!deck && !loading && (
        <div className="space-y-5 animate-slide-up">
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-t2 text-xs font-medium mb-3 uppercase tracking-wide">Study Material</p>
            <PDFUpload onExtracted={(text) => setContent(text)} compact />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Or paste your notes here..."
              rows={6}
              className="w-full mt-3 bg-s2 border border-border hover:border-border-2 focus:border-teal/50 text-t1 placeholder-t3 text-sm px-4 py-3 rounded-xl outline-none transition-colors resize-none leading-relaxed"
            />
            <p className="text-t3 text-xs mt-1">{content.length} characters</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-t2 text-xs font-medium mb-3 uppercase tracking-wide">Number of Cards</p>
            <div className="flex gap-2">
              {COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setNumCards(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border
                    ${numCards === n ? 'bg-teal/10 border-teal/40 text-teal' : 'bg-s3 border-border text-t2 hover:text-t1'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-rose text-sm px-1">{error}</p>}

          <button
            onClick={generate}
            disabled={!content.trim()}
            className="w-full py-3 bg-teal/90 hover:bg-teal disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors font-display"
          >
            Generate Flashcards
          </button>
        </div>
      )}

      {loading && <LoadingSpinner message={`Creating ${numCards} flashcards...`} />}

      {deck && !loading && (
        <div className="animate-slide-up">
          {/* Stats bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-700 text-t1">{deck.title}</h2>
              <p className="text-t2 text-xs mt-0.5">
                {current + 1} / {cards.length} cards
                {known.size > 0 && <span className="ml-2 text-teal">{known.size} known</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={shuffle} className="flex items-center gap-1.5 px-3 py-1.5 bg-s3 border border-border rounded-lg text-t2 hover:text-t1 text-xs transition-colors">
                <Shuffle size={12} /> Shuffle
              </button>
              <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 bg-s3 border border-border rounded-lg text-t2 hover:text-t1 text-xs transition-colors">
                <RotateCcw size={12} /> New
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-s3 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-teal rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / cards.length) * 100}%` }}
            />
          </div>

          {/* Card */}
          <div className="perspective mb-6" style={{ height: '260px' }}>
            <div
              className={`card-inner cursor-pointer ${flipped ? 'flipped' : ''}`}
              onClick={() => setFlipped(!flipped)}
            >
              {/* Front */}
              <div className="card-front flex flex-col items-center justify-center p-8 bg-s2 border border-border">
                <span className="text-teal text-xs font-medium uppercase tracking-wider mb-4">
                  {cards[current]?.category || 'Question'}
                </span>
                <p className="text-t1 text-lg text-center font-display font-600 leading-snug">
                  {cards[current]?.front}
                </p>
                <p className="text-t3 text-xs mt-6">Click to reveal answer</p>
              </div>
              {/* Back */}
              <div className="card-back flex flex-col items-center justify-center p-8 bg-teal/5 border border-teal/25">
                <span className="text-teal text-xs font-medium uppercase tracking-wider mb-4">Answer</span>
                <p className="text-t1 text-base text-center leading-relaxed">
                  {cards[current]?.back}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={prev}
              disabled={current === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-s3 border border-border rounded-lg text-t2 hover:text-t1 disabled:opacity-30 text-sm transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div className="flex gap-3">
              {flipped && (
                <>
                  <button
                    onClick={markKnown}
                    className="px-4 py-2 bg-teal/10 border border-teal/30 text-teal rounded-lg text-sm font-medium hover:bg-teal/20 transition-colors"
                  >
                    Got it
                  </button>
                  <button
                    onClick={next}
                    disabled={current === cards.length - 1}
                    className="px-4 py-2 bg-s3 border border-border text-t2 rounded-lg text-sm hover:text-t1 disabled:opacity-30 transition-colors"
                  >
                    Review again
                  </button>
                </>
              )}
            </div>

            <button
              onClick={next}
              disabled={current === cards.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 bg-s3 border border-border rounded-lg text-t2 hover:text-t1 disabled:opacity-30 text-sm transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          {/* Card grid preview */}
          <div className="mt-8">
            <p className="text-t3 text-xs uppercase tracking-wide mb-3">All Cards</p>
            <div className="grid grid-cols-5 gap-2">
              {cards.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => { setCurrent(i); setFlipped(false); }}
                  className={`h-8 rounded-lg text-xs font-medium transition-colors border
                    ${i === current ? 'bg-teal/15 border-teal/40 text-teal' :
                      known.has(c.id) ? 'bg-teal/5 border-teal/20 text-teal/60' :
                      'bg-s3 border-border text-t3 hover:text-t2'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}