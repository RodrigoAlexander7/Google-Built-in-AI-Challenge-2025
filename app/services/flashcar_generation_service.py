from app.integrations.flashcards.client import FlashcardsAIClient

ai_client = FlashcardsAIClient()

async def generate_flashcards(content: str, flashcards_count: int = 5) -> list:
    return await ai_client.generate_flashcards(content, flashcards_count)