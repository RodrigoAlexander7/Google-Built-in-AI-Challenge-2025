// ExplainItGameTypes.ts

export interface ExplainItProps {
    question?: string;
  }
  
  export interface EvaluationResults {
    points: number;
    errors: string[];
    missing: string[];
    aiResponse: string;
    feedback: string;
  }