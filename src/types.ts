export interface MCQ {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  explanation: string;
}

export interface DescriptiveQuestion {
  question: string;
  marks: number;
  introduction: string;
  key_points: string[];
  conclusion: string;
  marks_distribution: string;
}

export interface Material {
  id: number;
  title: string;
  subject: string;
  content: string;
  type: 'notes' | 'mcq' | 'five_mark';
  created_at: string;
}

export interface Score {
  id: number;
  subject: string;
  score: number;
  total: number;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
