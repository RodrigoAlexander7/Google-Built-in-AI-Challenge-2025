'use client';

export async function NanoClient(outputLanguage: 'en' | 'es' | 'ja' = 'en') {
   // Implementation of the nano client creation
   try {
      const lm: any = typeof window !== 'undefined' ? (window as any).LanguageModel : undefined;
      console.groupCollapsed('[nano] NanoClient')
      console.log('outputLanguage:', outputLanguage ?? 'en')
      console.log('LanguageModel available:', typeof lm !== 'undefined')
      // Check the API exists
      if (typeof lm === 'undefined') {
         console.warn('[nano] Browser not supported: window.LanguageModel is undefined')
         alert('Browser not supported');
         console.groupEnd()
         return null;
      }
         // Create client with explicit output language (default: English)
         console.time('[nano] LanguageModel.create')
         const client = await lm.create({ outputLanguage: outputLanguage ?? 'en' });
         console.timeEnd('[nano] LanguageModel.create')
         console.log('Client created:', Boolean(client))
         console.groupEnd()
      return client;
   } catch (err) {
      console.error('[nano] Error using NanoClient:', err);
      try { console.groupEnd() } catch {}
      return null;
   }
}

