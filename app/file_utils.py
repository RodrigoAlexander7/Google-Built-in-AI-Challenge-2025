from typing import List
import pdfplumber
import anyio
import io

def extract_pdf_content(file_bytes: bytes, filename: str) -> List[str]:
    pages = []

    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            # Add filename & basic metadata on the first "page"
            metadata = pdf.metadata or {}
            meta_text = [f"Filename: {filename}"]
            for key in ("Title", "Author", "Subject", "Creator", "Producer"):
                if metadata.get(key):
                    meta_text.append(f"{key}: {metadata[key]}")
            pages.append("\n".join(meta_text))

            # Iterate pages
            for i, page in enumerate(pdf.pages, start=1):
                page_text = page.extract_text()
                if not page_text:
                    # fallback: try extracting words
                    words = page.extract_words()
                    if words:
                        page_text = " ".join(w["text"] for w in words)
                    else:
                        page_text = "[No extractable text on this page]"
                pages.append(page_text.strip())
    except Exception as e:
        pages.append(f"Error processing file {filename}: {str(e)}")

    return pages

async def extract_file_contents(files) -> List[List[str]]:
    if not files or len(files) == 0: return []
    content = []

    for file in files:
        file_bytes = await file.read()
        filename = file.filename.lower()

        if filename.endswith(".pdf"):
            extracted = await anyio.to_thread.run_sync(extract_pdf_content, file_bytes, file.filename)
        else:
            extracted = f"{file.filename}\n------------\n\nUnsupported file type."

        content.append(extracted)

    return content