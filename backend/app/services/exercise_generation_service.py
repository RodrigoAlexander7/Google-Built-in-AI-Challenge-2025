from app.integrations.exercises.client import ExercisesAIClient

ai_client = ExercisesAIClient()

async def generate_exercises(content: str, exercises_count: int = 5, exercises_difficulty: str = "medium"):
    return await ai_client.generate_exercises(content, exercises_count, exercises_difficulty)