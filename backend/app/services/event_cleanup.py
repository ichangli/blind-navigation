from pathlib import Path

from ..config import get_settings


def delete_event_photo(photo_url: str | None) -> bool:
    """Delete an event-owned upload without allowing paths outside the upload folder."""
    if not photo_url or not photo_url.startswith("/uploads/"):
        return False

    upload_root = get_settings().upload_path.resolve()
    target = (upload_root / Path(photo_url).name).resolve()
    if target.parent != upload_root or not target.is_file():
        return False

    try:
        target.unlink()
        return True
    except OSError:
        return False
