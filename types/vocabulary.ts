// Vocabulary data types and templates
export interface Word {
  id: string;
  german: string;
  english: string;
  example?: string;
  category?: string;
  notes?: string;
  difficulty?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  tags?: string[];
  audioUrl?: string;
  imageUrl?: string;
  lastReviewed?: string;
  reviewCount?: number;
}

export interface CustomList {
  id: string;
  name: string;
  description?: string;
  words: Word[];
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Vocabulary template examples
export const vocabularyTemplates = {
  basicWord: {
    id: '',
    german: '',
    english: '',
    example: '',
    category: '',
    notes: ''
  },
  
  advancedWord: {
    id: '',
    german: '',
    english: '',
    example: '',
    category: '',
    notes: '',
    difficulty: 'A1',
    tags: [],
    audioUrl: '',
    imageUrl: '',
    lastReviewed: '',
    reviewCount: 0
  },
  
  basicList: {
    id: '',
    name: '',
    description: '',
    words: []
  },
  
  advancedList: {
    id: '',
    name: '',
    description: '',
    words: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    isPublic: false
  }
};

// Exercise types and templates
export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'translation' | 'dictation';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  tags?: string[];
  audioUrl?: string;
  imageUrl?: string;
}

export const exerciseTemplates = {
  multipleChoice: {
    id: '',
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'A1',
    tags: []
  },
  
  fillBlank: {
    id: '',
    type: 'fill-blank',
    question: '',
    correctAnswer: '',
    explanation: ''
  },
  
  matching: {
    id: '',
    type: 'matching',
    question: '',
    options: [],
    correctAnswer: []
  }
};

// Video content types
export interface VideoContent {
  id: string;
  title: string;
  description?: string;
  url: string;
  duration: number;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  tags?: string[];
  transcript?: {
    text: string;
    timestamps: {start: number; end: number; text: string}[];
  };
  vocabulary?: Word[];
  exercises?: Exercise[];
}

export const videoContentTemplate = {
  id: '',
  title: '',
  description: '',
  url: '',
  duration: 0,
  level: 'A1',
  tags: [],
  transcript: {
    text: '',
    timestamps: []
  },
  vocabulary: [],
  exercises: []
};