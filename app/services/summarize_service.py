from app.integrations.ai_integrations import AIClient
from app.domain.models import SumamaryOptions

ai_client = AIClient()

async def summarize_content(content: str, options: SumamaryOptions) -> str:
    return await ai_client.summarize_text(content, options)