import os
import requests
import sys

def check_files():
    print("--- Checking Files ---")
    db_path = "./verdyct.db"
    qdrant_path = "./qdrant_db"
    
    if os.path.exists(db_path):
        print(f"✅ SQL Database found: {db_path} ({os.path.getsize(db_path)} bytes)")
    else:
        print(f"❌ SQL Database NOT found at {db_path}")

    if os.path.exists(qdrant_path):
        print(f"✅ Vector Database (Qdrant) directory found: {qdrant_path}")
    else:
        print(f"❌ Vector Database (Qdrant) directory NOT found at {qdrant_path}")

def check_server():
    print("\n--- Checking Server ---")
    try:
        response = requests.get("http://127.0.0.1:8000/health")
        if response.status_code == 200:
            print(f"✅ Server is UP. Response: {response.json()}")
        else:
            print(f"⚠️ Server responded with status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server at http://127.0.0.1:8000. Is it running?")

def check_qdrant_read():
    print("\n--- Checking Vector DB (Read-Only) ---")
    try:
        from qdrant_client import QdrantClient
        if os.path.exists("./qdrant_db"):
            client = QdrantClient(path="./qdrant_db")
            collections = client.get_collections()
            names = [c.name for c in collections.collections]
            print(f"✅ Qdrant Client initialized. Collections found: {names}")
        else:
            print("⚠️ Skipping Qdrant check because directory does not exist.")
    except ImportError:
        print("⚠️ qdrant_client library not installed in this environment.")
    except Exception as e:
        print(f"❌ Failed to read Qdrant DB: {e}")

if __name__ == "__main__":
    check_files()
    check_server()
    check_qdrant_read()
