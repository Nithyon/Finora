"""
Enhanced Finora Chatbot with LangChain integration
Provides financial advice based on user's spending patterns
"""

import httpx
import os
from datetime import datetime, timedelta
import json
import re
from typing import Optional

HF_API_TOKEN = os.getenv("HUGGINGFACE_API_KEY", "")
HF_MODEL = "meta-llama/Llama-2-7b-chat-hf"
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

# Store conversation history (in production, use database)
conversation_history = {}

# Pre-built helpful responses for common queries
QUICK_RESPONSES = {
    "budget": "Based on the 50/30/20 rule: spend 50% on needs (rent, food, utilities), 30% on wants (entertainment, dining), and 20% on savings and goals. Would you like specific allocations for your income?",
    "save": "Here are top money-saving tips: (1) Track every expense, (2) Cut unnecessary subscriptions, (3) Use the 50/30/20 budget rule, (4) Build an emergency fund, (5) Meal prep instead of dining out. Which area interests you?",
    "category": "Common expense categories: Needs (Groceries, Utilities, Rent, Insurance), Wants (Dining, Entertainment, Shopping, Hobbies), Savings (Emergency Fund, Investments). What expenses are you categorizing?",
    "afford": "To check if you can afford something: (1) Check your remaining monthly budget, (2) Ensure it aligns with your spending category, (3) Consider if it's a need or want, (4) Look at your savings goals. What are you considering?",
    "goal": "To set financial goals: (1) Define what you want (emergency fund, vacation, investment), (2) Set a target amount and timeline, (3) Calculate monthly savings needed, (4) Track progress in Finora. What goal do you want to set?",
    "spending": "I can help analyze your spending! Please share: (1) Your monthly income, (2) Major spending categories and amounts. Then I'll show you if you're on track with the 50/30/20 rule.",
    "debt": "Debt management strategy: (1) List all debts with interest rates, (2) Consider debt snowball (smallest first) or avalanche (highest rate first), (3) Make minimum payments on all, (4) Put extra funds toward priority debt. Tell me about your debts?",
    "invest": "Investment basics: Start with high-yield savings accounts for emergency funds, then consider index funds or ETFs for long-term growth. Consult a financial advisor for personalized advice based on your risk tolerance.",
}

SYSTEM_PROMPT = """You are FINORA, an intelligent budget assistant. Be concise, helpful, and action-oriented.

KEY RULES:
1. Keep responses under 150 words
2. Give specific, actionable advice
3. Reference the 50/30/20 rule when appropriate
4. Be friendly and non-judgmental
5. Focus on practical solutions

FINANCIAL GUIDELINES:
- 50% for Needs (rent, food, utilities, insurance)
- 30% for Wants (entertainment, dining, shopping)
- 20% for Savings/Goals (emergency fund, investments, debt payoff)

BUDGET ADVICE:
- Help categorize expenses
- Analyze spending patterns
- Suggest money-saving strategies
- Encourage smart financial habits
- Support goal setting

Be concise and helpful. Always encourage tracking expenses."""


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
        Prioritizes quick responses for common queries, falls back to API if needed
        
        Args:
            user_id: User identifier
            user_message: User's question/statement
            user_context: Optional user's spending data
        
        Returns:
            Chatbot response
        """
        
        lower_msg = user_message.lower()
        
        # Check for quick responses to common queries
        for keyword, response in QUICK_RESPONSES.items():
            if keyword in lower_msg:
                # Add to history
                history = self.get_conversation_history(user_id)
                history.append({"role": "user", "content": user_message})
                history.append({"role": "assistant", "content": response})
                if len(history) > 20:
                    self.conversation_history[user_id] = history[-20:]
                return response
        
        # If no quick match and no API key, provide helpful fallback
        if not HF_API_TOKEN:
            return """I'm your budget assistant! I can help with:
• Budget allocation (50/30/20 rule)
• Expense categorization
• Spending analysis
• Money-saving tips
• Financial goal setting

What would you like help with?"""
        
        # Update context if provided
        if user_context:
            self.add_user_context(user_id, user_context)
        
        # Get conversation history
        history = self.get_conversation_history(user_id)
        history.append({"role": "user", "content": user_message})
        
        # Use AI API for more complex queries
        try:
            response = await self._call_hf_api(user_id, user_message, history)
            
            # Add to history
            history.append({"role": "assistant", "content": response})
            
            # Keep history size manageable
            if len(history) > 20:
                self.conversation_history[user_id] = history[-20:]
            
            return response
        
        except Exception as e:
            # Fallback response on API error
            return f"""I'm having trouble with the AI right now. But I can still help with basic finance advice!

Common topics I can help with:
• Budget rules (50/30/20)
• Spending categories
• Money-saving tips

Try asking about budgets, saving, categories, affordability, or goals!"""
    
    async def _call_hf_api(self, user_id: str, user_message: str, history: list) -> str:
        """Call HuggingFace API with better error handling and response extraction"""
        
        # Build a more targeted prompt
        recent_context = "\n".join([f"{m['role'].capitalize()}: {m['content']}" for m in history[-3:]])
        
        full_prompt = f"""{SYSTEM_PROMPT}

Conversation:
{recent_context}

Provide a helpful, concise response (under 200 words):"""
        
        headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
        payload = {
            "inputs": full_prompt,
            "parameters": {
                "max_new_tokens": 200,
                "temperature": 0.6,
                "top_p": 0.85,
                "do_sample": True
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
                        
                        # Better response extraction - remove the original prompt
                        # Find where the prompt ends and the response begins
                        if "Provide a helpful, concise response (under 200 words):" in text:
                            response_text = text.split("Provide a helpful, concise response (under 200 words):")[-1].strip()
                        else:
                            response_text = text.strip()
                        
                        # Clean up any remaining artifacts
                        response_text = response_text.replace("\n\nAssistant:", "").strip()
                        response_text = re.sub(r'^[:\s]+', '', response_text).strip()
                        
                        # Ensure we have actual content
                        if response_text and len(response_text.strip()) > 10:
                            return response_text
                        else:
                            return "Let me help you with your finance question. Can you provide more details about what you'd like to know?"
                    
                    return "I couldn't generate a response. Please try again."
                
                elif response.status_code == 429:
                    return "The AI is busy right now. Please try again in a moment, or ask me about budgeting basics!"
                elif response.status_code == 401:
                    return "Chatbot authentication error. Please check your API configuration."
                else:
                    return f"Temporary issue connecting to AI. Try asking about budgeting basics or the 50/30/20 rule!"
        
        except httpx.TimeoutException:
            return "The chatbot took too long to respond. Try asking about budgets or money-saving tips instead!"
        except Exception as e:
            # Provide helpful fallback instead of error message
            return "I'm working on your question! In the meantime, remember the 50/30/20 budget rule: 50% for needs, 30% for wants, 20% for savings. What specific area would you like help with?"
    
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
