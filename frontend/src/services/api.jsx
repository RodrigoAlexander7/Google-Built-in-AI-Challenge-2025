// @ts-check

/** @typedef {import('../types/SummaryPromptType').SummaryPromptRequest} SummaryPromptRequest */
/** @typedef {import('../types/SummaryPromptType').SummaryResponse} SummaryResponse */

/**
 * Build FormData for summarize endpoint.
 * @param {SummaryPromptRequest} payload
 */
function buildSummaryFormData(payload) {
  const form = new FormData();

  const files = Array.from(payload.files);
  if (!files.length) {
    throw new Error('Se requiere al menos un archivo PDF en "files".');
  }
  for (const f of files) {
    form.append('files', f, f.name);
  }

  if (payload.character) form.append('character', payload.character);
  if (payload.languaje_register) form.append('languaje_register', payload.languaje_register);
  if (payload.language) form.append('language', payload.language);
  if (payload.extension) form.append('extension', payload.extension);

  if (payload.include_references !== undefined) {
    form.append('include_references', payload.include_references ? 'true' : 'false');
  }
  if (payload.include_examples !== undefined) {
    form.append('include_examples', payload.include_examples ? 'true' : 'false');
  }
  if (payload.include_conclusions !== undefined) {
    form.append('include_conclusions', payload.include_conclusions ? 'true' : 'false');
  }

  return form;
}

/**
 * POST /api/summarize/
 * @param {SummaryPromptRequest} payload
 * @param {{ baseUrl?: string, signal?: AbortSignal }=} options
 * @returns {Promise<SummaryResponse>}
 */
async function summarize(payload, options = {}) {
  const base = options.baseUrl ?? BASE_URL;
  const url = `${base}/api/summarize/`;

  const body = buildSummaryFormData(payload);

  const res = await fetch(url, {
    method: 'POST',
    body,
    // Do not set Content-Type; browser sets proper multipart boundary
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const msg = text || `Error ${res.status} al llamar ${url}`;
    throw new Error(msg);
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return /** @type {any} */ (await res.json());
  }
  // Fallback: return raw text or blob if server doesn't send JSON
  try {
    return /** @type {any} */ (await res.json());
  } catch {
    return /** @type {any} */ (await res.text());
  }
}

export const BASE_URL = 'https://learngo-plum.vercel.app'; // e.g.

export const Api = {
  summarize,
  buildSummaryFormData,
};
