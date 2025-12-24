from sqlmodel import create_engine, text
from models import Project

# Adjust path if needed, usually relative to where you run it
sqlite_url = "sqlite:///verdyct.db" 
engine = create_engine(sqlite_url)

def update_schema():
    with engine.connect() as conn:
        print("Checking/Adding 'is_public' column...")
        try:
            conn.execute(text("ALTER TABLE project ADD COLUMN is_public BOOLEAN DEFAULT 0"))
            print("Added 'is_public'.")
        except Exception as e:
            print(f"Skipped 'is_public' (likely exists): {e}")

        print("Checking/Adding 'upvotes' column...")
        try:
            conn.execute(text("ALTER TABLE project ADD COLUMN upvotes INTEGER DEFAULT 0"))
            print("Added 'upvotes'.")
        except Exception as e:
            print(f"Skipped 'upvotes' (likely exists): {e}")

        print("Checking/Adding 'views' column...")
        try:
            conn.execute(text("ALTER TABLE project ADD COLUMN views INTEGER DEFAULT 0"))
            print("Added 'views'.")
        except Exception as e:
            print(f"Skipped 'views' (likely exists): {e}")
            
        conn.commit()

if __name__ == "__main__":
    update_schema()
