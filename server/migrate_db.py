
import asyncio
import os
import traceback
from sqlmodel import SQLModel, create_engine, Session, select, text
from sqlalchemy.orm import sessionmaker, make_transient
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv

# Load env
load_dotenv()

# Models must be imported to register them with SQLModel.metadata
from models import Project, PixelEvent

# CONFIG
SQLITE_DB_URL = "sqlite:///./verdyct_v2.db"
POSTGRES_DB_URL = os.getenv("DATABASE_URL")

if not POSTGRES_DB_URL:
    print("❌ Error: DATABASE_URL not found in environment.")
    exit(1)

# Ensure sync driver
if "postgresql+asyncpg" in POSTGRES_DB_URL:
    POSTGRES_DB_URL = POSTGRES_DB_URL.replace("postgresql+asyncpg", "postgresql")

# Ensure SSL
if "sslmode" not in POSTGRES_DB_URL:
    if "?" in POSTGRES_DB_URL:
        POSTGRES_DB_URL += "&sslmode=require"
    else:
        POSTGRES_DB_URL += "?sslmode=require"

print(f"🔹 Source: {SQLITE_DB_URL}")
print(f"🔹 Target: {POSTGRES_DB_URL.split('@')[1] if '@' in POSTGRES_DB_URL else '...'}")

# Engines
source_engine = create_engine(SQLITE_DB_URL)
# Using NullPool to avoid client-side pooling conflicts with Supabase Transaction Pooler
try:
    target_engine = create_engine(POSTGRES_DB_URL, poolclass=NullPool)
except:
    # Fallback if NullPool import fails or usage changes (unlikely)
    target_engine = create_engine(POSTGRES_DB_URL)

def migrate():
    print("🚀 Starting Migration...")

    try:
        # Test Connection check
        with Session(target_engine) as session:
            print("🔹 Testing Target Connection...")
            session.exec(text("SELECT 1"))
            print("✅ Target Connection OK.")

        # 1. Create tables in Target (Supabase)
        print("🔹 Creating tables in target...")
        SQLModel.metadata.create_all(target_engine)

        # 2. Read from Source
        projects = []
        events = []
        
        with Session(source_engine) as source_session:
            print("🔹 Reading Projects from source...")
            projects = source_session.exec(select(Project)).all()
            print(f"   Found {len(projects)} projects.")

            print("🔹 Reading PixelEvents from source...")
            events = source_session.exec(select(PixelEvent)).all()
            print(f"   Found {len(events)} events.")
            
            # Detach everything from source session!
            source_session.expunge_all()

        # Make objects transient to re-attach to new session
        # (Actually, expunge_all might leave them in detached state, which is fine for 'add', 
        # but make_transient is safer if we want to treat them as new)
        for p in projects: make_transient(p)
        for e in events: make_transient(e)

        # 3. Write to Target
        with Session(target_engine) as target_session:
            new_projects_count = 0
            for proj in projects:
                existing = target_session.get(Project, proj.id)
                if not existing:
                    target_session.add(proj)
                    new_projects_count += 1
                else:
                    # Optional: Update?
                    pass
            
            print(f"🔹 Inserting {new_projects_count} new projects...")
            
            new_events_count = 0
            for event in events:
                # For events, we check ID if it's set
                if event.id is not None:
                     # Check if exists (might run into int vs bigint issues if not careful, but try)
                     # Actually, for Logs, maybe just inserting is better? 
                     # Let's try to verify existence if possible to be idempotent
                     existing = target_session.get(PixelEvent, event.id)
                     if not existing:
                         target_session.add(event)
                         new_events_count += 1
                else:
                    target_session.add(event)
                    new_events_count += 1
            
            print(f"🔹 Inserting {new_events_count} new events...")
            
            target_session.commit()
            print("✅ Migration Successful!")

    except Exception as e:
        with open("migration_error.log", "w") as f:
            traceback.print_exc(file=f)
        print(f"❌ Migration Failed. Check 'migration_error.log' for details.")
        raise

if __name__ == "__main__":
    try:
        migrate()
    except:
        pass
