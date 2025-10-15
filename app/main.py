from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from settings import get_settings
from typing import List

from file_utils import extract_file_contents

app = FastAPI(title="Chrome IA System", version="1.0.0")
settings = get_settings()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"message": "Welcome to the Chrome IA System API"}

@app.post("/summarize")
async def summarize(
    files: List[UploadFile] = File(default=[], description="Files to be summarized"),
):
    # Content extraction
    data = await extract_file_contents(files)
    joined_content = "\n\n".join("\n\n".join(page for page in file_content) for file_content in data)

    # Summarization
    llm = ChatGoogleGenerativeAI(model=settings.GEMINI_MODEL, api_key=settings.GEMINI_API_KEY, max_retries=7) 

    instructions = PromptTemplate.from_template("""
    You are an expert AI assistant specialized in summarizing documents.
    Your task is to read the provided content and generate a concise summary that captures the main points and key information.
    Please ensure the summary is clear, coherent, and free of any unnecessary details.
    Content:
                                                
    {content}
    """)

    chain = instructions | llm
    result = await chain.ainvoke({ "content": joined_content })
    if not result: result = "No summary could be generated."
    else: result = result.content

    return {"summary": result}