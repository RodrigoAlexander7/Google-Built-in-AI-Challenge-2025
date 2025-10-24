from langchain_core.prompts import PromptTemplate

def flashcards_template():
    return PromptTemplate.from_template("""
    You are an expert educator and instructional designer.
    Your task is to generate {flashcards_count} high-quality flashcards from a given document, text or topic. Each flashcard should test understanding of the key concepts, definitions, examples, and relationships in the material.

    This is the document content:
    {content}
    """)
