import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Paperclip, Trash2, Bot, User, X } from 'lucide-react';
import { chatAPI } from '../api';
import PageHeader from '../components/PageHeader';
import PDFUpload from '../components/PDFUpload';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Lumina, your AI study buddy. Ask me anything, or upload a PDF so I can answer questions specifically from your notes.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');
  const [contextName, setContextName] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const bottomRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAPI.send(newMessages, context);
      setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat cleared. How can I help you?' }]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 border-b border-border bg-surface flex-shrink-0">
        <div className="flex items-center justify-between">
          <PageHeader
            icon={MessageSquare}
            title="AI Chat"
            subtitle="Ask anything — context-aware when you upload a PDF"
            accent="blue"
          />
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                ${context ? 'bg-teal/10 border-teal/30 text-teal' : 'bg-s3 border-border text-t2 hover:text-t1'}`}
            >
              <Paperclip size={13} />
              {context ? contextName || 'PDF loaded' : 'Upload PDF'}
            </button>
            {context && (
              <button onClick={() => { setContext(''); setContextName(''); }} className="text-t3 hover:text-rose transition-colors">
                <X size={15} />
              </button>
            )}
            <button onClick={clearChat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-s3 border border-border text-t2 hover:text-rose text-xs transition-colors">
              <Trash2 size={13} />
              Clear
            </button>
          </div>
        </div>

        {showUpload && (
          <div className="mb-4 animate-slide-up">
            <PDFUpload
              compact
              onExtracted={(text, name) => {
                setContext(text);
                setContextName(name);
                if (text) setShowUpload(false);
              }}
            />
          </div>
        )}

        {context && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-teal/5 border border-teal/20 rounded-lg text-xs text-teal">
            <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
            Context loaded from <strong className="font-medium">{contextName}</strong> — responses will be grounded in this document.
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
              ${msg.role === 'user' ? 'bg-primary/15 text-primary' : 'bg-s3 text-t2'}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-primary/15 text-t1 rounded-tr-sm'
                : 'bg-s2 border border-border text-t1 rounded-tl-sm'}`}
            >
              {msg.role === 'assistant' ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-s3 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-t2" />
            </div>
            <div className="px-4 py-3 bg-s2 border border-border rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-1.5 h-1.5 rounded-full bg-t3 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-t3 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-t3 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-8 pb-6 pt-3 border-t border-border bg-surface">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Ask a question... (Shift+Enter for new line)"
            className="flex-1 resize-none bg-s2 border border-border hover:border-border-2 focus:border-primary text-t1 placeholder-t3 text-sm px-4 py-3 rounded-xl outline-none transition-colors min-h-[46px] max-h-36 leading-relaxed"
            style={{ height: 'auto', overflowY: input.split('\n').length > 4 ? 'auto' : 'hidden' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 144) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-11 h-11 flex items-center justify-center bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}