from models import FinancierResponse
import json

try:
    schema = FinancierResponse.model_json_schema()
    print(json.dumps(schema, indent=2))
    
    # Check specific nested structure
    defs = schema.get('$defs', {})
    rp = defs.get('RevenueProjection', {})
    print("\n--- RevenueProjection Schema ---")
    print(json.dumps(rp, indent=2))
    
    props = rp.get('properties', {})
    req = rp.get('required', [])
    
    if 'projections' in req and 'projections' not in props:
        print("\n❌ CRITICAL: 'projections' is REQUIRED but missing from PROPERTIES!")
    else:
        print("\n✅ Schema looks technically valid (locally).")

except Exception as e:
    print(f"Error generating schema: {e}")
    import traceback
    traceback.print_exc()
