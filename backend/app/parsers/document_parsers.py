import io
from typing import Dict, Any

def parse_txt(file_bytes: bytes) -> str:
    try:
        return file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        return file_bytes.decode("latin-1", errors="ignore")

def parse_docx(file_bytes: bytes) -> str:
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return "\n\n".join(paragraphs)
    except Exception as e:
        # Fallback XML extraction if docx parser raises
        try:
            import zipfile
            import xml.etree.ElementTree as ET
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
                xml_content = z.read("word/document.xml")
            tree = ET.fromstring(xml_content)
            texts = [node.text for node in tree.iter() if node.tag.endswith("t") and node.text]
            return " ".join(texts)
        except Exception:
            return f"[Error parsing DOCX: {str(e)}]"

def parse_pdf(file_bytes: bytes) -> Dict[str, Any]:
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        pages_text = []
        for i, page in enumerate(doc):
            pages_text.append({
                "page": i + 1,
                "text": page.get_text()
            })
        full_text = "\n\n".join(p["text"] for p in pages_text if p["text"].strip())
        return {
            "page_count": len(pages_text),
            "full_text": full_text,
            "pages": pages_text
        }
    except Exception as e:
        return {
            "page_count": 1,
            "full_text": f"[Error reading PDF: {str(e)}]",
            "pages": []
        }

def parse_uploaded_file(filename: str, file_bytes: bytes) -> Dict[str, Any]:
    fn = filename.lower()
    if fn.endswith(".pdf"):
        res = parse_pdf(file_bytes)
        return {
            "filename": filename,
            "file_type": "pdf",
            "page_count": res["page_count"],
            "text": res["full_text"]
        }
    elif fn.endswith(".docx"):
        txt = parse_docx(file_bytes)
        return {
            "filename": filename,
            "file_type": "docx",
            "page_count": 1,
            "text": txt
        }
    else:
        txt = parse_txt(file_bytes)
        return {
            "filename": filename,
            "file_type": "txt",
            "page_count": 1,
            "text": txt
        }
