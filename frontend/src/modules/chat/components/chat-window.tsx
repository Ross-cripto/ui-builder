import React from 'react';
import { Button } from '@/core/components/ui/button';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import MessageList from './message-list';
import InputBar from './input-bar';
import type { Message } from '@/modules/chat/types/chat';

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sessionId: string | null;
  onSend: (content: string) => void;
  onNewChat: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  loading,
  error,
  sessionId,
  onSend,
  onNewChat,
}) => {
  if (!sessionId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 bg-background text-center">
        <div className="text-5xl text-primary">✦</div>
        <p className="text-3xl font-bold text-foreground m-0">Welcome to UI Builder</p>
        <p className="text-base text-muted-foreground m-0 max-w-sm leading-relaxed">
          Start a new chat to generate React components with AI.
        </p>
        <Button size="lg" onClick={onNewChat} className="mt-2">
          Start new chat
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <MessageList messages={messages} loading={loading} />
      {error && (
        <div className="mx-6 mb-2">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <InputBar onSend={onSend} disabled={loading} />
    </div>
  );
};

export default ChatWindow;
