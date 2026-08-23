import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import chat, portfolio

app = FastAPI(
    title="Portfolio Backend API",
    description="Serves Sathish Chakali's portfolio content, resume PDF, and the portfolio chat widget "
    "(portfolio-only -- the EKADHANTHA business site and storefront checkout stay on nexoria-backend).",
    version="1.0.0",
)

origins = os.environ.get("CLIENT_ORIGIN", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio.router)
app.include_router(chat.router)
