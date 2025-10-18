from app.integrations.ai_templates import exercises_template, summarize_template
from app.integrations.ai_structures import ExerciseSet, Exercise
from app.core.settings import get_settings 
from langchain_google_genai import ChatGoogleGenerativeAI
from typing import List

settings = get_settings()

class AIClient:
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            api_key=settings.GEMINI_API_KEY,
            max_retries=7
        )

    async def summarize_text(self, content: str) -> str:
        instructions = summarize_template()
        chain = instructions | self.model
        result = await chain.ainvoke({"content": content})
        if not result or not hasattr(result, "content"):
            return "No summary could be generated."
        return str(result.content)

    async def generate_exercises(self, content: str, exercises_count: int = 5) -> List[Exercise]:
        instructions = exercises_template()
        structured_llm = self.model.with_structured_output(ExerciseSet)
        chain = instructions | structured_llm
        result = await chain.ainvoke({"content": content, "exercises_count": exercises_count})
        if not result or not hasattr(result, "exercises"):
            return None
        return result.exercises