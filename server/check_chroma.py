import sys
import os
import sqlite3

print(f"Python Version: {sys.version}")
print(f"SQLite Version: {sqlite3.sqlite_version}")

try:
    import chromadb
    from chromadb.config import Settings
    print(f"ChromaDB Version: {chromadb.__version__}")
    
    persist_path = "./chroma_db_test"
    
    print(f"Attempting to create PersistentClient at {persist_path}...")
    client = chromadb.PersistentClient(path=persist_path)
    print("Client created successfully.")
    
    print("Attempting to get/create collection...")
    collection = client.get_or_create_collection("test_collection")
    print("Collection created.")
    
    print("Attempting to upsert...")
    collection.upsert(
        documents=["This is a test"],
        metadatas=[{"source": "test"}],
        ids=["id1"]
    )
    print("Upsert successful.")
    
    print("Attempting to query...")
    results = collection.query(
        query_texts=["test"],
        n_results=1
    )
    print(f"Query results: {results}")
    
except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
