import io
import zipfile
from typing import Dict, Any
from fastapi import HTTPException

def validate_file_content_and_type(filename: str, file_bytes: bytes, max_size_bytes: int = 10 * 1024 * 1024) -> str:
    """
    Validates file size limit, document extension, and real binary content type (magic bytes and internal structures).
    Returns normalized file_type ('pdf', 'docx', 'txt') or raises HTTPException (400).
    """
    if not file_bytes or len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(file_bytes) > max_size_bytes:
        max_mb = max_size_bytes // (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {max_mb}MB (received {len(file_bytes) / (1024*1024):.2f}MB)."
        )

    fn = (filename or "").lower()
    if not (fn.endswith(".pdf") or fn.endswith(".docx") or fn.endswith(".txt")):
        raise HTTPException(
            status_code=400,
            detail="Unsupported document format. Only PDF (.pdf), Microsoft Word (.docx), and plain text (.txt) files are supported."
        )

    # 1. Real PDF Validation: Magic bytes %PDF and valid structure
    if fn.endswith(".pdf"):
        header_sample = file_bytes[:1024]
        if b"%PDF-" not in header_sample and b"%PDF" not in header_sample:
            raise HTTPException(
                status_code=400,
                detail="Invalid PDF file: Missing %PDF signature. File may be renamed or corrupt."
            )
        try:
            import fitz
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            if doc.is_encrypted:
                doc.close()
                raise HTTPException(status_code=400, detail="Encrypted or password-protected PDF files are not supported.")
            doc.close()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Corrupt or malformed PDF file: {str(e)[:100]}")
        return "pdf"

    # 2. Real DOCX Validation: PK ZIP signature and internal Word structures
    elif fn.endswith(".docx"):
        if not file_bytes.startswith(b"PK"):
            raise HTTPException(
                status_code=400,
                detail="Invalid DOCX file: Missing PK ZIP archive signature. File may be renamed or corrupt."
            )
        try:
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
                names = z.namelist()
                has_content_types = "[Content_Types].xml" in names
                has_word_dir = any(n.startswith("word/") for n in names)
                if not (has_content_types or has_word_dir):
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid DOCX file: Archive is missing Word document structures ([Content_Types].xml or word/)."
                    )
        except zipfile.BadZipFile:
            raise HTTPException(status_code=400, detail="Corrupted DOCX file: Not a valid ZIP archive container.")
        return "docx"

    # 3. Real TXT Validation: Plain text encoding without executable binary/null bytes
    else:
        if b"\x00" in file_bytes[:4096]:
            raise HTTPException(
                status_code=400,
                detail="Invalid plain text file: File contains binary executable data or null bytes."
            )
        try:
            file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            try:
                file_bytes.decode("latin-1")
            except Exception:
                raise HTTPException(status_code=400, detail="Could not decode text file with valid UTF-8 or Latin-1 encoding.")
        return "txt"

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
    file_type = validate_file_content_and_type(filename, file_bytes)
    if file_type == "pdf":
        res = parse_pdf(file_bytes)
        return {
            "filename": filename,
            "file_type": "pdf",
            "page_count": res["page_count"],
            "text": res["full_text"]
        }
    elif file_type == "docx":
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
