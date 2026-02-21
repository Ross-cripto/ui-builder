import React, { useEffect } from 'react';
import { useChat } from '../hooks/use-chat';
import Sidebar from '../components/sidebar';
import ChatWindow from '../components/chat-window';

export default function ChatPage() {
  const {
    sessions,
    currentSessionId,
    messages,
    loading,
    error,
    loadSessions,
    createSession,
    selectSession,
    deleteSession,
    sendMessage,
  } = useChat();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <>
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={createSession}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
      />
      <ChatWindow
        messages={messages}
        loading={loading}
        error={error}
        sessionId={currentSessionId}
        onSend={sendMessage}
        onNewChat={createSession}
      />
    </>
  );
}
