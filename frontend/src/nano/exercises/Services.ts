'use client'

import { NanoClient } from "@/nano/AIClient"
import { ExerciseOptions } from "@/nano/gobal";
import { getExerciseTemplate } from "./Templates";
import { parseJSONResponse, validateResponseStructure } from "@/nano/utils/ResponseParser";
import { ExerciseResponse } from "@/nano/gobal";

// Type for the expected exercise response structure

export async function generateExercises(exerciseOptions: ExerciseOptions) {
   console.groupCollapsed('[nano][exercises] generateExercises')
   console.log('options:', exerciseOptions)
   const t0 = performance.now()
   try {
      const client = await NanoClient();
      console.log('Nano client ready:', Boolean(client))
      if (!client) {
         console.groupEnd()
         throw new Error("Failed to create NanoClient");
      }

      // Build prompt from template
      const prompt = getExerciseTemplate(exerciseOptions)
      console.log('prompt length:', prompt?.length ?? 0)
      console.log('prompt preview:', typeof prompt === 'string' ? prompt.slice(0, 160) + (prompt.length > 160 ? '…' : '') : '(non-string)')

      // Get raw response from AI
      console.time('[nano][exercises] client.prompt')
      const rawResponse = await client.prompt(prompt);
      console.timeEnd('[nano][exercises] client.prompt')
      console.log('raw response type:', typeof rawResponse)
      if (typeof rawResponse === 'string') {
         console.log('raw response length:', rawResponse.length)
         console.log('raw response preview:', rawResponse.slice(0, 160) + (rawResponse.length > 160 ? '…' : ''))
      }

      // Parse the response (removes markdown formatting if present)
      const parsed: any = parseJSONResponse<any>(rawResponse);

      // Normalize possible variants into ExerciseResponse
      const toArray = (obj: any): any[] => {
         if (Array.isArray(obj)) return obj;
         if (!obj || typeof obj !== 'object') return [];
         const cand = obj.exercises ?? obj.questions ?? obj.items ?? obj.exercise_list ?? obj.data?.exercises ?? obj.data?.questions ?? obj.result?.exercises ?? obj.output?.exercises;
         if (Array.isArray(cand)) return cand;
         // Single-object fallback
         if (obj.question || obj.statement || obj.prompt) return [obj];
         return [];
      };

      const mapChoiceText = (c: any): string => {
         if (c == null) return '';
         if (typeof c === 'string') return c;
         if (typeof c.text === 'string') return c.text;
         if (typeof c.label === 'string') return c.label;
         return String(c);
      };

      const resolveCorrect = (item: any, optionsList: string[]): string => {
         // direct text
         if (typeof item?.correct_answer === 'string') return item.correct_answer;
         if (typeof item?.correctAnswer === 'string') return item.correctAnswer;
         if (typeof item?.answer === 'string') return item.answer;
         // boolean -> True/False
         if (typeof item?.is_true === 'boolean') return item.is_true ? 'True' : 'False';
         // index
         if (typeof item?.correct_index === 'number' && optionsList[item.correct_index]) return optionsList[item.correct_index];
         if (typeof item?.correctIndex === 'number' && optionsList[item.correctIndex]) return optionsList[item.correctIndex];
         // letter A/B/C -> index
         const letter = (item?.correct_option || item?.correctOption || '').toString().trim().toUpperCase();
         if (/^[A-E]$/.test(letter)) {
            const idx = letter.charCodeAt(0) - 'A'.charCodeAt(0);
            if (optionsList[idx]) return optionsList[idx];
         }
         // try to find marked choice
         if (Array.isArray(item?.choices)) {
            const found = item.choices.find((c: any) => c?.is_correct || c?.correct);
            const txt = mapChoiceText(found);
            if (txt) return txt;
         }
         return optionsList[0] ?? '';
      };

      const arr = toArray(parsed);
      console.log('normalized raw items:', arr.length)
      const normalizedList = arr.map((it: any) => {
         const question = it?.question ?? it?.statement ?? it?.prompt ?? it?.title ?? 'Question';
         const choicesArr = Array.isArray(it?.options)
            ? it.options.map(mapChoiceText)
            : Array.isArray(it?.choices)
               ? it.choices.map(mapChoiceText)
               : [];
         const correct_answer = resolveCorrect(it, choicesArr);
         const explanation = it?.explanation ?? it?.rationale ?? it?.reason ?? '';
         const difficulty = (it?.difficulty ?? 'Medium').toString();
         const learning_objective = it?.learning_objective ?? it?.learningObjective ?? undefined;
         return { question, options: choicesArr.length ? choicesArr : undefined, correct_answer, explanation, difficulty, learning_objective };
      });

      const normalized: ExerciseResponse = { exercises: normalizedList };
      const valid = validateResponseStructure<ExerciseResponse>(normalized, ['exercises'])
      console.log('parsed exercises count:', normalizedList.length)
      console.log('structure valid:', valid)
      if (!valid || !Array.isArray(normalized.exercises) || normalized.exercises.length === 0) {
         console.groupEnd()
         throw new Error('Invalid exercise response structure');
      }

      console.log('total time (ms):', Math.round(performance.now() - t0))
      console.groupEnd()
      return normalized;
   } catch (err) {
      console.error('[nano][exercises] generation failed:', err)
      try { console.groupEnd() } catch {}
      throw err
   }
}