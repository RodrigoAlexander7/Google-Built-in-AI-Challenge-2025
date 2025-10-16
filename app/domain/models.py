from pydantic import BaseModel
from typing import List

class SummaryRequest(BaseModel):
    files: List[str] 

class SummaryResponse(BaseModel):
    summary: str
