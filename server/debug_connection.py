
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")
if "postgresql+asyncpg" in DB_URL:
    DB_URL = DB_URL.replace("postgresql+asyncpg", "postgresql")

if "?sslmode" not in DB_URL:
    DB_URL += "?sslmode=require"

print(f"Testing connection to: {DB_URL.split('@')[1] if '@' in DB_URL else '...'}")

try:
    conn = psycopg2.connect(DB_URL)
    print("✅ Connection Successful!")
    cur = conn.cursor()
    cur.execute("SELECT version();")
    print(cur.fetchone())
    cur.close()
    conn.close()
except Exception as e:
    print(f"❌ Connection Failed: {e}")
