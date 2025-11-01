'use client'

import { NanoClient } from "@/nano/AIClient"
import { FlashcardOptions } from "@/nano/gobal";
import { getFlashcardTemplate } from "./Templates";
import { parseJSONResponse, validateResponseStructure } from "@/nano/utils/ResponseParser";
import { FlashcardResponse } from "@/nano/gobal";

export async function generateFlashcards(flashcardOptions: FlashcardOptions) {
   console.groupCollapsed('[nano][flashcards] generateFlashcards')
   console.log('options:', flashcardOptions)
   const t0 = performance.now()
   try {
      const client = await NanoClient();
      console.log('Nano client ready:', Boolean(client))
      if (!client) {
         console.groupEnd()
         throw new Error("Failed to create NanoClient");
      }

      // Build prompt from template
      const prompt = getFlashcardTemplate(flashcardOptions)
      console.log('prompt length:', prompt?.length ?? 0)
      console.log('prompt preview:', typeof prompt === 'string' ? prompt.slice(0, 160) + (prompt.length > 160 ? '…' : '') : '(non-string)')

      // Get raw response from AI
      console.time('[nano][flashcards] client.prompt')
      const rawResponse = await client.prompt(prompt);
      console.timeEnd('[nano][flashcards] client.prompt')
      console.log('raw response type:', typeof rawResponse)
      if (typeof rawResponse === 'string') {
         console.log('raw response length:', rawResponse.length)
         console.log('raw response preview:', rawResponse.slice(0, 160) + (rawResponse.length > 160 ? '…' : ''))
      }

      // Parse and normalize response
      const parsed: any = parseJSONResponse<any>(rawResponse);

      const toArray = (obj: any): any[] => {
         if (Array.isArray(obj)) return obj;
         if (!obj || typeof obj !== 'object') return [];
         const cand = obj.flashcards ?? obj.cards ?? obj.items ?? obj.data?.flashcards ?? obj.result?.flashcards ?? obj.output?.flashcards;
         if (Array.isArray(cand)) return cand;
         // Single-card fallback
         if (obj?.question || obj?.front || obj?.term) return [obj];
         return [];
      };

      const toArrayOfStrings = (v: any): string[] => {
         if (!v) return [];
         if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : (x?.text ?? x?.label ?? String(x))));
         if (typeof v === 'string') return v.split(/[;,\n]/).map(s => s.trim()).filter(Boolean);
         return [];
      };

      const arr = toArray(parsed);
      console.log('normalized raw cards:', arr.length)

      const normalizedList = arr.map((it: any) => {
         const topic = it?.topic ?? flashcardOptions.focus_area ?? (typeof flashcardOptions.content === 'string' ? flashcardOptions.content.split(/\.|\n|\-/)[0]?.trim() : 'General');
         const subtopic = it?.subtopic ?? '';
         const question = it?.question ?? it?.front ?? it?.term ?? it?.prompt ?? 'Question';
         const answer = it?.answer ?? it?.back ?? it?.definition ?? it?.explanation ?? '';
         const key_terms = toArrayOfStrings(it?.key_terms ?? it?.keywords ?? it?.keyTerms);
         const difficulty = (it?.difficulty ?? flashcardOptions.difficulty_level ?? 'medium').toString();
         const explanation = it?.explanation ?? it?.rationale ?? it?.notes ?? '';
         const tags = toArrayOfStrings(it?.tags ?? it?.labels ?? it?.categories ?? it?.keywords);
         return { topic, subtopic, question, answer, key_terms, difficulty, explanation, tags };
      });

      const normalized: FlashcardResponse = { flashcards: normalizedList };
      const valid = validateResponseStructure<FlashcardResponse>(normalized, ['flashcards'])
      console.log('parsed flashcards count:', normalizedList.length)
      console.log('structure valid:', valid)
      if (!valid || !Array.isArray(normalized.flashcards) || normalized.flashcards.length === 0) {
         console.groupEnd()
         throw new Error('Invalid flashcard response structure');
      }

      console.log('total time (ms):', Math.round(performance.now() - t0))
      console.groupEnd()
      return normalized;
   } catch (err) {
      console.error('[nano][flashcards] generation failed:', err)
      try { console.groupEnd() } catch {}
      throw err
   }
}