import os
import socket
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load env directly
load_dotenv()
db_url = os.getenv("DATABASE_URL")

print(f"DEBUG: Raw DATABASE_URL length: {len(db_url) if db_url else 0}")

if not db_url:
    print("❌ DATABASE_URL is missing or empty!")
    exit(1)

# Mask password for display
safe_url = db_url
try:
    if "@" in db_url:
        prefix, suffix = db_url.rsplit("@", 1)
        if ":" in prefix:
            scheme_user, _ = prefix.rsplit(":", 1)
            safe_url = f"{scheme_user}:***@{suffix}"
except:
    pass

print(f"DEBUG: DATABASE_URL = '{safe_url}'") # Quotes to see leading/trailing spaces

# Check for hidden chars
import reprlib
print(f"DEBUG: Repr of hostname part check...")

try:
    if "postgresql://" in db_url:
         db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

    parsed = urlparse(db_url)
    hostname = parsed.hostname
    port = parsed.port
    
    print(f"DEBUG: Parsed Hostname: '{hostname}'")
    print(f"DEBUG: Parsed Port: {port}")
    print(f"DEBUG: Hostname repr: {repr(hostname)}")

    if not hostname:
        print("❌ Could not parse hostname!")
        exit(1)

    print(f"Attempting DNS resolution for: {hostname}")
    info = socket.getaddrinfo(hostname, port)
    print(f"✅ DNS Resolution successful: {info[0][4]}")

except Exception as e:
    print(f"❌ Error during debug: {e}")
    import traceback
    traceback.print_exc()
