"""Contract for portfolio content access. Routers depend on this ABC,
never on the JSON file directly -- a future database-backed repository
could implement the same contract and swap in via main.py without
touching routers/ or services/ (Dependency Inversion).
"""
from abc import ABC, abstractmethod
from typing import Any


class PortfolioRepository(ABC):
    @abstractmethod
    def get_data(self) -> dict[str, Any]:
        """Full portfolio content: meta, hero, about, experience, projects, skills, education, certifications, faq."""
        raise NotImplementedError
