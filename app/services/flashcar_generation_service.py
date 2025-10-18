from app.integrations.ai_integrations import AIClient

ai_client = AIClient()

async def generate_flashcards(content: str, flashcards_count: int = 5) -> str:
    return await ai_client.generate_flashcards(content, flashcards_count)