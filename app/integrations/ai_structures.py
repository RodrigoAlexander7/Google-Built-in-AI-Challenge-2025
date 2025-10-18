from typing import List, Optional
from pydantic import BaseModel, Field

class Choice(BaseModel):
    text: str = Field(description="The text of the choice")
    is_correct: bool = Field(description="Indicates if this choice is the correct answer")

class Exercise(BaseModel):
    #id: Optional[str] = Field(None, description="Unique identifier for the exercise")
    topic: Optional[str] = Field(description="The topic or subject area of the exercise")
    difficulty: Optional[str] = Field(description="Easy, Medium or Hard")
    #type: str  # e.g. "multiple_choice", "true_false", "open_question", "fill_in_blank"
    question: str = Field(description="The question from the exercise")
    choices: Optional[List[Choice]] = Field(description="List of possible choices for multiple-choice questions")
    #correct_answer: Optional[str] = None  # useful for non-multiple choice
    explanation: Optional[str] = Field(description="Explanation for the correct answer")
    learning_objective: Optional[str] = Field(description="The learning objective of the exercise")
    #references: Optional[List[str]] = None  # page numbers, sections, etc.

class ExerciseSet(BaseModel):
    topic: str = Field(description="The topic or subject area of the exercise set")
    exercises: List[Exercise] = Field(description="List of exercises in the set")