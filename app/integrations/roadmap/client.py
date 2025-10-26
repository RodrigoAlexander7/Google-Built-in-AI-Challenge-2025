from app.domain.models import RoadmapOptions
from app.integrations.roadmap.templates import roadmap_template
from app.integrations.roadmap.structure import Roadmap
from app.integrations.ai_client import AIClient

class RoadmapAIClient(AIClient):
    async def generate_roadmap(self, options: RoadmapOptions) -> str:
        instructions = roadmap_template()
        structured_llm = self.model.with_structured_output(Roadmap)
        chain = instructions | structured_llm
        result = await chain.ainvoke({
            "topic": options.topic,
            "complexity_level": options.complexity_level,
            "duration": options.duration,
            "include_resources": options.include_resources
        })

        if not result:
            return "No roadmap could be generated."
        return result.model_dump()