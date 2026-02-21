import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback } from '@/core/components/ui/avatar';
import { cn } from '@/core/lib/utils';
import CodePreview from './code-preview';
import type { Message } from '@/modules/chat/types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Strip fenced code blocks from prose so we render them via CodePreview
  const prose = message.content
    .replace(/```[\w]*\n(?:\/\/ filename: \S+\n)?[\s\S]*?```/g, '')
    .trim();

  return (
    <div className={cn('flex items-start gap-3 mb-5', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="shrink-0 mt-1 h-9 w-9">
          <AvatarFallback className="bg-secondary text-foreground text-[11px] font-bold">
            AI
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-xl px-4 py-3 break-words',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card text-card-foreground border border-border rounded-tl-sm'
        )}
      >
        {isUser ? (
          <p className="m-0 text-[15px] leading-relaxed">{message.content}</p>
        ) : (
          <>
            {prose && (
              <div className="prose text-[15px] leading-relaxed">
                <ReactMarkdown>{prose}</ReactMarkdown>
              </div>
            )}
            {message.code_blocks.map((block, i) => (
              <CodePreview key={i} block={block} />
            ))}
          </>
        )}
      </div>

      {isUser && (
        <Avatar className="shrink-0 mt-1 h-9 w-9">
          <AvatarFallback className="bg-secondary text-foreground text-[11px] font-bold">
            You
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
