export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  timestamp?: Date;
  isLoading?: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Settings {
  openaiKey: string;
  sttProvider: string;
  ttsProvider: string;
  searchApiKey: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Automation {
  id: string;
  name: string;
  enabled: boolean;
  type: 'reminder' | 'schedule' | 'trigger';
  config: Record<string, any>;
}
