
import os
import hmac
import hashlib
import json
# import pytest
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Load env before importing main
load_dotenv()

# We need to set the secret explicitly if not in env (it should be)
os.environ["LEMONSQUEEZY_WEBHOOK_SECRET"] = os.getenv("LEMONSQUEEZY_WEBHOOK_SECRET", "Issa.stizix25")

from fastapi import FastAPI
from routers import webhooks
# from main import app
from auth import supabase

app = FastAPI()
app.include_router(webhooks.router)

client = TestClient(app)

SECRET = os.environ["LEMONSQUEEZY_WEBHOOK_SECRET"]

def generate_signature(payload: dict) -> str:
    raw_body = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    return hmac.new(SECRET.encode('utf-8'), raw_body, hashlib.sha256).hexdigest()

def test_webhook_credits_purchase():
    """
    Test that an 'order_created' event for the Starter Pack adds 50 credits.
    """
    # 1. Setup: Get a user ID (we'll use a test user or just assume one exists)
    # We'll fetch the first user from DB to use valid ID
    user_res = supabase.table("users").select("id, credits").limit(1).execute()
    if not user_res.data:
        print("No users found in DB to test with")
        return
    
    test_user = user_res.data[0]
    user_id = test_user['id']
    initial_credits = test_user.get('credits', 0)
    
    print(f"Testing with User ID: {user_id}, Initial Credits: {initial_credits}")
    
    # 2. Payload
    payload = {
        "meta": {
            "event_name": "order_created",
            "custom_data": {
                "user_id": user_id
            }
        },
        "data": {
            "type": "orders",
            "id": "1",
            "attributes": {
                "first_order_item": {
                    "variant_id": 1281303, # Starter Pack
                    "variant_name": "Starter Pack"
                },
                "status": "paid"
            }
        }
    }
    
    # Needs to be exact string for signature
    # json.dumps default puts space after separators, but FastAPI/requests might differ.
    # The verifier usually takes raw bytes. TestClient json= param might serialize differently.
    # We should send content and header manually to match signature generation.
    params_json = json.dumps(payload)
    
    signature = hmac.new(SECRET.encode('utf-8'), params_json.encode('utf-8'), hashlib.sha256).hexdigest()
    
    # 3. Request
    response = client.post(
        "/api/webhooks/lemonsqueezy",
        content=params_json,
        headers={
            "X-Signature": signature,
            "Content-Type": "application/json"
        }
    )
    
    assert response.status_code == 200, f"Response: {response.text}"
    assert response.json() == {"status": "processed"}
    
    # 4. Verify DB
    updated_res = supabase.table("users").select("credits").eq("id", user_id).execute()
    new_credits = updated_res.data[0]['credits']
    
    print(f"Old Credits: {initial_credits}, New Credits: {new_credits}")
    assert new_credits == initial_credits + 50

if __name__ == "__main__":
    # Rudimentary runner if pytest not installed
    try:
        test_webhook_credits_purchase()
        print("✅ Test passed!")
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
