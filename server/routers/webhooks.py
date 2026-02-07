
import os
import hmac
import hashlib
import json
from fastapi import APIRouter, Request, HTTPException, Header
from auth import supabase

router = APIRouter()

LEMONSQUEEZY_WEBHOOK_SECRET = os.getenv("LEMONSQUEEZY_WEBHOOK_SECRET")

@router.post("/api/webhooks/lemonsqueezy")
async def lemonsqueezy_webhook(request: Request, x_signature: str = Header(None)):
    """
    Handle Lemon Squeezy webhooks for subscriptions and one-time purchases.
    """
    if not LEMONSQUEEZY_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    # 1. Verify Signature
    raw_body = await request.body()
    # Create HMAC SHA256 signature
    digest = hmac.new(
        LEMONSQUEEZY_WEBHOOK_SECRET.encode("utf-8"),
        raw_body,
        hashlib.sha256
    ).hexdigest()

    if not x_signature or not hmac.compare_digest(digest, x_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    # 2. Parse Event
    try:
        data = json.loads(raw_body)
        event_name = data.get("meta", {}).get("event_name")
        payload = data.get("data", {}).get("attributes", {})
        custom_data = data.get("meta", {}).get("custom_data", {})
        
        # User ID should be passed in custom_data during checkout
        # e.g. ?checkout[custom][user_id]=<user_id>
        user_id = custom_data.get("user_id")

        if not user_id:
            print(f"⚠️ Webhook received without user_id in custom_data. Event: {event_name}")
            # We can try to look up by email, but for now let's just log it.
            # return {"status": "ignored", "reason": "no_user_id"} 
            # Actually, returning 200 is safer to avoid retries if it's not actionable.
            return {"status": "received"}

        print(f"🔔 Webhook Event: {event_name} for User: {user_id}")

        # 3. Handle Events
        if event_name == "order_created":
            # Check for Starter Pack (One-time purchase)
            first_order_item = payload.get("first_order_item", {})
            variant_id = str(first_order_item.get("variant_id"))
            
            # Starter Pack Variant ID: 1281303
            if variant_id == "1281303":
                print(f"💰 Adding 50 credits to user {user_id}")
                # Fetch current credits
                user_res = supabase.table("users").select("credits").eq("id", user_id).execute()
                current_credits = 0
                if user_res.data:
                    current_credits = user_res.data[0].get("credits", 0)
                
                # Update credits
                new_credits = current_credits + 50
                supabase.table("users").update({"credits": new_credits}).eq("id", user_id).execute()
                
        elif event_name in ["subscription_created", "subscription_updated"]:
            # Handle Subscriptions
            variant_id = str(payload.get("variant_id"))
            status = payload.get("status") # active, past_due, etc.
            renews_at = payload.get("renews_at")
            customer_id = str(payload.get("customer_id"))
            sub_id = str(data.get("data", {}).get("id"))
            
            # Builder Plan Variants: Monthly (1281308), Yearly (1281311)
            PLAN_VARIANTS = ["1281308", "1281311"]
            
            if variant_id in PLAN_VARIANTS:
                if status == "active":
                    print(f"✅ activating subscription for user {user_id}")
                    supabase.table("users").update({
                        "subscription_tier": "builder",
                        "subscription_status": "active",
                        "lemon_customer_id": customer_id,
                        "lemon_subscription_id": sub_id,
                        "lemon_variant_id": variant_id,
                        "renews_at": renews_at
                    }).eq("id", user_id).execute()
                else:
                    print(f"⚠️ Subscription status {status} for user {user_id}")
                    # Update status but don't revoke access immediately if it's just 'past_due' (or do, up to logic)
                    # For simplicty, just sync status
                    supabase.table("users").update({
                        "subscription_status": status
                    }).eq("id", user_id).execute()

        elif event_name == "subscription_cancelled":
            print(f"❌ Subscription cancelled for user {user_id}")
            # Downgrade to free? Or just mark as cancelled (access might continue until end of period)
            # Lemon sends 'subscription_updated' with status 'cancelled' or 'expired' usually?
            # 'subscription_cancelled' means it won't renew. Access usually remains until 'ends_at'.
            # We'll just update the status.
             
            supabase.table("users").update({
                "subscription_status": "cancelled"
            }).eq("id", user_id).execute()
            
            # If status is "expired", revert to free
            if payload.get("status") == "expired":
                 supabase.table("users").update({
                    "subscription_tier": "free"
                }).eq("id", user_id).execute()

    except Exception as e:
        print(f"❌ Webhook Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    return {"status": "processed"}
