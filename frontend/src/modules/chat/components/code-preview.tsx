import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/core/components/ui/button';
import type { CodeBlock } from '@/modules/chat/types/chat';

interface CodePreviewProps {
  block: CodeBlock;
}

const CodePreview: React.FC<CodePreviewProps> = ({ block }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border mt-3 mb-1">
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <span className="text-[13px] text-muted-foreground font-mono">{block.filename}</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="h-7 text-xs"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </Button>
      </div>
      <SyntaxHighlighter
        language={block.language}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '14px' }}
        showLineNumbers
        wrapLongLines
      >
        {block.code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodePreview;
