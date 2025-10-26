from typing import List, Optional
from pydantic import BaseModel, Field

class Choice(BaseModel):
    text: str = Field(description="The text of the choice")
    is_correct: bool = Field(description="Indicates if this choice is the correct answer")

class Exercise(BaseModel):
    topic: Optional[str] = Field(description="The topic or subject area of the exercise")
    difficulty: Optional[str] = Field(description="Easy, Medium or Hard")
    question: str = Field(description="The question from the exercise")
    choices: Optional[List[Choice]] = Field(description="List of possible choices for multiple-choice questions")
    explanation: Optional[str] = Field(description="Explanation for the correct answer")
    learning_objective: Optional[str] = Field(description="The learning objective of the exercise")

class ExerciseSet(BaseModel):
    exercises: List[Exercise] = Field(description="List of exercises in the set")
