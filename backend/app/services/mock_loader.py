import json
from functools import lru_cache

from ..config import resource_path


def _load_json(relative_path: str) -> dict:
    path = resource_path(relative_path)
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


@lru_cache
def load_web_mock() -> dict:
    return _load_json("data/web-mock-api.json")


@lru_cache
def load_mobile_mock() -> dict:
    return _load_json("data/mobile-mock-api.json")


@lru_cache
def load_mobile_config() -> dict:
    return _load_json("data/mobile-config.json")
