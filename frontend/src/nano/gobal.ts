export interface Template {
   content: string;
}

export interface PropType {
   name: 'summarize' | 'generate-exercises' | 'generate-exercises-by-topic' | 'flashcards' | 'flashcards-by-topic' | 'roadmap' | 'games';
}

export interface NanoClientOptions {
   outputLanguage: string; // 'es', 'en'
   type: PropType;
   content: string;
}

export declare const LanguageModel: any;

export interface ExerciseOptions {
   topic: string;
   exercises_difficulty: 'Easy' | 'Medium' | 'Hard';
   exercises_count: number;
   exercises_types: 'multiple-choice' | 'true-false' | 'fill-in-the-blank' | 'short-answer' | 'matching';
}

export interface FlashcardOptions {
   content: string;
   flashcards_count: number;
   difficulty_level: 'easy' | 'medium' | 'hard';
   focus_area: string;
}


// JSON Response Interfaces
export interface ExerciseResponse {
   exercises: Array<{
      question: string;
      options?: string[];
      correct_answer: string;
      explanation: string;
      difficulty: string;
      learning_objective?: string;
   }>;
}

// JSON Response Interfaces
export interface FlashcardResponse {
   flashcards: Array<{
      topic: string;
      subtopic: string;
      question: string;
      answer: string;
      key_terms: string[];
      difficulty: string;
      explanation: string;
      tags: string[];
   }>;
}