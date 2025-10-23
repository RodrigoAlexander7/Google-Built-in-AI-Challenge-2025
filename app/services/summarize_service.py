from app.integrations.ai_integrations import AIClient
from app.domain.models import SummaryOptions

ai_client = AIClient()

async def summarize_content(content: str, options: SummaryOptions) -> str:
    return await ai_client.summarize_text(content, options)