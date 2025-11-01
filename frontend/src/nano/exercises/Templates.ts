import { ExerciseOptions } from "@/nano/gobal";
import {
   multipleChoiceStructure,
   fillInTheBlankStructure,
   trueFalseStructure,
   shortAnswerStructure,
   matchingStructure
} from "@/nano/exercises/Structures";

export function getExerciseTemplate(exerciseOptions: ExerciseOptions): string {
   let exerciseStructure = "";

   switch (exerciseOptions.exercises_types) {
      case 'multiple-choice':
         exerciseStructure = multipleChoiceStructure;
         break;
      case 'fill-in-the-blank':
         exerciseStructure = fillInTheBlankStructure;
         break;
      case 'true-false':
         exerciseStructure = trueFalseStructure;
         break;
      case 'short-answer':
         exerciseStructure = shortAnswerStructure;
         break;
      case 'matching':
         exerciseStructure = matchingStructure;
         break;
      default:
         exerciseStructure = multipleChoiceStructure;
   }

   return `Generate ${exerciseOptions.exercises_count} exercises in a ${exerciseOptions.exercises_difficulty} difficulty level based on the following content or topic: ${exerciseOptions.topic}.
   Return ONLY valid JSON in the following format:
   ${exerciseStructure}
   Return ONLY valid JSON in the following format:`
}