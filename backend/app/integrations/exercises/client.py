from typing import List
from app.integrations.exercises.templates import exercises_template
from app.integrations.exercises.structures import ExerciseSet, Exercise
from app.integrations.ai_client import AIClient

class ExercisesAIClient(AIClient):
    async def generate_exercises(self, content: str, exercises_count: int = 5, exercises_difficulty: str = "medium") -> List[Exercise]:
        instructions = exercises_template()
        structured_llm = self.model.with_structured_output(ExerciseSet)
        chain = instructions | structured_llm
        result = await chain.ainvoke({"content": content, "exercises_count": exercises_count, "exercises_difficulty": exercises_difficulty})
        if result:
            return result.exercises
        return []
