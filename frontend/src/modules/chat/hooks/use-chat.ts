import { useState, useCallback } from "react";
import { chatService } from "../service/chat-service";
import type { Message, SessionSummary } from "../types/chat";

export function useChat() {
	const [sessions, setSessions] = useState<SessionSummary[]>([]);
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadSessions = useCallback(async () => {
		try {
			const { data } = await chatService.getSessions();
			setSessions(data);
		} catch {
			setError("Failed to load sessions.");
		}
	}, []);

	const createSession = useCallback(async () => {
		try {
			const { data } = await chatService.createSession();
			setSessions((prev) => [data, ...prev]);
			setCurrentSessionId(data.id);
			setMessages([]);
			setError(null);
			return data.id;
		} catch {
			setError("Failed to create session.");
		}
	}, []);

	const selectSession = useCallback(async (sessionId: string) => {
		setCurrentSessionId(sessionId);
		setError(null);
		try {
			const { data } = await chatService.getSession(sessionId);
			setMessages(data.messages);
		} catch {
			setError("Failed to load messages.");
		}
	}, []);

	const deleteSession = useCallback(
		async (sessionId: string) => {
			try {
				await chatService.deleteSession(sessionId);
				setSessions((prev) => prev.filter((s) => s.id !== sessionId));
				if (currentSessionId === sessionId) {
					setCurrentSessionId(null);
					setMessages([]);
				}
			} catch {
				setError("Failed to delete session.");
			}
		},
		[currentSessionId],
	);

	const sendMessage = useCallback(
		async (content: string) => {
			if (!currentSessionId || !content.trim()) return;

			// Optimistic user message
			const optimisticUserMsg: Message = {
				id: `temp-${Date.now()}`,
				role: "user",
				content,
				code_blocks: [],
				action: "generate",
				questions: [],
				created_at: new Date().toISOString(),
			};

			setMessages((prev) => [...prev, optimisticUserMsg]);
			setLoading(true);
			setError(null);

			try {
				const { data: assistantMsg } = await chatService.sendMessage(
					currentSessionId,
					content,
				);

				setMessages((prev) => [...prev, assistantMsg]);

				// Update session title in sidebar if it changed
				setSessions((prev) =>
					prev.map((s) =>
						s.id === currentSessionId
							? { ...s, title: content.slice(0, 60) }
							: s,
					),
				);
			} catch {
				setError("Something went wrong. Please try again.");
				// Remove the optimistic message on failure
				setMessages((prev) =>
					prev.filter((m) => m.id !== optimisticUserMsg.id),
				);
			} finally {
				setLoading(false);
			}
		},
		[currentSessionId],
	);

	return {
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
	};
}
