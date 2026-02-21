import React from 'react';
import { Button } from '@/core/components/ui/button';
import { ScrollArea } from '@/core/components/ui/scroll-area';
import { Separator } from '@/core/components/ui/separator';
import { cn } from '@/core/lib/utils';
import type { SessionSummary } from '@/modules/chat/types/chat';

interface SidebarProps {
  sessions: SessionSummary[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}) => {
  return (
    <aside
      className="w-[260px] shrink-0 flex flex-col overflow-hidden border-r border-border"
      style={{ backgroundColor: 'var(--sidebar)' }}
      aria-label="Chat sessions"
    >
      <div className="flex items-center justify-between p-4">
        <span className="text-base font-bold text-foreground">✦ UI Builder</span>
        <Button
          size="icon"
          className="h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onNewChat}
          aria-label="Start new chat"
        >
          +
        </Button>
      </div>

      <Separator className="bg-border" />

      <ScrollArea className="flex-1">
        <nav className="p-2">
          {sessions.length === 0 && (
            <p className="text-center text-xs text-muted-foreground px-4 py-4">
              No chats yet. Click + to start.
            </p>
          )}
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                'flex items-center rounded-lg mb-0.5 overflow-hidden',
                session.id === currentSessionId && 'bg-secondary'
              )}
            >
              <button
                type="button"
                onClick={() => onSelectSession(session.id)}
                className="flex-1 min-w-0 text-left px-3 py-2.5 flex flex-col gap-0.5 bg-transparent border-none cursor-pointer"
                title={session.title}
              >
                <span className="text-[13px] font-medium text-foreground truncate block max-w-[170px]">
                  {session.title || 'New Chat'}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(session.updated_at).toLocaleDateString()}
                </span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-7 w-7 mr-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                aria-label={`Delete session: ${session.title}`}
              >
                ×
              </Button>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
