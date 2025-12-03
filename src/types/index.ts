export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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
