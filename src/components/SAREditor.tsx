import { useState } from 'react';

interface SAREditorProps {
  initialContent: string;
  aiConfidence: number;
  onContentChange: (content: string) => void;
}

export default function SAREditor({ initialContent, aiConfidence, onContentChange }: SAREditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaved, setIsSaved] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsSaved(false);
    onContentChange(newContent);
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">AI Generated Draft (Editable)</h3>
          <p className="text-sm text-slate-400 mt-1">Review and edit the AI-generated SAR report</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-300">AI Confidence</p>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    aiConfidence >= 80
                      ? 'bg-green-500'
                      : aiConfidence >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${aiConfidence}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-300">{aiConfidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleChange}
        className="w-full h-96 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        placeholder="SAR content will appear here..."
      />

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex gap-4 text-sm text-slate-400">
          <span>Words: {wordCount}</span>
          <span>Characters: {content.length}</span>
        </div>
        <div className="flex items-center gap-2">
          {!isSaved && (
            <span className="text-xs text-yellow-400">
              ● Unsaved changes
            </span>
          )}
          {isSaved && (
            <span className="text-xs text-green-400">
              ✓ Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              isSaved
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'btn-secondary'
            }`}
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}
