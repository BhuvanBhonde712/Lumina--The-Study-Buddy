import { useState } from 'react';
import { FileText, Copy, CheckCheck } from 'lucide-react';
import { summarizeAPI } from '../api';
import PageHeader from '../components/PageHeader';
import PDFUpload from '../components/PDFUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';

const STYLES = [
  { id: 'concise', label: 'Concise', desc: 'Key points only, bullet format' },
  { id: 'detailed', label: 'Detailed', desc: 'Comprehensive with all details' },
  { id: 'eli5', label: 'ELI5', desc: 'Explain like I\'m 5' },
  { id: 'cornell', label: 'Cornell Notes', desc: 'Notes + cues + summary' },
];

export default function Summarizer() {
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('concise');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const summarize = async () => {
    if (!content.trim() || content.length < 50) {
      setError('Please provide at least 50 characters to summarize.');
      return;
    }
    setError('');
    setLoading(true);
    setSummary('');
    try {
      const res = await summarizeAPI.summarize(content, style);
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full px-8 py-8 max-w-4xl mx-auto">
      <PageHeader icon={FileText} title="Smart Summarizer" subtitle="Distill any content into 4 different summary styles" accent="blue" />

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-t2 text-xs font-medium mb-3 uppercase tracking-wide">Content</p>
            <PDFUpload onExtracted={(text) => setContent(text)} compact />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Or paste your text here..."
              rows={10}
              className="w-full mt-3 bg-s2 border border-border hover:border-border-2 focus:border-primary text-t1 placeholder-t3 text-sm px-4 py-3 rounded-xl outline-none transition-colors resize-none leading-relaxed"
            />
            <p className="text-t3 text-xs mt-1">{content.length} characters</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-t2 text-xs font-medium mb-3 uppercase tracking-wide">Summary Style</p>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-3 rounded-lg border text-left transition-colors
                    ${style === s.id ? 'bg-primary/10 border-primary/40' : 'bg-s3 border-border hover:border-border-2'}`}
                >
                  <p className={`text-sm font-medium ${style === s.id ? 'text-primary' : 'text-t1'}`}>{s.label}</p>
                  <p className="text-t3 text-xs mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-rose text-sm">{error}</p>}

          <button
            onClick={summarize}
            disabled={!content.trim() || loading}
            className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors font-display"
          >
            Summarize
          </button>
        </div>

        {/* Right: Output */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-t2 text-xs font-medium uppercase tracking-wide">Summary</p>
            {summary && (
              <button
                onClick={copy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-s3 border border-border rounded-lg text-t2 hover:text-t1 text-xs transition-colors"
              >
                {copied ? <><CheckCheck size={12} className="text-teal" /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && <LoadingSpinner message="Summarizing..." />}
            {!loading && !summary && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-10 h-10 rounded-xl bg-s3 flex items-center justify-center mb-3">
                  <FileText size={18} className="text-t3" />
                </div>
                <p className="text-t3 text-sm">Your summary will appear here</p>
              </div>
            )}
            {!loading && summary && (
              <div className="animate-fade-in">
                <MarkdownRenderer content={summary} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}