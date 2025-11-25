import requests
import time
import sys
import os
import sqlite3
import json

BASE_URL = "http://localhost:8000"
DB_PATH = "verdyct.db"

def test_static_file():
    print("Testing static file serving...")
    try:
        response = requests.get(f"{BASE_URL}/static/verdyct-pixel.js")
        if response.status_code == 200:
            print("✅ Static file served successfully.")
        else:
            print(f"❌ Failed to serve static file: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing static file: {e}")

def test_track_endpoint():
    print("\nTesting /api/track endpoint...")
    payload = {
        "project_id": "test-db-project-1",
        "timestamp": "2023-10-27T10:00:00Z",
        "page_url": "http://example.com",
        "element_text": "Sign Up",
        "tag_name": "BUTTON"
    }
    try:
        response = requests.post(f"{BASE_URL}/api/track", json=payload)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ignored":
                print("✅ Track event correctly ignored (unknown project).")
            else:
                print(f"⚠️ Track event received: {data} (Expected 'ignored' if project doesn't exist)")
        else:
            print(f"❌ Failed to track event: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error testing track endpoint: {e}")

def check_db_persistence():
    print("\nChecking database persistence...")
    
    # We can't easily trigger a full report generation here as it costs money/time
    # But we can check if the DB has any projects if the user has run one.
    # OR we can manually insert one to test the DB connection if we wanted.
    
    if not os.path.exists(DB_PATH):
        print("❌ verdyct.db NOT found.")
        return

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT count(*) FROM project")
        count = cursor.fetchone()[0]
        print(f"✅ verdyct.db connection successful. Projects found: {count}")
        conn.close()
    except Exception as e:
        print(f"❌ Error checking SQLite: {e}")

    if os.path.exists("chroma_db"):
        print("✅ chroma_db folder exists.")
    else:
        print("❌ chroma_db folder NOT found.")

if __name__ == "__main__":
    try:
        health = requests.get(f"{BASE_URL}/health")
        if health.status_code != 200:
            print("Server not healthy. Please start the server.")
            sys.exit(1)
    except:
        print("Server not running. Please start the server.")
        sys.exit(1)
        
    test_static_file()
    test_track_endpoint()
    # test_verify_cta_endpoint() # Skipped as we don't have a valid project
    check_db_persistence()
