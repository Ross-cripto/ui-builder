import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/core/components/ui/button';
import { Textarea } from '@/core/components/ui/textarea';

interface InputBarProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-6 pb-5 pt-3 border-t border-border bg-background">
      <div className="flex items-end gap-2.5 bg-card border border-input rounded-xl px-4 py-2.5">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the UI component you want to build…"
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none shadow-none resize-none text-foreground text-[15px] leading-relaxed p-0 focus-visible:ring-0 min-h-0 max-h-[200px] overflow-y-auto"
          aria-label="Message input"
        />
        <Button
          type="button"
          size="icon"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="shrink-0 h-9 w-9 rounded-lg"
          aria-label="Send message"
        >
          ↑
        </Button>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground text-center">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
};

export default InputBar;
