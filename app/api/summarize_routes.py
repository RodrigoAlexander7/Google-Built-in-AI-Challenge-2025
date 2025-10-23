from fastapi import APIRouter, File, UploadFile, Form
from typing import List
from pydantic import BaseModel
from app.services.summarize_service import summarize_content
from app.infrastructure.files.file_manager import extract_file_contents

router = APIRouter(prefix="/summarize", tags=["Summaries"])

class SummaryOptions(BaseModel):
    character: str = 'review'
    languaje_register: str = 'formal'
    language: str = 'English'
    extension: str = 'medium'
    include_references: bool = False
    include_examples: bool = False
    include_conclusions: bool = False

@router.post("/", response_model=dict)
async def summarize(
    files: List[UploadFile] = File(..., description="PDFs to be summarized"),
    character: str = Form("review"),
    languaje_register: str = Form("formal"),
    language: str = Form("English"),
    extension: str = Form("medium"),
    include_references: bool = Form(False),
    include_examples: bool = Form(False),
    include_conclusions: bool = Form(False)
):
    options = SummaryOptions(
        character=character,
        languaje_register=languaje_register,
        language=language,
        extension=extension,
        include_references=include_references,
        include_examples=include_examples,
        include_conclusions=include_conclusions
    )

    data = await extract_file_contents(files)
    joined_content = "\n\n".join("\n\n".join(page for page in file_content) for file_content in data)

    summary = await summarize_content(joined_content, options)
    return {"summary": summary}
