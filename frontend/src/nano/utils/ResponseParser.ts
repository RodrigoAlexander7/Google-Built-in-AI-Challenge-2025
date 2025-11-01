// Utility functions to parse AI responses that may contain markdown formatting

/**
 * Removes markdown code block formatting from a string
 * Handles cases like:
 * ```json
 * { ... }
 * ```
 * or just plain JSON strings
 */

export function parseJSONResponse<T>(response: string): T {
   try {
      // Remove markdown code blocks if present
      let cleanedResponse = response.trim();

      // Check if response is wrapped in markdown code blocks
      const markdownRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/;
      const match = cleanedResponse.match(markdownRegex);

      if (match) {
         cleanedResponse = match[1].trim();
      }

      // Remove any leading/trailing whitespace
      cleanedResponse = cleanedResponse.trim();

      // Parse the JSON
      return JSON.parse(cleanedResponse) as T;
   } catch (error) {
      console.error('Failed to parse JSON response:', error);
      console.error('Original response:', response);
      throw new Error('Invalid JSON response from AI');
   }
}

/**
 * Validates that the parsed response has the expected structure
 */
export function validateResponseStructure<T>(
   data: unknown,
   requiredFields: string[]
): data is T {
   if (!data || typeof data !== 'object') {
      return false;
   }

   return requiredFields.every(field => field in data);
}