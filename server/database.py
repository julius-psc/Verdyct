import os
from typing import AsyncGenerator, List, Dict, Any, Optional
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

# ========== CONFIGURATION ==========

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("⚠️ DATABASE_URL not set. Falling back to local SQLite.")
    DATABASE_URL = "sqlite+aiosqlite:///./verdyct_v2.db"
# DATABASE_URL = "sqlite+aiosqlite:///./verdyct_v2.db"
else:
    # Ensure usage of asyncpg driver for Postgres
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
        
    # Remove sslmode from URL if present (asyncpg doesn't like it in the URL)
    if "sslmode=" in DATABASE_URL:
         DATABASE_URL = DATABASE_URL.split("sslmode=")[0].rstrip("&?")

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

# Fallback to local if no cloud credentials
QDRANT_PATH = "./qdrant_db" if not QDRANT_URL else None
COLLECTION_NAME = "verdyct_ideas"

# ========== RELATIONAL DB (ASYNC) ==========

# Config for Supabase/Postgres via asyncpg
connect_args = {}
if "supa" in DATABASE_URL or "aws-" in DATABASE_URL:
    connect_args = {"ssl": "require"}

engine = create_async_engine(DATABASE_URL, echo=False, future=True, connect_args=connect_args)

async def init_db():
    """
    Initialize the database: create SQL tables and Vector collection.
    """
    # Create SQL Tables
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    # Initialize Vector DB
    try:
        init_vector_db()
        print("✅ Database initialized (SQL + Vector).")
    except Exception as e:
        print(f"⚠️ Vector DB initialization skipped: {e}")
        print("✅ Database initialized (SQL only).")

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for FastAPI to get an async session.
    """
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

# ========== VECTOR DB (QDRANT) ==========

_qdrant_client = None
_embedding_model = None
_vector_db_available = False

try:
    from qdrant_client import QdrantClient
    from qdrant_client.http import models
    from sentence_transformers import SentenceTransformer
    _vector_db_available = True
except ImportError:
    print("⚠️ Qdrant or SentenceTransformers not installed. Vector features will be disabled.")
except Exception as e:
    print(f"⚠️ Vector DB import error: {e}. Vector features will be disabled.")

def get_qdrant_client():
    global _qdrant_client
    if not _vector_db_available:
        return None
        
    if _qdrant_client is None:
        try:
            if QDRANT_URL and QDRANT_API_KEY:
                # Initialize Cloud Qdrant
                _qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
                print(f"✅ Connected to Qdrant Cloud: {QDRANT_URL}")
            else:
                # Initialize local Qdrant
                _qdrant_client = QdrantClient(path=QDRANT_PATH or "./qdrant_db")
                print("⚠️ Using local Qdrant storage.")
        except Exception as e:
            print(f"Failed to create Qdrant client: {e}")
            return None
    return _qdrant_client

def get_embedding_model():
    global _embedding_model, _vector_db_available
    if not _vector_db_available:
        return None
        
    if _embedding_model is None:
        try:
            # Load model (this might take a moment on first run)
            _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Failed to load embedding model (Network/DNS error?): {e}")
            _vector_db_available = False # Disable vector DB if model fails to load
            return None
    return _embedding_model

def init_vector_db():
    if not _vector_db_available:
        return
        
    client = get_qdrant_client()
    if not client:
        return
    
    try:
        collections = client.get_collections()
        collection_names = [c.name for c in collections.collections]
        
        if COLLECTION_NAME not in collection_names:
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=models.VectorParams(
                    size=384,  # Dimension for all-MiniLM-L6-v2
                    distance=models.Distance.COSINE
                )
            )
            print(f"✅ Created Qdrant collection: {COLLECTION_NAME}")
    except Exception as e:
        print(f"Failed to initialize vector DB: {e}")
        raise

def upsert_vector(text: str, metadata: Dict[str, Any], vector_id: str):
    """
    Store or update an idea embedding in Qdrant.
    """
    if not _vector_db_available:
        print(f"⚠️ Vector upsert skipped (Qdrant unavailable): {metadata.get('project_id')}")
        return

    client = get_qdrant_client()
    model = get_embedding_model()
    
    if not client or not model:
        print(f"⚠️ Vector upsert skipped (Client/Model unavailable): {metadata.get('project_id')}")
        return
    
    try:
        # Generate embedding
        embedding = model.encode(text).tolist()
        
        # Upsert
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=[
                models.PointStruct(
                    id=vector_id, # Qdrant supports UUID strings
                    vector=embedding,
                    payload=metadata
                )
            ]
        )
        print(f"✅ Vector upserted for project: {metadata.get('project_id')}")
    except Exception as e:
        print(f"⚠️ Vector upsert failed: {e}")

def search_similar(text: str, n_results: int = 5) -> List[Dict]:
    """
    Search for similar ideas in the vector store.
    """
    if not _vector_db_available:
        return []

    client = get_qdrant_client()
    model = get_embedding_model()
    
    if not client or not model:
        return []
        
    try:
        # Generate query embedding
        query_vector = model.encode(text).tolist()
        
        results = client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=n_results
        )
        
        # Format results
        formatted_results = []
        for hit in results:
            formatted_results.append({
                "id": hit.id,
                "document": hit.payload.get("text", "") if hit.payload else "", # Note: we didn't store text explicitly in payload in previous code, might want to add it? 
                # Actually, in the previous code we passed 'text' as document. 
                # Qdrant stores payload. We should ensure 'text' is in metadata if we want it back.
                # But for now, let's just return metadata.
                "metadata": hit.payload,
                "score": hit.score
            })
                
        return formatted_results
    except Exception as e:
        print(f"⚠️ Vector search failed: {e}")
        return []

def delete_vector(vector_id: str):
    """
    Delete a vector by ID from Qdrant.
    """
    if not _vector_db_available:
        return

    client = get_qdrant_client()
    if not client:
        return
        
    try:
        from qdrant_client.http import models
        client.delete(
            collection_name=COLLECTION_NAME,
            points_selector=models.PointIdsList(
                points=[vector_id]
            )
        )
        print(f"✅ Vector deleted for project: {vector_id}")
    except Exception as e:
        print(f"⚠️ Vector delete failed: {e}")
