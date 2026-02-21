import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/core/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/core/components/ui/avatar';
import MessageBubble from './message-bubble';
import type { Message } from '@/modules/chat/types/chat';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <div className="text-4xl text-primary">✦</div>
        <p className="m-0 text-2xl font-bold text-foreground">UI Builder</p>
        <p className="m-0 text-[15px] text-muted-foreground max-w-[480px] leading-relaxed">
          Describe any UI component you need — buttons, navbars, forms, cards, modals — and get
          production-ready React code instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0">
    <ScrollArea className="h-full">
      <div className="px-6 pt-6 pb-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex items-start gap-3 mb-5">
            <Avatar className="shrink-0 mt-1 h-9 w-9">
              <AvatarFallback className="bg-secondary text-foreground text-[11px] font-bold">
                AI
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1.5 px-4 py-3.5 bg-card border border-border rounded-xl rounded-tl-sm">
              <span
                className="inline-block w-2 h-2 rounded-full bg-muted-foreground"
                style={{ animation: 'bounce 1.2s infinite' }}
              />
              <span
                className="inline-block w-2 h-2 rounded-full bg-muted-foreground"
                style={{ animation: 'bounce 1.2s infinite', animationDelay: '0.2s' }}
              />
              <span
                className="inline-block w-2 h-2 rounded-full bg-muted-foreground"
                style={{ animation: 'bounce 1.2s infinite', animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
    </div>
  );
};

export default MessageList;
