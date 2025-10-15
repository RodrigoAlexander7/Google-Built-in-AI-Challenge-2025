from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi import FastAPI
from settings import get_settings
from fastapi.middleware.cors import CORSMiddleware

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
    return {"message": "Data retrieved from Neo4j"}