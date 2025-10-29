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
   topic?: string;
   difficulty?: 'Easy' | 'Medium' | 'Hard';
   question: string;
   choices: Array<{
      label: string;
      text: string;
      is_correct: boolean;
   }>;
   explanation?: string;
   learning_objective?: string;
}

export interface ExerciseOptions {
   topic: string;
   difficulty: 'Easy' | 'Medium' | 'Hard';
   count: number;
   exerciseType: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
}