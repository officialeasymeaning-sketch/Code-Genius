import React from 'react';
import { Copy, Check } from 'lucide-react';
import { ProgrammingLanguage } from '../types';

interface CodeEditorProps {
  code: string;
  language: ProgrammingLanguage;
  onChange: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-app-card rounded-xl border border-app-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-app-border bg-[#121215]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-sm font-medium text-gray-300 uppercase">{language}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 group">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-app-card text-gray-300 font-mono text-sm resize-none focus:outline-none leading-6 selection:bg-app-accent/30"
          placeholder="// Generated code will appear here..."
        />
        
        {code.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 pointer-events-none">
            <span className="text-4xl font-light mb-4 opacity-20">{'< >'}</span>
            <p className="text-sm opacity-50">Generated code will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};
