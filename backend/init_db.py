import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from sqlalchemy.engine import make_url

from backend.app.config import get_settings
from backend.app.database import Base, SessionLocal, engine
from backend.app import models  # noqa: F401
from backend.app.seed import seed_all


def ensure_database_exists() -> None:
    settings = get_settings()
    url = make_url(settings.database_url)
    if url.get_backend_name() == "sqlite":
        if url.database and url.database != ":memory:":
            Path(url.database).expanduser().resolve().parent.mkdir(parents=True, exist_ok=True)
        print(f"SQLite database is ready: {url.database}")
        return

    if url.get_backend_name() != "postgresql":
        raise RuntimeError(f"Unsupported database backend: {url.get_backend_name()}")

    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

    database_name = url.database
    maintenance_url = url.set(database="postgres")

    try:
        conn = psycopg2.connect(
            dbname=maintenance_url.database,
            user=maintenance_url.username,
            password=maintenance_url.password,
            host=maintenance_url.host or "127.0.0.1",
            port=maintenance_url.port or 5432,
            connect_timeout=5,
        )
    except Exception as exc:
        raise RuntimeError(
            "无法连接 PostgreSQL。请确认服务已启动，用户名/密码/端口正确。"
        ) from exc

    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (database_name,))
            exists = cur.fetchone()
            if not exists:
                cur.execute(f'CREATE DATABASE "{database_name}" WITH ENCODING %s', ("UTF8",))
                print(f"Created database: {database_name}")
            else:
                print(f"Database already exists: {database_name}")
    finally:
        conn.close()


def main() -> int:
    ensure_database_exists()
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_all(db)
    print("Initialized database, admin user, seed events, default settings and routes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
