
import asyncio
import os
from dotenv import load_dotenv

# Load env first (although database.py might load it, good to be sure)
load_dotenv()

from database import DATABASE_URL, engine
from sqlalchemy import text

async def check():
    print(f"🔹 Configured DATABASE_URL: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else DATABASE_URL}")
    
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT version();"))
            version = result.scalar()
            print(f"✅ Connection Successful! Connected to: {version}")
    except Exception as e:
        print(f"❌ Connection Failed: {e}")

if __name__ == "__main__":
    asyncio.run(check())
