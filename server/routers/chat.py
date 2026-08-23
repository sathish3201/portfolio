from fastapi import APIRouter, Depends, HTTPException

from repositories.base import PortfolioRepository
from routers.portfolio import get_portfolio_repository
from schemas.chat import ChatRequest, ChatResponse
from services.chat_context import build_system_prompt
from services.local_llm_client import LocalLlmClient

router = APIRouter(prefix="/api", tags=["chat"])


def get_llm_client() -> LocalLlmClient:
    return LocalLlmClient()


@router.post("/portfolio-chat", response_model=ChatResponse)
async def portfolio_chat(
    body: ChatRequest,
    repo: PortfolioRepository = Depends(get_portfolio_repository),
    llm: LocalLlmClient = Depends(get_llm_client),
):
    trimmed_message = body.message.strip()
    if not trimmed_message:
        raise HTTPException(status_code=400, detail="Message must not be empty.")

    try:
        data = repo.get_data()
    except (OSError, ValueError) as err:
        raise HTTPException(status_code=500, detail="Could not load portfolio content.") from err

    system_prompt = build_system_prompt(data, trimmed_message)
    history = [m.model_dump() for m in body.history]
    reply = await llm.chat(system_prompt, trimmed_message, history)
    return ChatResponse(reply=reply)
