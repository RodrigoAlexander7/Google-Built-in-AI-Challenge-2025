from fastapi import APIRouter
from app.api.summarize_routes import router as summarize_router

router = APIRouter()
router.include_router(summarize_router)
