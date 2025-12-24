import sqlite3
import os

DB_FILE = "verdyct_v2.db"

def inspect_columns():
    if not os.path.exists(DB_FILE):
        print(f"Database {DB_FILE} not found in {os.getcwd()}")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    try:
        cursor.execute("PRAGMA table_info(project)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"Columns in 'project' table: {columns}")
        
        required = ['is_public', 'upvotes', 'views']
        missing = [col for col in required if col not in columns]
        
        if missing:
            print(f"❌ MISSING COLUMNS: {missing}")
        else:
            print("✅ All columns present.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    inspect_columns()
