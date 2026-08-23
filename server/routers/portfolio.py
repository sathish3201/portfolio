from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import FileResponse

from repositories.base import PortfolioRepository
from repositories.json_portfolio_repository import JsonPortfolioRepository
from services.local_llm_client import LocalLlmClient
from services.resume_pdf import generate_resume_pdf

router = APIRouter(prefix="/api", tags=["portfolio"])

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def get_portfolio_repository() -> PortfolioRepository:
    return JsonPortfolioRepository(DATA_DIR / "portfolio-site.json")


def get_llm_client() -> LocalLlmClient:
    return LocalLlmClient()


@router.get("/health")
def health():
    return {"status": "ok", "service": "portfolio-backend"}


@router.get("/data")
def get_data(repo: PortfolioRepository = Depends(get_portfolio_repository)):
    try:
        return repo.get_data()
    except (OSError, ValueError) as err:
        raise HTTPException(status_code=500, detail="Could not load portfolio data.") from err


@router.get("/resume")
def get_resume(repo: PortfolioRepository = Depends(get_portfolio_repository)):
    try:
        data = repo.get_data()
        pdf_bytes = generate_resume_pdf(data)
    except (OSError, ValueError) as err:
        raise HTTPException(status_code=500, detail="Could not generate resume.") from err

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="Sathish_Chakali_Resume.pdf"'},
    )


@router.get("/model-status")
async def model_status(llm: LocalLlmClient = Depends(get_llm_client)):
    return {"online": await llm.health()}


@router.get("/oop-reference")
def oop_reference():
    file_path = DATA_DIR / "oop-reference.html"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Not found.")
    return FileResponse(file_path, media_type="text/html")
