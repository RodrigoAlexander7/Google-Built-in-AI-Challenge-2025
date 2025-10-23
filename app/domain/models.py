from pydantic import BaseModel
from typing import List

class SummaryRequest(BaseModel):
    files: List[str] 

class SummaryResponse(BaseModel):
    summary: str

class SummaryOptions(BaseModel):
    character: str = 'review'
    languaje_register: str = 'formal'
    language: str = 'English'
    extension: str = 'medium'
    include_references: bool = False
    include_examples: bool = False
    include_conclusions: bool = False