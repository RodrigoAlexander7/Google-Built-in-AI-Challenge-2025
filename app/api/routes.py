from fastapi import APIRouter
from app.api.summarize_routes import router as summarize_router
from app.api.exercise_routes import router as exercise_router

router = APIRouter()
router.include_router(summarize_router)
router.include_router(exercise_router)