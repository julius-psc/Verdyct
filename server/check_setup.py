try:
    import sqlmodel
    print("sqlmodel imported successfully")
except ImportError as e:
    print(f"Failed to import sqlmodel: {e}")

try:
    import chromadb
    print("chromadb imported successfully")
except ImportError as e:
    print(f"Failed to import chromadb: {e}")

try:
    import aiosqlite
    print("aiosqlite imported successfully")
except ImportError as e:
    print(f"Failed to import aiosqlite: {e}")
