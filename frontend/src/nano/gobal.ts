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

// At build time we may not have a real runtime LanguageModel available (this project
// may attach a global LanguageModel at runtime). Previously this file used a
// `declare` which removes the export at runtime and caused imports that expect a
// runtime symbol to fail. Provide a safe runtime export that reads from the
// window global when available.
export const LanguageModel: any = (typeof window !== 'undefined' && (window as any).LanguageModel) ? (window as any).LanguageModel : undefined;

export interface ExerciseOptions {
   topic: string;
   exercises_difficulty: 'Easy' | 'Medium' | 'Hard';
   exercises_count: number;
   exercises_types: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
}