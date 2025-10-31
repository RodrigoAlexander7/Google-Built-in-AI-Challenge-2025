/**
 * Extract text from a PDF File object in the browser using the locally installed pdfjs-dist package.
 * This avoids depending on CDN downloads and works offline after installing pdfjs-dist.
 *
 * Requires: `npm install pdfjs-dist` (you already ran this).
 */
export async function extractTextFromPdf(file: File, onLog?: (m: string) => void): Promise<string> {
  const log = (m: string) => {
    try { const s = `[pdf] ${new Date().toISOString()} - ${m}`; console.debug(s); onLog?.(s); } catch {}
  };

  if (typeof window === 'undefined') throw new Error('extractTextFromPdf can only run in the browser');

  // Prefer a global `pdfjsLib` if a pre-bundled script is loaded (from /public/pdfjs/pdf.min.js).
  // This avoids importing ESM modules that sometimes fail under the dev bundler.
  log('resolving pdfjs runtime');
  let pdfjs: any = (window as any).pdfjsLib ?? null;

  if (!pdfjs) {
    // Try a dynamic import (works in many setups). If it fails due to ESM/CJS mismatch, we'll fall back to
    // loading a local script from /public/pdfjs/pdf.min.js (you must copy that file from node_modules/pdfjs-dist to public/pdfjs).
    try {
      log('attempting dynamic import of pdfjs-dist');
      let pdfjsModule: any = null;
      try {
        pdfjsModule = await import('pdfjs-dist/legacy/build/pdf');
      } catch (e) {
        // fallback to other known path
        pdfjsModule = await import('pdfjs-dist/build/pdf');
      }
      pdfjs = pdfjsModule && pdfjsModule.default ? pdfjsModule.default : pdfjsModule;
      log('dynamic import of pdfjs-dist succeeded');
    } catch (importErr) {
      log('dynamic import failed: ' + String(importErr));
      // Try loading a local module build via browser dynamic import first. This allows serving
      // modern `.mjs` builds as `/pdfjs/pdf.min.js` while keeping the loader robust.
      const localModule = '/pdfjs/pdf.min.js';
      let localLoaded = false;
      try {
        log('attempting browser dynamic import of ' + localModule);
        // Use browser's module loader to import the served file. This works when the file
        // contains `import.meta` / ESM syntax (pdfjs `.mjs` builds).
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const mod = await import(/* webpackIgnore: true */ localModule);
        // If the module exports the pdfjs object, prefer that; otherwise the module may have
        // attached globals (e.g. window.pdfjsLib). We'll try to use the exported value first.
        pdfjs = mod && (mod.default || mod) || (window as any).pdfjsLib || (window as any).pdfjsDist || null;
        if (pdfjs) {
          log('browser dynamic import of local pdf module succeeded and pdfjs was resolved');
          localLoaded = true;
        } else {
          log('browser dynamic import succeeded but pdfjs was not found on module or window');
        }
      } catch (modErr) {
        log('browser dynamic import of local pdf module failed: ' + String(modErr));
      }

      if (!localLoaded) {
        // Inject local script (expecting developer to provide /public/pdfjs/pdf.min.js) as a
        // non-module fallback. This will work when a UMD/legacy build is present.
        const localSrc = '/pdfjs/pdf.min.js';
        log('injecting script ' + localSrc);
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector(`script[src="${localSrc}"]`);
          if (existing) return resolve();
          const s = document.createElement('script');
          s.src = localSrc;
          s.async = true;
          s.onload = () => { log('local pdf.min.js loaded'); resolve(); };
          s.onerror = (e) => { log('local pdf.min.js failed to load: ' + String(e)); reject(e); };
          document.head.appendChild(s);
        }).catch(async () => {
          // If local injection fails, try CDN as last resort (non-offline)
          const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
          log('local injection failed; falling back to CDN: ' + cdn);
          await new Promise<void>((resolve, reject) => {
            const existing = document.querySelector(`script[src="${cdn}"]`);
            if (existing) return resolve();
            const s = document.createElement('script');
            s.src = cdn;
            s.async = true;
            s.onload = () => { log('cdn pdf.js loaded'); resolve(); };
            s.onerror = (e) => { log('cdn pdf.js failed to load: ' + String(e)); reject(e); };
            document.head.appendChild(s);
          });
        });
      }

      pdfjs = (window as any).pdfjsLib || (window as any).pdfjsDist || null;
      if (!pdfjs) {
        const em = 'pdf.js not available after script injection';
        log(em);
        throw new Error(em);
      }
      // Prefer worker served from /public/pdfjs/pdf.worker.min.js for offline use
      try {
        (pdfjs as any).GlobalWorkerOptions = (pdfjs as any).GlobalWorkerOptions || {};
        (pdfjs as any).GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
        log('set GlobalWorkerOptions.workerSrc to /pdfjs/pdf.worker.min.js');
      } catch (werr) {
        log('failed to set workerSrc: ' + String(werr));
      }
      log('using pdfjs from injected script');
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  log('file arrayBuffer read');

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  log('loading pdf document');
  const pdf = await loadingTask.promise;
  log(`pdf loaded: numPages=${pdf.numPages}`);

  const pages: string[] = [];
  for (let p = 1; p <= (pdf.numPages || 0); p++) {
    try {
      log(`extracting page ${p}/${pdf.numPages}`);
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const strings = content.items.map((itm: any) => (typeof itm.str === 'string' ? itm.str : '')).filter(Boolean);
      pages.push(strings.join(' '));
      log(`extracted page ${p}, chars=${strings.join(' ').length}`);
    } catch (err) {
      const em = `Error extracting page ${p}: ${String(err)}`;
      pages.push(em);
      log(em);
    }
  }

  const out = pages.join('\n\n');
  log(`finished extraction totalChars=${out.length}`);
  return out;
}
