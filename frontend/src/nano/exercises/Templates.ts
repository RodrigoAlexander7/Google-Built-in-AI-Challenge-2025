import { ExerciseOptions } from "@/nano/gobal";
import { exerciseStructure } from "@/nano/exercises/Structures";

export function getExerciseTemplate(exerciseOptions: ExerciseOptions): string {
   return `Generate exercises based on the following content or topic: ${exerciseOptions.topic}.
   Return ONLY valid JSON in the following format:
   ${exerciseStructure}
   Return ONLY valid JSON in the following format:`
}