from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from app.core.settings import get_settings 

settings = get_settings()

class AIClient:
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            api_key=settings.GEMINI_API_KEY,
            max_retries=7
        )
        self.prompt = PromptTemplate.from_template("""
        You are an expert AI assistant specialized in summarizing documents.
        Your task is to read the provided content and generate a concise summary that captures the main points and key information.
        Please ensure the summary is clear, coherent, and free of any unnecessary details.
        Content:
        {content}
        """)

    async def summarize_text(self, content: str) -> str:
        chain = self.prompt | self.model
        result = await chain.ainvoke({"content": content})
        if not result or not hasattr(result, "content"):
            return "No summary could be generated."
        return str(result.content)
