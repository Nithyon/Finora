"""
Enhanced Finora Chatbot with LangChain integration
Provides financial advice based on user's spending patterns
"""

import httpx
import os
from datetime import datetime, timedelta
import json
from typing import Optional

HF_API_TOKEN = os.getenv("HUGGINGFACE_API_KEY", "")
HF_MODEL = "meta-llama/Llama-2-7b-chat-hf"
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

# Store conversation history (in production, use database)
conversation_history = {}

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
- Recommend spending limits based on best practices (50/30/20 rule):
  * 50% for Needs (food, rent, utilities)
  * 30% for Wants (entertainment, dining, travel)
  * 20% for Savings/Goals
- Help them set financial goals

Be friendly, non-judgmental, and supportive. Keep responses clear and concise (under 150 words).
Always encourage tracking and smart budgeting.

Available commands:
- "Show my budget" - Display budget allocation
- "Spending by category" - Show expense breakdown
- "Money saving tips" - Get financial advice
- "Goal tracking" - Help with financial goals
- "Can I afford X?" - Budget affordability check"""


class FinoraChat:
    """Enhanced chatbot with conversation memory"""
    
    def __init__(self):
        self.conversation_history = {}
        self.user_context = {}
    
    def add_user_context(self, user_id: str, context: dict):
        """Add user spending context for personalized advice"""
        self.user_context[user_id] = {
            "total_spent": context.get("total_spent", 0),
            "spending_by_category": context.get("spending_by_category", {}),
            "monthly_budget": context.get("monthly_budget", 0),
            "goals": context.get("goals", []),
            "timestamp": datetime.utcnow()
        }
    
    def get_conversation_history(self, user_id: str):
        """Get user's conversation history"""
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        return self.conversation_history[user_id]
    
    def build_context_prompt(self, user_id: str) -> str:
        """Build a context-aware system prompt with user's spending data"""
        context = self.user_context.get(user_id, {})
        
        context_str = SYSTEM_PROMPT
        
        if context:
            spending_details = f"""
Current User Context:
- Total Spent This Month: £{context.get('total_spent', 0):.2f}
- Monthly Budget: £{context.get('monthly_budget', 0):.2f}
- Spending Breakdown: {json.dumps(context.get('spending_by_category', {}), indent=2)}
- Financial Goals: {', '.join(context.get('goals', ['No goals set']))}
            """
            context_str += spending_details
        
        return context_str
    
    async def get_response(self, user_id: str, user_message: str, user_context: Optional[dict] = None) -> str:
        """
        Get chatbot response with context
        
        Args:
            user_id: User identifier
            user_message: User's question/statement
            user_context: Optional user's spending data
        
        Returns:
            Chatbot response
        """
        
        if not HF_API_TOKEN:
            return "Chatbot is not configured. Please set HUGGINGFACE_API_KEY environment variable."
        
        # Update context if provided
        if user_context:
            self.add_user_context(user_id, user_context)
        
        # Get conversation history
        history = self.get_conversation_history(user_id)
        
        # Build context-aware prompt
        system_prompt = self.build_context_prompt(user_id)
        
        # Add to history
        history.append({"role": "user", "content": user_message})
        
        # Build conversation string
        conversation = ""
        for msg in history[-5:]:  # Keep last 5 messages for context
            role = msg["role"].capitalize()
            conversation += f"{role}: {msg['content']}\n"
        
        # Prepare request
        full_prompt = f"{system_prompt}\n\n{conversation}\nAssistant:"
        
        headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
        payload = {
            "inputs": full_prompt,
            "parameters": {
                "max_new_tokens": 150,
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
                            assistant_response = text.split("Assistant:")[-1].strip()
                        else:
                            assistant_response = text.strip()
                        
                        # Add to history
                        history.append({"role": "assistant", "content": assistant_response})
                        
                        # Keep history size manageable
                        if len(history) > 20:
                            history = history[-20:]
                            self.conversation_history[user_id] = history
                        
                        return assistant_response
                    return "I couldn't generate a response. Please try again."
                else:
                    return f"API Error: {response.status_code}. Make sure your HF API key is valid."
        
        except httpx.TimeoutException:
            return "The chatbot took too long to respond. Please try again."
        except Exception as e:
            return f"Error connecting to chatbot: {str(e)}"
    
    def get_budget_advice(self, total_income: float) -> dict:
        """
        Provide budget allocation advice based on 50/30/20 rule
        
        Returns: {
            "needs": 0.50,
            "wants": 0.30,
            "savings": 0.20,
            "amounts": {...}
        }
        """
        
        return {
            "rule": "50/30/20 Rule",
            "description": "Allocate income to Needs, Wants, and Savings",
            "percentages": {
                "needs": 0.50,
                "wants": 0.30,
                "savings": 0.20
            },
            "amounts": {
                "needs": round(total_income * 0.50, 2),
                "wants": round(total_income * 0.30, 2),
                "savings": round(total_income * 0.20, 2)
            },
            "categories": {
                "needs": ["Rent", "Groceries", "Utilities", "Insurance", "Transportation"],
                "wants": ["Dining", "Entertainment", "Shopping", "Hobbies", "Vacation"],
                "savings": ["Emergency Fund", "Investments", "Debt Payoff", "Financial Goals"]
            }
        }
    
    def analyze_spending(self, spending_by_category: dict, monthly_income: float) -> dict:
        """Analyze spending patterns and provide insights"""
        
        total_spent = sum(spending_by_category.values())
        spending_percent = (total_spent / monthly_income * 100) if monthly_income > 0 else 0
        
        insights = []
        
        if spending_percent > 90:
            insights.append("⚠️ You're spending 90%+ of your income. Consider cutting back on wants.")
        elif spending_percent > 100:
            insights.append("🚨 WARNING: You're overspending! Monthly expenses exceed income.")
        
        # Analyze by category
        for category, amount in spending_by_category.items():
            category_percent = (amount / monthly_income * 100) if monthly_income > 0 else 0
            if category_percent > 35:
                insights.append(f"💡 {category} is high ({category_percent:.0f}% of income). Consider optimization.")
        
        return {
            "total_spent": total_spent,
            "spending_percent": round(spending_percent, 2),
            "remaining_budget": round(monthly_income - total_spent, 2),
            "insights": insights,
            "recommendation": "On track! 🎉" if spending_percent <= 80 else "Needs attention"
        }


# Global chatbot instance
finora_chat = FinoraChat()


async def chat_with_context(user_id: str, message: str, user_context: Optional[dict] = None) -> dict:
    """
    Main function to get chatbot response with context
    
    Args:
        user_id: User identifier
        message: User message
        user_context: Optional spending context
    
    Returns:
        Response with message and metadata
    """
    
    reply = await finora_chat.get_response(user_id, message, user_context)
    
    return {
        "reply": reply,
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat()
    }


def get_budget_advice(total_income: float) -> dict:
    """Get budget allocation advice"""
    return finora_chat.get_budget_advice(total_income)
