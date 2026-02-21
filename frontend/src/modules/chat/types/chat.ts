export interface CodeBlock {
  language: string;
  filename: string;
  code: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code_blocks: CodeBlock[];
  action: 'ask' | 'generate';
  questions: string[];
  created_at: string;
}

export interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface SessionSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}
