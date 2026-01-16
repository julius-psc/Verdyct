import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print(json.dumps({"error": "Missing env vars"}))
    exit()

supabase = create_client(url, key)

try:
    # 1. Get first user
    user = supabase.table("users").select("id, daily_count").limit(1).single().execute()
    user_id = user.data.get('id')
    current_count = user.data.get('daily_count')
    
    print(f"Current count for {user_id}: {current_count}")
    
    # 2. Try simple update (set to same value to verify permissions without changing data, or +1)
    # Let's increment +1 to prove it moves
    new_count = current_count + 1
    update_res = supabase.table("users").update({"daily_count": new_count}).eq("id", user_id).execute()
    
    if update_res.data:
        print(f"SUCCESS: Updated count to {update_res.data[0]['daily_count']}")
    else:
        print("FAILURE: No data returned from update")
        
except Exception as e:
    print(f"ERROR: {e}")
