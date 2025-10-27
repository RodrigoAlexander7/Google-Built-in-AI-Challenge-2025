export interface SummaryPromptOptions {
  character?: string;
  languaje_register?: string; // Note: 'languaje' as provided by the API
  language?: string;
  extension?: string;
  include_references?: boolean;
  include_examples?: boolean;
  include_conclusions?: boolean;
}

export interface SummaryPromptRequest extends SummaryPromptOptions {
  files: File[] | FileList;
}

// Optional minimal response type (unknown if not documented)
export type SummaryResponse = unknown;
