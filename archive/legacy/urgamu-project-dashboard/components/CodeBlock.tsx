import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <div className="flex justify-between items-center bg-slate-800 px-4 py-2">
        <span className="text-xs text-slate-400 uppercase font-semibold">{language}</span>
        <button 
          onClick={handleCopy}
          className="text-xs bg-slate-700 hover:bg-cyan hover:text-navy text-slate-300 font-semibold py-1 px-3 rounded-md transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="text-lighttext">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
