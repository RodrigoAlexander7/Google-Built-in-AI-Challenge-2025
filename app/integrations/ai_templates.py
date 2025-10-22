from langchain_core.prompts import PromptTemplate

'''
character: str = "informative, descriptive, investigation, synopsis, review"
languaje_register: str = "formal, informal, colloquial, creative, etc"
language: str = "Spanish"
extension: str = "short, medium, long

'''
def summarize_template(
        character:str,
        languaje_register: str,
        language:str, 
        extension: str, 
        include_references: bool = False, 
        include_examples: bool = False, 
        include_conclusions: bool = False
        ):
    return PromptTemplate.from_template("""
    You are an expert AI assistant specialized in summarizing documents.
    Given the following document content, your task is to generate summary that captures the main points and key information.
    The summary should be written in {language} with a {languaje_register} tone and a {character} style.
    The summary should be of {extension} length.
    
    Content:
    {content}
    """)

def exercises_template():
    return PromptTemplate.from_template("""
    You are an expert educational assistant. 
    Given a document content or topic, your task is to create well-structured exercises to help students learn the material.

    ### INSTRUCTIONS:
    - Read the provided topic or document content carefully.
    - Generate {exercises_count} exercises related to the main ideas.
    - You only must to generate multiple choice exercises.
    - Assign a difficulty level ("easy", "medium", "hard").
    - For each exercise, provide:
        - A clear question.
        - If applicable, 3-5 answer choices (mark which one is correct).
        - The correct answer text.
        - A brief explanation for why that answer is correct.
        - If possible, the learning objective (what concept the question tests).

    This is the document content:
    {content}
    """)

def flashcards_template():
    return PromptTemplate.from_template("""
    You are an expert educator and instructional designer.
    Your task is to generate {flashcards_count} high-quality flashcards from a given document, text or topic. Each flashcard should test understanding of the key concepts, definitions, examples, and relationships in the material.

    This is the document content:
    {content}
    """)