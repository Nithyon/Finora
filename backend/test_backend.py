#!/usr/bin/env python3
"""
Test script to verify Finora backend is working
Run this locally before deployment
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test if server is running"""
    print("🔍 Testing server health...")
    try:
        response = requests.get(f"{BASE_URL}/docs")
        print(f"✅ Server is running at {BASE_URL}")
        return True
    except Exception as e:
        print(f"❌ Server not running: {e}")
        return False

def test_create_user():
    """Test user creation"""
    print("\n🔍 Testing user creation...")
    try:
        payload = {
            "email": "testuser@example.com",
            "name": "Test User",
            "password_hash": "hashed_password"
        }
        response = requests.post(f"{BASE_URL}/users", json=payload)
        if response.status_code == 200:
            print(f"✅ User created: {response.json()}")
            return response.json()["id"]
        else:
            print(f"❌ Failed to create user: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_get_categories():
    """Test getting transaction categories"""
    print("\n🔍 Testing categories endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/categories")
        if response.status_code == 200:
            print(f"✅ Categories retrieved: {response.json()[:3]}...")
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_chat():
    """Test chat endpoint"""
    print("\n🔍 Testing chat endpoint...")
    try:
        payload = {
            "message": "How can I save more money?",
            "user_id": 1
        }
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        if response.status_code == 200:
            print(f"✅ Chat response: {response.json()['response'][:100]}...")
            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("🧪 Finora Backend Test Suite")
    print("=" * 60)
    
    if not test_health():
        print("\n⚠️  Make sure to run: cd backend && python main.py")
        return
    
    test_get_categories()
    user_id = test_create_user()
    test_chat()
    
    print("\n" + "=" * 60)
    print("✅ All tests completed!")
    print("=" * 60)

if __name__ == "__main__":
    main()
