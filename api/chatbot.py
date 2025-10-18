"""
Hugging Face Chatbot API endpoint
Uses Hugging Face Inference API for free budget advice
"""

import httpx
import os
from fastapi import APIRouter, HTTPException

router = APIRouter()

HF_API_TOKEN = os.getenv("HUGGINGFACE_API_KEY", "")
# Using open-source models from Hugging Face - great for budget advice
HF_MODEL = "meta-llama/Llama-2-7b-chat-hf"  # Excellent open-source model, free on HF
# Alternative models: "mistralai/Mistral-7B-Instruct-v0.1", "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO"
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

SYSTEM_PROMPT = """You are FINORA, an intelligent budget assistant that helps users track their funds and clarify financial doubts.

Your responsibilities:
1. FUND TRACKING: Help users understand their spending patterns, categorize expenses, and track income
2. BUDGET ADVICE: Provide personalized budget allocation recommendations based on their spending
3. CLARIFY DOUBTS: Answer questions about budgeting, saving, investing, and personal finance
4. EXPENSE ANALYSIS: Help users understand where their money is going and identify savings opportunities
5. FINANCIAL TIPS: Offer practical money-saving strategies and financial best practices

When users ask about their finances:
- Ask clarifying questions to understand their situation
- Provide actionable advice
- Suggest budget categories if they're confused
- Recommend spending limits based on best practices
- Help them set financial goals

Be friendly, non-judgmental, and supportive. Keep responses clear and concise (under 120 words).
Always encourage tracking and smart budgeting."""


async def get_hf_response(user_message: str) -> str:
    """Get response from Hugging Face model"""
    
    if not HF_API_TOKEN:
        return "Chatbot is not configured. Please set HUGGINGFACE_API_KEY environment variable."
    
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    
    payload = {
        "inputs": f"{SYSTEM_PROMPT}\n\nUser: {user_message}\n\nAssistant:",
        "parameters": {
            "max_new_tokens": 100,
            "temperature": 0.7,
            "top_p": 0.9,
        }
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                HF_API_URL,
                json=payload,
                headers=headers,
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    text = result[0].get("generated_text", "")
                    # Extract only the assistant's response
                    if "Assistant:" in text:
                        return text.split("Assistant:")[-1].strip()
                    return text.strip()
                return "I couldn't generate a response. Please try again."
            else:
                return f"API Error: {response.status_code}. Make sure your HF API key is valid."
    
    except Exception as e:
        return f"Error connecting to chatbot: {str(e)}"


@router.post("/chat")
async def chat(request: dict):
    """Chat endpoint for budget assistance"""
    
    message = request.get("message", "")
    
    if not message or len(message) > 500:
        raise HTTPException(status_code=400, detail="Invalid message")
    
    reply = await get_hf_response(message)
    
    return {"reply": reply, "status": "ok"}
