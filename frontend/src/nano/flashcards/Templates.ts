import { FlashcardOptions } from "@/nano/gobal";
import { flashcardStructure } from "@/nano/flashcards/Structures";

export function getFlashcardTemplate(flashcardOptions: FlashcardOptions): string {
   return `You are an expert educator and instructional designer.
   Your task is to generate ${flashcardOptions.flashcards_count} high-quality flashcards from a given document, text or topic.
   The difficulty level of the flashcards is ${flashcardOptions.difficulty_level}.
   The flashcards should focus on ${flashcardOptions.focus_area}.

   This is the document content or topic:
   ${flashcardOptions.content}

   Return ONLY valid JSON in the following format:
   ${flashcardStructure}
   Return ONLY valid JSON in the following format:`
}
