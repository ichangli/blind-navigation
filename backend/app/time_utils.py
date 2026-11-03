from datetime import datetime, timedelta, timezone


APP_TIMEZONE = timezone(timedelta(hours=8), name="Asia/Shanghai")


def utc_now_naive() -> datetime:
    """Return a UTC timestamp suitable for the existing timezone-naive DB columns."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def local_now() -> datetime:
    return datetime.now(APP_TIMEZONE)


def to_local(value: datetime) -> datetime:
    """Treat naive database values as UTC and convert them to the app timezone."""
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(APP_TIMEZONE)


def local_to_utc_naive(value: datetime) -> datetime:
    if value.tzinfo is None:
        value = value.replace(tzinfo=APP_TIMEZONE)
    return value.astimezone(timezone.utc).replace(tzinfo=None)


def local_iso(value: datetime) -> str:
    return to_local(value).isoformat(timespec="seconds")


def format_local(value: datetime, pattern: str) -> str:
    return to_local(value).strftime(pattern)
