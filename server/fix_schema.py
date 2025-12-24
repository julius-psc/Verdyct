import sqlite3
import os

DB_FILE = "verdyct_v2.db"

def fix_schema():
    if not os.path.exists(DB_FILE):
        print(f"Database {DB_FILE} not found.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        print("Attempting to add 'is_public' column...")
        cursor.execute("ALTER TABLE project ADD COLUMN is_public BOOLEAN DEFAULT 0")
        print("Added 'is_public'.")
    except sqlite3.OperationalError as e:
        print(f"Skipped 'is_public': {e}")

    try:
        print("Attempting to add 'upvotes' column...")
        cursor.execute("ALTER TABLE project ADD COLUMN upvotes INTEGER DEFAULT 0")
        print("Added 'upvotes'.")
    except sqlite3.OperationalError as e:
        print(f"Skipped 'upvotes': {e}")

    try:
        print("Attempting to add 'views' column...")
        cursor.execute("ALTER TABLE project ADD COLUMN views INTEGER DEFAULT 0")
        print("Added 'views'.")
    except sqlite3.OperationalError as e:
        print(f"Skipped 'views': {e}")

    conn.commit()
    conn.close()
    print("Schema update completed.")

if __name__ == "__main__":
    fix_schema()
