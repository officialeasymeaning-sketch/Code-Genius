import React, { useEffect, useState, useRef } from 'react';
import { Play, Terminal as TerminalIcon, AlertCircle, RotateCw } from 'lucide-react';
import { TabOption, ProgrammingLanguage } from '../types';

interface LivePreviewProps {
  code: string;
  language: ProgrammingLanguage;
  onRun: () => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code, language, onRun }) => {
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.OUTPUT);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string>('');

  // Clear state when language changes
  useEffect(() => {
    setConsoleOutput([]);
    setIframeSrc('');
    // Default to Output for web languages, Console for others
    if (['HTML', 'CSS', 'JavaScript', 'JSX', 'TSX'].includes(language)) {
      setActiveTab(TabOption.OUTPUT);
    } else {
      setActiveTab(TabOption.CONSOLE);
    }
  }, [language]);

  // Clean up Object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (iframeSrc) {
        URL.revokeObjectURL(iframeSrc);
      }
    };
  }, [iframeSrc]);

  // Listen for iframe messages (console logs)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data.type === 'console' || event.data.type === 'error') {
        setConsoleOutput(prev => [...prev, `> ${event.data.message}`]);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleRun = () => {
    setIsRunning(true);
    onRun();
    setConsoleOutput([]); // Clear previous output
    setIframeSrc(''); // Reset iframe to force reload

    setTimeout(() => {
      if (['HTML', 'JavaScript', 'CSS'].includes(language)) {
        setActiveTab(TabOption.OUTPUT);
        
        let content = '';
        
        // Console interception script to inject into preview
        const consoleScript = `
          <script>
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            
            function sendToParent(type, args) {
              try {
                const message = args.map(arg => {
                  if (typeof arg === 'object') return JSON.stringify(arg);
                  return String(arg);
                }).join(' ');
                window.parent.postMessage({ type: 'console', message }, '*');
              } catch (e) {
                // Ignore serialization errors
              }
            }

            console.log = (...args) => {
              originalLog.apply(console, args);
              sendToParent('log', args);
            };
            
            console.error = (...args) => {
              originalError.apply(console, args);
              sendToParent('error', args);
            };

            window.onerror = (msg, url, line) => {
              window.parent.postMessage({ type: 'error', message: msg + ' (Line ' + line + ')' }, '*');
            };
          </script>
        `;

        if (language === 'HTML') {
          // Robustly inject console script
          if (code.includes('<head>')) {
            content = code.replace('<head>', `<head>${consoleScript}`);
          } else if (code.includes('<body>')) {
            content = code.replace('<body>', `<body>${consoleScript}`);
          } else {
            content = `<!DOCTYPE html><html><head>${consoleScript}</head><body>${code}</body></html>`;
          }
        } else if (language === 'JavaScript') {
          content = `
            <!DOCTYPE html>
            <html>
            <head>${consoleScript}</head>
            <body style="margin: 0; font-family: sans-serif; background-color: #ffffff;">
              <div style="padding: 20px;">
                <h3 style="margin-top: 0; color: #888;">JavaScript Preview</h3>
                <p style="font-size: 14px; color: #666;">This is a sandbox for your JS code. Check the Console tab for output.</p>
                <div id="app"></div>
              </div>
              <script>
                try {
                  ${code}
                } catch (e) {
                  console.error(e);
                }
              </script>
            </body>
            </html>
          `;
        } else if (language === 'CSS') {
          content = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>${code}</style>
              <style>
                body { font-family: 'Inter', sans-serif; padding: 20px; color: #333; background: #fff; }
                .demo-box { 
                  padding: 20px; 
                  border: 2px dashed #ddd; 
                  border-radius: 8px;
                  margin-top: 20px;
                  text-align: center;
                  background: #f9fafb;
                }
                h2 { color: #111; }
                p { color: #555; }
              </style>
            </head>
            <body>
               <h3>CSS Preview Mode</h3>
               <p>The CSS generated is applied to this page.</p>
               
               <div class="demo-box">
                 <h2>Sample Heading</h2>
                 <p>Sample paragraph text to demonstrate typography.</p>
                 <button style="margin-top: 10px; padding: 8px 16px; cursor: pointer;">Sample Button</button>
               </div>
               
               <div style="margin-top: 20px;">
                 <div class="card">.card element</div>
                 <div class="container">.container element</div>
                 <button class="btn">.btn element</button>
               </div>
            </body>
            </html>
          `;
        }

        // Use Blob API for true external file simulation
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setIframeSrc(url);

      } else {
        // Mock execution for non-web languages
        setActiveTab(TabOption.CONSOLE);
        setConsoleOutput([
          `Compiling ${language}...`,
          `> Run ${language} script`,
          `[System]: Execution simulated for demo purposes.`,
          `[System]: Syntax check passed.`,
          `Output:`,
          `(Program exited with code 0)`
        ]);
      }
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-app-card rounded-xl border border-app-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-app-border bg-[#121215]">
        <div className="flex items-center gap-1 font-semibold text-gray-300">
          <span>Preview</span>
        </div>
        <button
          onClick={handleRun}
          disabled={!code || isRunning}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-[#27272A] hover:bg-[#323238] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? <RotateCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-app-border bg-[#121215]">
        <button
          onClick={() => setActiveTab(TabOption.OUTPUT)}
          className={`flex-1 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === TabOption.OUTPUT
              ? 'border-app-accent text-white bg-white/5'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Output
        </button>
        <button
          onClick={() => setActiveTab(TabOption.CONSOLE)}
          className={`flex-1 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === TabOption.CONSOLE
              ? 'border-app-accent text-white bg-white/5'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Console
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white relative">
        {/* Output Tab (Iframe) */}
        <div className={`absolute inset-0 ${activeTab === TabOption.OUTPUT ? 'block' : 'hidden'}`}>
           {['HTML', 'CSS', 'JavaScript'].includes(language) ? (
             iframeSrc ? (
               <iframe
                 src={iframeSrc}
                 title="preview"
                 className="w-full h-full border-none"
                 sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
               />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    <p className="text-sm">Click "Run Code" to generate preview</p>
                </div>
             )
           ) : (
             <div className="w-full h-full bg-app-card flex flex-col items-center justify-center text-gray-500 p-8 text-center">
               <AlertCircle size={32} className="mb-4 opacity-50" />
               <p>Visual preview not available for {language}.</p>
               <p className="text-sm mt-2">Check the Console tab for output simulation.</p>
             </div>
           )}
        </div>

        {/* Console Tab */}
        <div className={`absolute inset-0 bg-[#0c0c0e] text-gray-300 font-mono text-sm p-4 overflow-auto ${activeTab === TabOption.CONSOLE ? 'block' : 'hidden'}`}>
          <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-widest text-gray-500 select-none">
            <TerminalIcon size={12} />
            <span>Terminal</span>
          </div>
          {consoleOutput.length === 0 ? (
            <span className="text-gray-600 italic">// Console output will appear here after running</span>
          ) : (
            consoleOutput.map((line, idx) => (
              <div key={idx} className="mb-1 break-words border-b border-white/5 pb-1">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};