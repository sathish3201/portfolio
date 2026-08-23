"""Thin HTTP client for the local Ollama/llama-server instance,
tunneled through ngrok, that powers the portfolio chat. Ported from
portfolio-chat.js -- preserves the same hard-won prompt-shape lessons:
Gemma 3 1B has no system role (folded into the user turn instead), the
turn sequence must start with "user" and strictly alternate (a leading
canned "assistant" greeting from the frontend is dropped, not
forwarded), and the question is asked both first and last since a
small model weights recent tokens heavily and otherwise buries the
actual question at the end of a long instructional block.
"""
import os

import httpx

UNCONFIGURED_ANSWER = (
    "The AI chat isn't configured on this deployment yet. Feel free to reach out directly via email or LinkedIn."
)
UNAVAILABLE_ANSWER = (
    "I couldn't reach the AI model right now — it may be offline at the moment. "
    "Please try again shortly, or reach out via email/LinkedIn."
)


class LocalLlmClient:
    def __init__(self):
        self.model_url = os.environ.get("LOCAL_MODEL_URL")
        self.model_api_key = os.environ.get("LOCAL_MODEL_API_KEY")
        self.model_name = os.environ.get("LOCAL_MODEL_NAME", "gemma3:1b")

    def is_configured(self) -> bool:
        return bool(self.model_url and self.model_api_key)

    async def chat(self, system_prompt: str, user_message: str, history: list[dict]) -> str:
        if not self.is_configured():
            return UNCONFIGURED_ANSWER

        prior_turns = [
            {"role": m["role"], "content": m["content"]}
            for m in history
            if m.get("role") in ("user", "assistant") and isinstance(m.get("content"), str)
        ]

        messages = [
            *prior_turns,
            {
                "role": "user",
                "content": (
                    f"Visitor question: {user_message}\n\n---\n\n{system_prompt}\n\n---\n\n"
                    f'Now answer the visitor\'s question: "{user_message}"'
                ),
            },
        ]

        url = f"{self.model_url.rstrip('/')}/v1/chat/completions"
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    url,
                    headers={"Authorization": f"Bearer {self.model_api_key}"},
                    json={
                        "model": self.model_name,
                        "messages": messages,
                        "temperature": 0.4,
                        "max_tokens": 150,
                    },
                )
        except httpx.HTTPError:
            return UNAVAILABLE_ANSWER

        if response.status_code != 200:
            return UNAVAILABLE_ANSWER

        data = response.json()
        reply = (data.get("choices") or [{}])[0].get("message", {}).get("content", "").strip()
        return reply or UNAVAILABLE_ANSWER

    async def health(self) -> bool:
        if not self.model_url:
            return False
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.get(f"{self.model_url.rstrip('/')}/health")
            return response.status_code == 200
        except httpx.HTTPError:
            return False
