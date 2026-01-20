import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upgrade_all_users():
    print("Upgrading all users to 'builder' tier...")
    try:
        # Update all rows
        # Supabase-js/py update without filter might be blocked by safety settings in some clients, 
        # but with service_role key usually it allows "neq" or similar tricks if "all" isn't direct.
        # But actually, let's try updating where id is not null.
        
        # First fetch all to see count (optional)
        # res = supabase.table("users").select("count", count="exact").execute()
        # print(f"Found {res.count} users.")

        data = supabase.table("users").update({"subscription_tier": "builder"}).neq("id", "00000000-0000-0000-0000-000000000000").execute()
        print(f"✅ Users upgraded.")
        
    except Exception as e:
        print(f"Error updating users: {e}")

if __name__ == "__main__":
    upgrade_all_users()
