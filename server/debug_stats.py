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
    response = supabase.table("users").select("*").execute()
    data = response.data
    # Filter only relevant fields
    clean_data = []
    for user in data:
        clean_data.append({
            "id": user.get('id'),
            "email": user.get('email'),
            "daily_count": user.get('daily_count'),
            "credits": user.get('credits')
        })
    print(json.dumps(clean_data, indent=2))
except Exception as e:
    print(json.dumps({"error": str(e)}))
