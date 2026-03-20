import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { uploadAPI } from '../api';

export default function PDFUpload({ onExtracted, compact = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await uploadAPI.pdf(file);
      setFileInfo({ name: file.name, pages: res.data.pages, chars: res.data.characters });
      onExtracted(res.data.text, file.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div>
      {fileInfo ? (
        <div className="flex items-center gap-3 p-3 bg-teal/5 border border-teal/20 rounded-xl">
          <CheckCircle size={16} className="text-teal flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-t1 text-sm font-medium truncate">{fileInfo.name}</p>
            <p className="text-t3 text-xs">{fileInfo.pages} pages · {(fileInfo.chars / 1000).toFixed(1)}k characters extracted</p>
          </div>
          <button
            onClick={() => { setFileInfo(null); onExtracted('', ''); }}
            className="text-t3 hover:text-rose transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
            ${compact ? 'py-4' : 'py-8'}
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-border-2 hover:bg-s3'}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-t2 text-sm">Extracting text...</p>
            </div>
          ) : (
            <>
              <div className="w-9 h-9 rounded-lg bg-s3 flex items-center justify-center">
                {isDragging ? <Upload size={16} className="text-primary" /> : <FileText size={16} className="text-t2" />}
              </div>
              <div className="text-center">
                <p className="text-t1 text-sm font-medium">Upload PDF</p>
                <p className="text-t3 text-xs mt-0.5">Drag & drop or click to browse</p>
              </div>
            </>
          )}
        </div>
      )}
      {error && <p className="text-rose text-xs mt-2">{error}</p>}
    </div>
  );
}