import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class AIClient:
    """
    Abstraction layer for AI providers.
    Supports: OpenAI API, Ollama (local).
    Always returns parsed JSON dict or raises AIResponseError.
    """

    def __init__(self):
        self.provider = settings.AI_PROVIDER  # "openai" or "ollama"

    def generate(self, system_prompt: str, user_prompt: str, retries: int = 3) -> dict:
        for attempt in range(1, retries + 1):
            try:
                if self.provider == "openai":
                    raw = self._call_openai(system_prompt, user_prompt)
                elif self.provider == "ollama":
                    raw = self._call_ollama(system_prompt, user_prompt)
                else:
                    raise ValueError(f"Unknown AI provider: {self.provider}")
                return self._parse_json(raw)
            except Exception as e:
                logger.warning(f"AI call attempt {attempt} failed: {e}")
                if attempt == retries:
                    raise AIResponseError(f"AI generation failed after {retries} attempts: {e}")

    def _call_openai(self, system_prompt: str, user_prompt: str) -> str:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        return response.choices[0].message.content

    def _call_ollama(self, system_prompt: str, user_prompt: str) -> str:
        import requests
        payload = {
            "model": settings.OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "stream": False,
            "format": "json",
        }
        response = requests.post(
            f"{settings.OLLAMA_BASE_URL}/api/chat",
            json=payload,
            timeout=120,
        )
        response.raise_for_status()
        return response.json()["message"]["content"]

    def _parse_json(self, raw: str) -> dict:
        try:
            return json.loads(raw)
        except json.JSONDecodeError as e:
            raise AIResponseError(f"AI returned invalid JSON: {e}\nRaw: {raw[:300]}")


class AIResponseError(Exception):
    pass


# Singleton — import this everywhere
ai_client = AIClient()
