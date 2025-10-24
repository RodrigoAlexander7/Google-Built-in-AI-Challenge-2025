from typing import List
from app.integrations.flashcards.templates import flashcards_template
from app.integrations.flashcards.structures import FlashCardSet, FlashCard
from app.integrations.ai_client import AIClient

class FlashcardsAIClient(AIClient):
    async def generate_flashcards(self, content: str, flashcards_count: int = 5) -> List[FlashCard]:
        instructions = flashcards_template()
        structured_llm = self.model.with_structured_output(FlashCardSet)
        chain = instructions | structured_llm
        result = await chain.ainvoke({"content": content, "flashcards_count": flashcards_count})
        if result:
            return result.flashcards
        return []
