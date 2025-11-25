import requests
import json

url = "http://localhost:8000/generate-report"
payload = {"idea": "AI tool for automated podcast editing"}
headers = {"Content-Type": "application/json"}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload, headers=headers, timeout=120)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("Success! Received combined report.")
        print(f"Keys: {list(data.keys())}")
        # Check for all agents
        agents = ["analyst", "spy", "financier", "architect"]
        missing = [a for a in agents if a not in data]
        if missing:
            print(f"ERROR: Missing agents: {missing}")
        else:
            print("All agents present.")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Exception: {e}")
