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
    #topic: str = Field(description="The topic or subject area of the exercise set")
    exercises: List[Exercise] = Field(description="List of exercises in the set")

class FlashCard(BaseModel):
    #id: Optional[str] = Field(None, description="Unique identifier for the flashcard.")
    topic: str = Field(description="Main topic or subject this flashcard belongs to.")
    subtopic: Optional[str] = Field(None, description="Optional subtopic or section of the document.")
    
    question: str = Field(description="Question or prompt for the flashcard.")
    answer: str = Field(description="Main answer text for the flashcard.")
    
    key_terms: List[str] = Field(default_factory=list, description="Important terms or keywords relevant to the question.")
    difficulty: Optional[str] = Field(description="Difficulty level: easy, medium, or hard.")
    #source_reference: Optional[str] = Field(None, description="Section or page of the document where the information was found.")
    
    explanation: Optional[str] = Field(description="Expanded explanation or context behind the answer.")
    example: Optional[str] = Field(description="Optional example that illustrates the concept.")
    
    tags: List[str] = Field(default_factory=list, description="Tags or categories to help organize the flashcard.")

class FlashCardSet(BaseModel):
    #topic: str = Field(..., description="The main topic or subject of the flashcard set.")
    flashcards: List[FlashCard] = Field(description="List of flashcards in this set.")