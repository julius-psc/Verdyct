
import asyncio
import sys
import os

# Add current directory to path so imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from sqlmodel import select
from database import get_session, engine
from models import Project, PixelEvent
from sqlalchemy import inspection

async def check_schema():
    print("Checking schema...")
    try:
        async with engine.begin() as conn:
            def get_tables(connection):
                inspector = inspection.inspect(connection)
                return inspector.get_table_names()
            
            tables = await conn.run_sync(get_tables)
            print("Tables:", tables)
    except Exception as e:
        print(f"Error checking schema: {e}")

async def check_projects():
    print("Checking projects...")
    try:
        async for session in get_session():
            statement = select(Project)
            results = await session.exec(statement)
            projects = results.all()
            print(f"Projects count: {len(projects)}")
            for p in projects:
                print(f"Project: {p.id} - {p.name} (User: {p.user_id})")
    except Exception as e:
         print(f"Error checking projects: {e}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_schema())
    asyncio.run(check_projects())
