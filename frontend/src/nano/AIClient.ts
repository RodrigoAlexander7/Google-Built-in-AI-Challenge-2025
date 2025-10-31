'use client';

export async function NanoClient() {
   // Implementation of the nano client creation
   try {
    // Check the API exist on the window global
    const globalAny = (typeof window !== 'undefined') ? (window as any) : undefined;
    const LM = globalAny?.LanguageModel;
    if (!LM) {
      alert("Browser not supported");
      return null;
    }
    // Create client
    const client = await LM.create({ outputLanguage: "es" });

      return client;
   } catch (err) {
      console.error("Error using nanoClient:", err);
      return null
   }
}

// Check if the Nano APIs are available in the browser
export async function isNanoAvailable() {
   try {
      if (typeof window === 'undefined') return false;
      // Prefer explicit Summarizer, otherwise LanguageModel
      // @ts-ignore
      const hasSumm = typeof (window as any).Summarizer !== 'undefined';
      // @ts-ignore
      const hasLM = typeof (window as any).LanguageModel !== 'undefined' || typeof LanguageModel !== 'undefined';
      return Boolean(hasSumm || hasLM);
   } catch {
      return false;
   }
}

/**
 * Try to summarize content using Gemini Nano (browser-local API).
 * If Summarizer.create is available we'll use it, otherwise fall back to LanguageModel.create + prompt.
 * Returns an object shaped like the backend: { summary, references, examples, conclusions }
 */
export type NanoSummarizeOptions = {
  language?: string | undefined;
  language_register?: string | undefined;
  character?: string | undefined;
  extension?: string | undefined;
  include_references?: boolean | undefined;
  include_examples?: boolean | undefined;
  include_conclusions?: boolean | undefined;
};

export async function summarizeWithNano(
  content: string,
  optsOrLanguage: NanoSummarizeOptions | string = 'es',
  onProgress?: (p: number) => void,
  onLog?: (m: string) => void
) {
  const options: NanoSummarizeOptions = typeof optsOrLanguage === 'string' ? { language: optsOrLanguage } : optsOrLanguage;

  try {
    // @ts-ignore
    const globalAny = (typeof window !== 'undefined') ? (window as any) : undefined;

    const log = (m: string) => {
      try { const msg = `[nano] ${new Date().toISOString()} - ${m}`; console.debug(msg); onLog?.(msg); } catch {};
    };
    log('summarizeWithNano start');

    // helper to add timeouts to potentially long operations (model downloads)
    const withTimeout = async <T>(p: Promise<T>, ms: number, label = 'operation') => {
      let t: any = null;
      return await Promise.race([
        p,
        new Promise<T>((_, rej) => {
          t = setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms);
        }),
      ]).finally(() => clearTimeout(t));
    };

    // helper to instrument window.fetch during an operation to capture network activity
    const monitorNetworkDuring = async <T>(fn: () => Promise<T>, label: string) : Promise<T> => {
      const origFetch = (typeof window !== 'undefined' ? (window as any).fetch : undefined);
      const logs: string[] = [];
      const logNet = (m: string) => { try { const msg = `[net:${label}] ${new Date().toISOString()} - ${m}`; console.debug(msg); onLog?.(msg); logs.push(msg); } catch {} };

      if (typeof origFetch === 'function') {
        (window as any).fetch = async function(this: any, input: any, init?: any) {
          try {
            const url = typeof input === 'string' ? input : (input && input.url) || String(input);
            const method = (init && init.method) || 'GET';
            const start = Date.now();
            logNet(`fetch START ${method} ${url}`);
            const resp = await origFetch.apply(this, arguments as any);
            const elapsed = Date.now() - start;
            try { logNet(`fetch DONE ${method} ${url} -> ${resp.status} (${elapsed}ms)`); } catch {}
            return resp;
          } catch (err) {
            logNet(`fetch ERROR ${String(err)}`);
            throw err;
          }
        } as any;
      } else {
        logNet('window.fetch not available to instrument');
      }

      try {
        return await fn();
      } finally {
        // restore
        try { if (typeof origFetch === 'function') (window as any).fetch = origFetch; } catch {}
        logNet('network monitoring finished');
      }
    };

    const buildJsonPrompt = (lang: string | undefined) => {
      const language = lang ?? options.language ?? 'es';
      const language_register = options.language_register ?? 'neutral';
      const character = options.character ?? 'review';
      const extension = options.extension ?? 'medium';
      const include_references = !!options.include_references;
      const include_examples = !!options.include_examples;
      const include_conclusions = !!options.include_conclusions;

      return `You are an expert AI assistant specialized in summarizing documents.\nReturn ONLY valid JSON with the following shape: {"summary": string, "references": string[], "examples": string[], "conclusions": string}.\n\nSettings:\n- language: ${language}\n- language_register: ${language_register}\n- character: ${character}\n- extension: ${extension}\n- include_references: ${include_references}\n- include_examples: ${include_examples}\n- include_conclusions: ${include_conclusions}\n\nContent:\n${content}`;
    };

    // Prefer Summarizer API
    const SummarizerCtor = globalAny?.Summarizer;
    if (SummarizerCtor && typeof SummarizerCtor.create === 'function') {
      log('Found Summarizer API, creating summarizer');
      // create the summarizer but guard with a timeout (e.g., 20s) to avoid hanging the UI indefinitely
      const createPromise = SummarizerCtor.create({
        outputLanguage: options.language ?? 'es',
        monitor(m: any) {
          try {
            m.addEventListener('downloadprogress', (e: any) => {
              const percent = e?.loaded ? Math.round(e.loaded * 100) : undefined;
              if (typeof percent === 'number') {
                log(`downloadprogress ${percent}%`);
                onProgress?.(percent);
              }
            });
            m.addEventListener('state', (s: any) => { log(`monitor state: ${String(s?.type ?? s)}`); });
          } catch (ex) {
            log('monitor hook failed: ' + String(ex));
          }
        },
      });
      let summarizer: any;
      try {
        summarizer = await withTimeout(createPromise, 20000, 'Summarizer.create');
        log('summarizer created successfully');
      } catch (err) {
        log('summarizer.create failed or timed out: ' + String(err));
        throw err;
      }

      log('summarizer created, building prompt');
      const prompt = buildJsonPrompt(options.language);
      log('calling summarizer.summarize (with timeout 120s)');
      const before = Date.now();
      const raw = await withTimeout(
        (typeof summarizer.summarize === 'function' ? summarizer.summarize(prompt) : summarizer.call?.(prompt)),
        120000,
        'summarizer.summarize'
      );
      log(`summarizer returned in ${Date.now() - before}ms`);
      try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        log('parsed summarizer JSON successfully');
        return {
          summary: String(parsed?.summary ?? parsed ?? ''),
          references: Array.isArray(parsed?.references) ? parsed.references : [],
          examples: Array.isArray(parsed?.examples) ? parsed.examples : [],
          conclusions: parsed?.conclusions ?? ''
        };
      } catch (err) {
        log('failed to parse summarizer output as JSON: ' + String(err));
        return { summary: String(raw ?? ''), references: [], examples: [], conclusions: '' };
      }
    }

    // Fallback: LanguageModel session and prompt
    const LM = globalAny?.LanguageModel;
    log(`Fallback LM available? ${Boolean(LM)}`);
    if (LM && typeof LM.create === 'function') {
      log('creating LM session');
      const session: any = await withTimeout((LM.create as any)({ outputLanguage: options.language ?? 'es' }), 20000, 'LM.create');
      const prompt = buildJsonPrompt(options.language);
      if (typeof session.summarize === 'function') {
        log('calling session.summarize');
        const before = Date.now();
        const raw = await session.summarize(prompt);
        log(`session.summarize returned in ${Date.now() - before}ms`);
        try { const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw; log('parsed LM summarize JSON'); return { summary: String(parsed?.summary ?? parsed ?? ''), references: Array.isArray(parsed?.references) ? parsed.references : [], examples: Array.isArray(parsed?.examples) ? parsed.examples : [], conclusions: parsed?.conclusions ?? '' }; } catch (err) { log('failed to parse LM summarize output as JSON: ' + String(err)); return { summary: String(raw ?? ''), references: [], examples: [], conclusions: '' }; }
      }
      if (typeof session.prompt === 'function') {
        log('calling session.prompt');
        const before = Date.now();
        const raw = await session.prompt(prompt);
        log(`session.prompt returned in ${Date.now() - before}ms`);
        try { const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw; log('parsed LM prompt JSON'); return { summary: String(parsed?.summary ?? parsed ?? ''), references: Array.isArray(parsed?.references) ? parsed.references : [], examples: Array.isArray(parsed?.examples) ? parsed.examples : [], conclusions: parsed?.conclusions ?? '' }; } catch (err) { log('failed to parse LM prompt output as JSON: ' + String(err)); return { summary: String(raw ?? ''), references: [], examples: [], conclusions: '' }; }
      }
    }

    throw new Error('No Nano API available in this browser.');
  } catch (err) {
    console.error('summarizeWithNano error:', err);
    onLog?.(`[nano] error ${String(err)}`);
    throw err;
  }
}

