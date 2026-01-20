import os
from sqlmodel import SQLModel, create_engine, text
from dotenv import load_dotenv
# Import models to ensure they are registered in metadata
from models import Timeline, TimelineStep, TimelineMessage

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not set")
    # Fallback to local sqlite for testing if needed, or exit
    # DATABASE_URL = "sqlite:///verdyct_v2.db"
    exit(1)

# Fix asyncpg/ssl for sync engine (SQLAlchemy)
if "postgresql+asyncpg" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg", "postgresql")

# Ensure SSL for Supabase
if "sslmode" not in DATABASE_URL and "sqlite" not in DATABASE_URL:
    if "?" in DATABASE_URL:
        DATABASE_URL += "&sslmode=require"
    else:
        DATABASE_URL += "?sslmode=require"

print(f"Connecting to: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'local'}")

engine = create_engine(DATABASE_URL)

def update_schema():
    print("--- 1. Creating new tables ---")
    try:
        SQLModel.metadata.create_all(engine)
        print("✅ New tables (Timeline, TimelineStep, TimelineMessage) checked/created.")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

    print("\n--- 2. Update 'users' table ---")
    with engine.connect() as conn:
        # Check if subscription_tier exists
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN subscription_tier VARCHAR DEFAULT 'free'"))
            conn.commit()
            print("✅ Added 'subscription_tier' column to 'users' table.")
        except Exception as e:
            print(f"⚠️  Column 'subscription_tier' likely exists or error: {e}")

if __name__ == "__main__":
    update_schema()
