import React, { useState } from 'react';
import { Code2, Github, Wand2, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { LanguageSelector } from './components/LanguageSelector';
import { CodeEditor } from './components/CodeEditor';
import { LivePreview } from './components/LivePreview';
import { ProgrammingLanguage } from './types';
import { SUGGESTIONS, DEFAULT_CODE_PLACEHOLDER } from './constants';
import { generateCode } from './services/geminiService';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('HTML');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedCode(''); // Clear previous code
    
    try {
      const code = await generateCode(selectedLanguage, prompt);
      setGeneratedCode(code);
    } catch (err) {
      setError("Failed to generate code. Please check your API key and try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text font-sans selection:bg-app-accent/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-app-bg border-b border-app-border flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-app-accent to-purple-800 flex items-center justify-center shadow-lg shadow-purple-900/20">
            <Code2 size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            CodeGenius
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isGenerating ? 'bg-green-500/10 border-green-500/20' : 'bg-app-card border-app-border'}`}>
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className={`text-xs font-medium ${isGenerating ? 'text-green-500' : 'text-gray-500'}`}>
              {isGenerating ? 'Creating Code...' : 'Ready'}
            </span>
          </div>
          <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
            AI Code Generator
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Generate production-ready code in multiple languages.
          </p>
        </div>

        {/* Language Selection */}
        <LanguageSelector 
          selectedLanguage={selectedLanguage} 
          onSelect={setSelectedLanguage} 
        />

        {/* Prompt Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-app-accent font-bold">⚡</span>
            <h3 className="text-sm font-semibold text-app-muted tracking-wider uppercase">Describe What You Want</h3>
          </div>
          
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe the ${selectedLanguage} code you want to generate...`}
              className="w-full h-32 bg-app-card border border-app-border rounded-xl p-4 text-base focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-all resize-none outline-none placeholder:text-gray-600"
            />
            <div className="absolute bottom-4 right-4">
               <div className="w-8 h-8 rounded-full bg-app-accent/20 flex items-center justify-center">
                 <div className="w-4 h-4 text-app-accent">
                   <Code2 size={16} />
                 </div>
               </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-app-accent hover:bg-app-accentHover text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-700/40"
              >
                <Wand2 size={18} />
                <span>Generate Code</span>
              </button>
              
              <button className="p-2.5 bg-app-card border border-app-border text-gray-400 hover:text-white rounded-lg hover:border-gray-500 transition-colors" title="Upload Image (Coming Soon)">
                <ImageIcon size={18} />
              </button>
              
              <button 
                onClick={() => { setPrompt(''); setGeneratedCode(''); }}
                className="p-2.5 bg-app-card border border-app-border text-gray-400 hover:text-white rounded-lg hover:border-gray-500 transition-colors"
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {error && (
              <span className="text-red-400 text-sm animate-pulse">{error}</span>
            )}
          </div>
          
          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="text-sm text-gray-500 mr-2 py-1.5">Suggestions:</span>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1E] border border-app-border/50 hover:border-app-accent/50 hover:bg-app-accent/5 rounded-full text-xs text-gray-400 hover:text-white transition-all whitespace-nowrap"
              >
                <Wand2 size={10} />
                {s.length > 50 ? s.substring(0, 50) + '...' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Editor & Preview Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
               <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Code Editor</h3>
            </div>
            <CodeEditor 
              code={generatedCode} 
              language={selectedLanguage}
              onChange={setGeneratedCode}
            />
          </div>
          
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
               <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Live Preview</h3>
            </div>
            <LivePreview 
              code={generatedCode} 
              language={selectedLanguage}
              onRun={() => console.log('Run triggered')}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-app-border mt-12 py-8 bg-[#0a0a0c]">
        <div className="max-w-[1600px] mx-auto px-6 text-center text-gray-600 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} CodeGenius.</p>
          <div className="flex flex-col gap-1 text-gray-500">
            <p className="font-medium text-gray-400">Built By Vaishnav Mishra, Nikita Malviya, Nidhi Deshpande, Tushar likhitkar</p>
            <p>Guided by Mr. Ashish Gawande Sir</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;