
import os
from dotenv import load_dotenv

load_dotenv()

required_keys = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_ANON_KEY", "SUPABASE_JWT_SECRET"]

print("Checking environment variables in server/.env:")
for key in required_keys:
    value = os.getenv(key)
    if value:
        print(f"✅ {key} is set")
    else:
        print(f"❌ {key} is MISSING")
