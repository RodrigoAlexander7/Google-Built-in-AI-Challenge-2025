from app.domain.models import SummaryOptions
from app.integrations.ai_templates import exercises_template, summarize_template, flashcards_template
from app.integrations.ai_structures import ExerciseSet, Exercise, FlashCardSet, FlashCard, Summary
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

    async def summarize_text(self, content: str, options: SummaryOptions) -> str:
        instructions = summarize_template()
        structured_llm = self.model.with_structured_output(Summary)
        chain = instructions | structured_llm
        result = await chain.ainvoke({
            "content": content,
            "character": options.character,
            "languaje_register": options.languaje_register,
            "language": options.language,
            "extension": options.extension,
            "include_references": options.include_references,
            "include_examples": options.include_examples,
            "include_conclusions": options.include_conclusions
        })

        #if not result or not hasattr(result, "content"):
        if not result:
            return "No summary could be generated."
        return result.model_dump()

    async def generate_exercises(self, content: str, exercises_count: int = 5) -> List[Exercise]:
        instructions = exercises_template()
        structured_llm = self.model.with_structured_output(ExerciseSet)
        chain = instructions | structured_llm
        result = await chain.ainvoke({"content": content, "exercises_count": exercises_count})
        if result: return result.exercises
        return []

    async def generate_flashcards(self, content: str, flashcards_count: int = 5) -> List[FlashCard]:
        instructions = flashcards_template()
        structured_llm = self.model.with_structured_output(FlashCardSet)
        chain = instructions | structured_llm
        result = await chain.ainvoke({"content": content, "flashcards_count": flashcards_count})
        if result: return result.flashcards
        return []