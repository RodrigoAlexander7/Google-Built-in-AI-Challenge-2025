from app.integrations.ai_integrations import AIClient

ai_client = AIClient()

async def generate_exercises(content: str, exercises_count: int = 5) -> str:
    return await ai_client.generate_exercises(content, exercises_count)