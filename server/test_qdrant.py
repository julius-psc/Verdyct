import sys
import os
import shutil

# Clean up previous test db if exists
if os.path.exists("./qdrant_db_test"):
    try:
        shutil.rmtree("./qdrant_db_test")
    except:
        pass

print("Starting Qdrant Verification...")

try:
    from qdrant_client import QdrantClient
    from qdrant_client.http import models
    from sentence_transformers import SentenceTransformer
    
    print("Imports successful.")
    
    # 1. Initialize Client
    client = QdrantClient(path="./qdrant_db_test")
    print("Client initialized.")
    
    # 2. Create Collection
    collection_name = "test_collection"
    client.recreate_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(
            size=384,
            distance=models.Distance.COSINE
        )
    )
    print("Collection created.")
    
    # 3. Generate Embedding
    model = SentenceTransformer('all-MiniLM-L6-v2')
    text = "This is a test idea"
    embedding = model.encode(text).tolist()
    print(f"Embedding generated (len={len(embedding)}).")
    
    # 4. Upsert
    import uuid
    id_ = str(uuid.uuid4())
    client.upsert(
        collection_name=collection_name,
        points=[
            models.PointStruct(
                id=id_,
                vector=embedding,
                payload={"text": text, "type": "test"}
            )
        ]
    )
    print("Upsert successful.")
    
    # 5. Search
    results = client.search(
        collection_name=collection_name,
        query_vector=embedding,
        limit=1
    )
    
    print(f"Search results: {len(results)}")
    if results:
        print(f"Top match score: {results[0].score}")
        print(f"Payload: {results[0].payload}")
        print("✅ VERIFICATION PASSED")
    else:
        print("❌ VERIFICATION FAILED: No results found")

except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
