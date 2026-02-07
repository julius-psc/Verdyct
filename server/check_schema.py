
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing SUPABASEcredentials")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_and_update_schema():
    print("Checking 'users' table schema...")
    
    # We can't easily check columns via API, but we can try to selecting them.
    # If it fails, they probably don't exist.
    # However, Supabase-py doesn't support 'alter table'.
    # We might need to run raw SQL if possible, or just print instructions for the user.
    # Actually, recent supabase-py or postgrest-py might not support DDL.
    
    # Workaround: valid SQL via the 'rpc' interface if a function exists, or just tell the user?
    # Or assuming we are using the Postgres connection string in DATABASE_URL, we can use SQLAlchemy/asyncpg to alter table!
    
    pass

if __name__ == "__main__":
    # We will use the SQLAlchemy engine from database.py if possible, or just raw psycopg2/asyncpg
    import asyncio
    import asyncpg
    
    DATABASE_URL = os.getenv("DATABASE_URL")
    if DATABASE_URL.startswith("postgresql://"):
        # Fix for asyncpg if needed (but we can use sync psycopg2 for this script)
        pass

    # Let's try to use the raw connection string to run SQL
    # We need to parse the DATABASE_URL to remove async driver if present
    
    print(f"Connecting to DB...")
    
    # Simple SQL commands to run
    commands = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive';",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS lemon_customer_id text;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS lemon_subscription_id text;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS lemon_variant_id text;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS renews_at text;" # keeping it text for ISO string simplicity or timestamp
    ]
    
    # We'll use a standard psycopg2 connection if available, or just print the SQL for the user to run in Supabase Dashboard.
    # Since I can't be sure if psycopg2 is installed (it's not in requirements.txt usually if using asyncpg),
    # I'll check if I can import it.
    
    try:
        import psycopg2
        
        # Parse connection string
        # DATABASE_URL is likely "postgresql+asyncpg://..." or "postgresql://..."
        # psycopg2 needs just "postgresql://..."
        db_url = DATABASE_URL.replace("+asyncpg", "")
        
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        for cmd in commands:
            try:
                print(f"Running: {cmd}")
                cur.execute(cmd)
                conn.commit()
            except Exception as e:
                print(f"Error running cmd: {e}")
                conn.rollback()
                
        print("✅ Schema check complete.")
        cur.close()
        conn.close()
        
    except ImportError:
        print("psycopg2 not installed. Trying asyncpg...")
        async def run_async():
            conn = await asyncpg.connect(DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://"))
            for cmd in commands:
                try:
                    print(f"Running: {cmd}")
                    await conn.execute(cmd)
                except Exception as e:
                    print(f"Error running cmd: {e}")
            await conn.close()
            print("✅ Schema check complete (Async).")
        
        asyncio.run(run_async())
        
    except Exception as e:
        print(f"SQL Execution failed: {e}")
        print("\n⚠️ Please run these SQL commands in your Supabase SQL Editor:")
        for cmd in commands:
            print(cmd)
