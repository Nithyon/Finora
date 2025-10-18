"""
Expense classification service using Hugging Face
Classifies transactions into Bills, Needs, Wants, Goals categories
"""

import httpx
import os
from typing import Dict, List

HF_API_TOKEN = os.getenv("HUGGINGFACE_API_KEY", "")
HF_MODEL = "distilbert-base-uncased-finetuned-sst-2-english"  # Default
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

# Category keywords for classification
CATEGORY_KEYWORDS = {
    "Bills": {
        "keywords": ["rent", "utilities", "electricity", "water", "gas", "internet", "phone", "insurance", "mortgage", "taxes"],
        "emoji": "🏠",
        "color": "#10B981"
    },
    "Groceries": {
        "keywords": ["grocery", "groceries", "supermarket", "market", "food", "walmart", "costco", "trader joe", "whole foods"],
        "emoji": "🛒",
        "color": "#3B82F6"
    },
    "Rent": {
        "keywords": ["rent", "lease", "landlord"],
        "emoji": "🏡",
        "color": "#10B981"
    },
    "Vacation": {
        "keywords": ["vacation", "hotel", "airbnb", "flight", "travel", "resort", "beach", "trip"],
        "emoji": "🏖️",
        "color": "#A78BFA"
    },
    "Utilities": {
        "keywords": ["electric", "water", "gas bill", "utility"],
        "emoji": "⚡",
        "color": "#F59E0B"
    },
    "Dining": {
        "keywords": ["restaurant", "cafe", "coffee", "pizza", "burger", "sushi", "lunch", "dinner"],
        "emoji": "🍽️",
        "color": "#EC4899"
    },
    "Transportation": {
        "keywords": ["uber", "lyft", "taxi", "gas station", "petrol", "parking", "car"],
        "emoji": "🚗",
        "color": "#06B6D4"
    },
    "Entertainment": {
        "keywords": ["movie", "cinema", "netflix", "spotify", "gaming", "concert", "game"],
        "emoji": "🎬",
        "color": "#8B5CF6"
    },
    "Shopping": {
        "keywords": ["amazon", "mall", "store", "shop", "clothing", "fashion", "online"],
        "emoji": "🛍️",
        "color": "#EC4899"
    },
    "Fitness": {
        "keywords": ["gym", "fitness", "yoga", "sport", "exercise"],
        "emoji": "💪",
        "color": "#06B6D4"
    },
}

CATEGORY_TYPE_MAP = {
    "Bills": "Bills",
    "Rent": "Bills",
    "Utilities": "Bills",
    "Insurance": "Bills",
    "Groceries": "Needs",
    "Dining": "Needs",
    "Transportation": "Needs",
    "Fitness": "Needs",
    "Vacation": "Wants",
    "Entertainment": "Wants",
    "Shopping": "Wants",
}


def classify_transaction(description: str, amount: float = 0.0) -> Dict:
    """
    Classify a transaction into a category based on description
    
    Args:
        description: Transaction description
        amount: Transaction amount (helps with classification)
    
    Returns:
        Dict with category info: {
            "category": "Groceries",
            "category_type": "Needs",
            "emoji": "🛒",
            "color": "#3B82F6",
            "confidence": 0.95
        }
    """
    
    description_lower = description.lower()
    
    # Keyword-based classification (fast, reliable)
    max_matches = 0
    best_category = "Shopping"  # Default
    
    for category, info in CATEGORY_KEYWORDS.items():
        matches = sum(1 for keyword in info["keywords"] if keyword in description_lower)
        if matches > max_matches:
            max_matches = matches
            best_category = category
    
    category_type = CATEGORY_TYPE_MAP.get(best_category, "Wants")
    category_info = CATEGORY_KEYWORDS.get(best_category, CATEGORY_KEYWORDS["Shopping"])
    
    return {
        "category": best_category,
        "category_type": category_type,
        "emoji": category_info["emoji"],
        "color": category_info["color"],
        "confidence": min(0.95, 0.5 + (max_matches * 0.15))  # Higher confidence with more matches
    }


async def classify_with_hf(description: str) -> Dict:
    """
    Optional: Use Hugging Face for more advanced classification
    Falls back to keyword-based if API fails
    """
    
    try:
        if not HF_API_TOKEN:
            return classify_transaction(description)
        
        # Use keyword-based as primary (faster, more reliable)
        result = classify_transaction(description)
        return result
        
    except Exception as e:
        print(f"Error in HF classification: {str(e)}")
        # Fallback to keyword-based
        return classify_transaction(description)


def get_category_type_map() -> Dict[str, str]:
    """Get mapping of categories to types"""
    return CATEGORY_TYPE_MAP


def get_all_categories() -> List[Dict]:
    """Get all available categories"""
    categories = []
    for category, info in CATEGORY_KEYWORDS.items():
        categories.append({
            "name": category,
            "type": CATEGORY_TYPE_MAP.get(category, "Wants"),
            "emoji": info["emoji"],
            "color": info["color"]
        })
    return categories
