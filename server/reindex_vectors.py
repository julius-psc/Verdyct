
import asyncio
import os
from dotenv import load_dotenv
from sqlmodel import select, create_engine, Session
from sqlalchemy.orm import sessionmaker

# Load env variables (Supabase URL, Qdrant Keys)
load_dotenv()

from models import Project
from database import upsert_vector, init_vector_db

# Connect to Supabase
DATABASE_URL = os.getenv("DATABASE_URL")
if "postgresql+asyncpg" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg", "postgresql")
if "sslmode" not in DATABASE_URL:
    separator = "&" if "?" in DATABASE_URL else "?"
    DATABASE_URL += f"{separator}sslmode=require"

engine = create_engine(DATABASE_URL)

def reindex():
    print("🚀 Starting Vector Re-indexing...")
    print("🔹 Connecting to Supabase...")
    
    # Init Qdrant Collection
    init_vector_db()
    
    with Session(engine) as session:
        # Fetch all projects
        projects = session.exec(select(Project)).all()
        print(f"🔹 Found {len(projects)} projects to index.")
        
        count = 0
        for project in projects:
            if not project.raw_idea:
                print(f"⚠️ Skipping project {project.id} (No raw idea)")
                continue
                
            print(f"   Indexing: {project.id} ({project.status})...")
            
            try:
                upsert_vector(
                    text=project.raw_idea,
                    metadata={
                        "project_id": project.id, 
                        "pos_score": project.pos_score, 
                        "status": project.status
                    },
                    vector_id=project.id
                )
                count += 1
            except Exception as e:
                print(f"❌ Failed to index {project.id}: {e}")
                
        print(f"✅ Re-indexing Complete! {count}/{len(projects)} vectors processed.")

if __name__ == "__main__":
    reindex()
