from app.integrations.ai_integrations import AIClient

ai_client = AIClient()

async def summarize_content(content: str) -> str:
    return await ai_client.summarize_text(content)