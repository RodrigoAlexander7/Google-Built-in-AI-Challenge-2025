from typing import List
from app.integrations.flashcards.templates import flashcards_template
from app.integrations.flashcards.structures import FlashCardSet, FlashCard
from app.integrations.ai_client import AIClient
from app.domain.models import FlashcardRequest

class FlashcardsAIClient(AIClient):
    async def generate_flashcards(self, flashcard_request: FlashcardRequest) -> List[FlashCard]:
        instructions = flashcards_template()

        # the result follow the model structure from FlashCardSet
        structured_llm = self.model.with_structured_output(FlashCardSet)
        chain = instructions | structured_llm
        result = await chain.ainvoke({
            "content": flashcard_request.content,
            "flashcards_count": flashcard_request.flashcards_count,
            "difficulty_level": flashcard_request.difficulty_level,
            "focus_area": flashcard_request.focus_area
        })
        if result:
            return result.flashcards
        return []
