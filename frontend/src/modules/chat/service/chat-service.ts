import axios from 'axios';
import type { Session, SessionSummary, Message } from '../types/chat';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const chatService = {
  createSession: () => api.post<Session>('/sessions/'),

  getSessions: () => api.get<SessionSummary[]>('/sessions/'),

  getSession: (id: string) => api.get<Session>(`/sessions/${id}/`),

  deleteSession: (id: string) => api.delete(`/sessions/${id}/`),

  sendMessage: (sessionId: string, content: string) =>
    api.post<Message>(`/sessions/${sessionId}/messages/`, { content }),

  getMessages: (sessionId: string) =>
    api.get<Message[]>(`/sessions/${sessionId}/messages/`),
};
