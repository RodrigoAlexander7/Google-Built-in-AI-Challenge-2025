from fastapi import APIRouter, File, UploadFile
from typing import List
from app.services.summarize_service import summarize_content
from app.infrastructure.files.file_manager import extract_file_contents

router = APIRouter()

@router.post("/summarize")
async def summarize(
    files: List[UploadFile] = File(default=[], description="Files to be summarized"),
):
    # Content extraction
    data = await extract_file_contents(files)
    joined_content = "\n\n".join("\n\n".join(page for page in file_content) for file_content in data)

    # Summarization
    summary = await summarize_content(joined_content)

    return {"summary": summary}
