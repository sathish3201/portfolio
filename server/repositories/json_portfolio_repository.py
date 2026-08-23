import json
from pathlib import Path
from typing import Any

from repositories.base import PortfolioRepository


class JsonPortfolioRepository(PortfolioRepository):
    def __init__(self, json_path: Path):
        self.json_path = json_path

    def get_data(self) -> dict[str, Any]:
        return json.loads(self.json_path.read_text(encoding="utf-8"))
