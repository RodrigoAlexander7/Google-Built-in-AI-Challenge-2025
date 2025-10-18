from fastapi import APIRouter, File, UploadFile
from typing import List
from app.services.flashcar_generation_service import generate_flashcards
from app.infrastructure.files.file_manager import extract_file_contents

router = APIRouter(prefix="/flashcard", tags=["Flashcards"])

@router.post("/", response_model=dict)
async def flashcard(
    files: List[UploadFile] = File(default=[], description="Files to be summarized"),
    flashcards_count: int = 5,
):
    # Content extraction
    data = await extract_file_contents(files)
    joined_content = "\n\n".join("\n\n".join(page for page in file_content) for file_content in data)

    # Flashcard Generation
    flashcards = await generate_flashcards(joined_content, flashcards_count)

    return {"flashcards": flashcards}