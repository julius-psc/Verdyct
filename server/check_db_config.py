import os
import sys
# Force utf-8 for stdout
sys.stdout.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()
db_url = os.getenv("DATABASE_URL")

print(f"--- DATABASE URL DIAGNOSTICS ---")
if not db_url:
    print("DATABASE_URL is NOT set.")
else:
    try:
        # Handle asyncpg replacement for parsing if needed
        parse_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
        parsed = urlparse(parse_url)
        
        print(f"Scheme: {parsed.scheme}")
        print(f"Hostname: {parsed.hostname}")
        print(f"Port: {parsed.port}")
        print(f"Username: {parsed.username}")
        
        if parsed.hostname and "pooler.supabase.com" in parsed.hostname:
            if parsed.username and "." not in parsed.username:
                print("\n CRITICAL ISSUE DETECTED:")
                print(f" [X] You are using the Supabase Pooler ({parsed.hostname})")
                print(f" [X] BUT your username '{parsed.username}' is missing the project reference.")
                print(f" [V] It should be format: [user].[project_ref]")
                print(f"     Example: {parsed.username}.cousnfksilxcxmcrerxx")
            else:
                print(" [V] Username format looks correct for Pooler.")
        else:
            print("Not using Supabase Pooler hostname.")
            
    except Exception as e:
        print(f"Error parsing URL: {e}")
print(f"--------------------------------")
