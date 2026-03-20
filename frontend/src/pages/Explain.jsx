import { useState } from 'react';
import { Lightbulb, Copy, CheckCheck } from 'lucide-react';
import { explainAPI } from '../api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';

const LEVELS = [
  { id: 'beginner',     label: 'Beginner',     desc: 'Zero prior knowledge assumed' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Some familiarity with the subject' },
  { id: 'advanced',     label: 'Advanced',     desc: 'Technically rigorous, full depth' },
  { id: 'feynman',      label: 'Feynman',       desc: 'First principles + powerful analogies' },
];

const EXAMPLES = [
  'Gradient Descent', 'Photosynthesis', 'Recursion', 'Supply & Demand',
  'Quantum Entanglement', 'Transformer Architecture', 'DNA Replication', 'Blockchain'
];

export default function Explain() {
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [subject, setSubject] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const explain = async () => {
    if (!concept.trim()) { setError('Please enter a concept.'); return; }
    setError('');
    setLoading(true);
    setExplanation('');
    try {
      const res = await explainAPI.explain(concept, level, subject);
      setExplanation(res.data.explanation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full px-8 py-8 max-w-4xl mx-auto">
      <PageHeader icon={Lightbulb} title="Concept Explainer" subtitle="Understand any concept at the depth you need" accent="teal" />

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <label className="text-t2 text-xs font-medium uppercase tracking-wide block mb-2">Concept to Explain</label>
            <input
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && explain()}
              placeholder="e.g. Neural Networks, Mitosis, Big O Notation..."
              className="w-full bg-s2 border border-border hover:border-border-2 focus:border-teal/50 text-t1 placeholder-t3 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
            />

            <p className="text-t3 text-xs font-medium mt-4 mb-2">Quick examples</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setConcept(ex)}
                  className="px-2.5 py-1 bg-s3 border border-border rounded-lg text-t2 hover:text-t1 hover:border-teal/30 text-xs transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <label className="text-t2 text-xs font-medium uppercase tracking-wide block mb-2">Subject Area (optional)</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science, Biology, Economics..."
              className="w-full bg-s2 border border-border hover:border-border-2 focus:border-teal/50 text-t1 placeholder-t3 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
            />
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-t2 text-xs font-medium uppercase tracking-wide mb-3">Explanation Level</p>
            <div className="space-y-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors
                    ${level === l.id ? 'bg-teal/10 border-teal/40' : 'bg-s3 border-border hover:border-border-2'}`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${level === l.id ? 'bg-teal' : 'bg-t3'}`} />
                  <div>
                    <p className={`text-sm font-medium ${level === l.id ? 'text-teal' : 'text-t1'}`}>{l.label}</p>
                    <p className="text-t3 text-xs">{l.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-rose text-sm">{error}</p>}

          <button
            onClick={explain}
            disabled={!concept.trim() || loading}
            className="w-full py-3 bg-teal/90 hover:bg-teal disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors font-display"
          >
            Explain Concept
          </button>
        </div>

        {/* Right: Output */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-t2 text-xs font-medium uppercase tracking-wide">Explanation</p>
            {explanation && (
              <button
                onClick={copy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-s3 border border-border rounded-lg text-t2 hover:text-t1 text-xs transition-colors"
              >
                {copied ? <><CheckCheck size={12} className="text-teal" /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && <LoadingSpinner message="Generating explanation..." />}
            {!loading && !explanation && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-10 h-10 rounded-xl bg-s3 flex items-center justify-center mb-3">
                  <Lightbulb size={18} className="text-t3" />
                </div>
                <p className="text-t3 text-sm">Your explanation will appear here</p>
              </div>
            )}
            {!loading && explanation && (
              <div className="animate-fade-in">
                <MarkdownRenderer content={explanation} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}