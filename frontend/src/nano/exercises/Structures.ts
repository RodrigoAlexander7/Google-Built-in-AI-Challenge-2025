export const multipleChoiceStructure = `[
   {
     "topic": "string (optional, e.g. 'Mathematics')",
     "difficulty": "string (optional, one of: Easy, Medium, Hard)",
     "question": "string (the exercise question)",
     "choices": [
       { "label": "A", "text": "string", "is_correct": true/false },
       { "label": "B", "text": "string", "is_correct": true/false }
     ],
     "explanation": "string (optional, why the answer is correct)",
     "learning_objective": "string (optional, the learning objective tested)"
   }
 ]`

export const fillInTheBlankStructure = `[
   {
     "topic": "string (optional, e.g. 'Mathematics')",
     "difficulty": "string (optional, one of: Easy, Medium, Hard)",
     "question": "string (the question with a blank space, e.g., 'The capital of France is __.')",
     "answer": "string (the correct answer text)",
     "explanation": "string (optional, why the answer is correct)",
     "learning_objective": "string (optional, the learning objective tested)"
   }
 ]`

export const trueFalseStructure = `[
   {
     "topic": "string (optional, e.g. 'Mathematics')",
     "difficulty": "string (optional, one of: Easy, Medium, Hard)",
     "statement": "string (the statement to be evaluated)",
     "is_true": "boolean (true/false)",
     "explanation": "string (optional, why the statement is true or false)",
     "learning_objective": "string (optional, the learning objective tested)"
   }
 ]`

export const shortAnswerStructure = `[
   {
     "topic": "string (optional, e.g. 'Mathematics')",
     "difficulty": "string (optional, one of: Easy, Medium, Hard)",
     "question": "string (the exercise question)",
     "answer": "string (the ideal or correct short answer)",
     "explanation": "string (optional, why the answer is correct)",
     "learning_objective": "string (optional, the learning objective tested)"
   }
 ]`

export const matchingStructure = `[
   {
     "topic": "string (optional, e.g. 'Mathematics')",
     "difficulty": "string (optional, one of: Easy, Medium, Hard)",
     "instructions": "string (e.g., 'Match the concepts with their definitions.')",
     "premises": ["string (Column A: items to be matched)"],
     "responses": ["string (Column B: matching options)"],
     "correct_matches": {
       "premise_item": "response_item"
     },
     "explanation": "string (optional, general explanation of the correct matches)",
     "learning_objective": "string (optional, the learning objective tested)"
   }
 ]`