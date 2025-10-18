from fastapi import APIRouter, File, UploadFile
from typing import List
from app.services.exercise_generation_service import generate_exercises
from app.infrastructure.files.file_manager import extract_file_contents

router = APIRouter(prefix="/generate-exercises", tags=["Generate Exercises"])

@router.post("/", response_model=dict)
async def exercises(
    files: List[UploadFile] = File(default=[], description="Files to be summarized"),
    exercises_count: int = 5,
):
    # Content extraction
    data = await extract_file_contents(files)
    joined_content = "\n\n".join("\n\n".join(page for page in file_content) for file_content in data)

    # Exercises Generation
    exercises = await generate_exercises(joined_content, exercises_count)

    return {"exercises": exercises}