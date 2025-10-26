from app.core.settings import get_settings 
from langchain_google_genai import ChatGoogleGenerativeAI

settings = get_settings()

class AIClient:
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            api_key=settings.GEMINI_API_KEY,
            max_retries=7
        )
