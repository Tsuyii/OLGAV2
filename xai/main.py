from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import tools
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    userId: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str

def generate_response(message: str) -> str:
    message_lower = message.lower()
    
    # Search products
    products_found = tools.search_products_text(message_lower)
    all_products = tools.get_all_products_text()
    
    # Check for specific product price queries
    for product in tools.get_products():
        name_lower = product['name'].lower()
        if name_lower in message_lower or message_lower in name_lower:
            return f"Le prix de {product['name']} est {product['price']} DH. Stock disponible: {product['stock_quantity']} unités."
    
    # Determine response based on keywords
    if any(word in message_lower for word in ["caftan", "robe", "sac", "accessoire", "parfum", "babouche", "foulard"]):
        if products_found:
            return f"Voici les produits que j'ai trouvés:\n\n{products_found}\n\nUtilisez-vous ces produits? Je peux vous donner plus d'informations!"
        else:
            return "Désolé, je n'ai pas trouvé de produits correspondants."
    
    elif any(word in message_lower for word in ["prix", "price", "prix?", "combien", "coute"]):
        if products_found:
            return f"Voici les prix:\n\n{products_found}"
        else:
            return f"Voici tous nos prix:\n\n{all_products}"
    
    elif any(word in message_lower for word in ["stock", "disponible", "rupture"]):
        if products_found:
            return f"Disponibilité:\n\n{products_found}"
        else:
            return "Tous nos produits sont disponibles en stock."
    
    elif any(word in message_lower for word in ["categorie", "type", "genre"]):
        categories = tools.get_categories_text()
        return f"Nos catégories: {categories}"
    
    elif any(word in message_lower for word in ["bonjour", "salut", "hello", "hi"]):
        return "Bonjour! Bienvenue chez OLGA. Comment puis-je vous aider? Je peux vous montrer nos produits, leurs prix et disponibilité."
    
    elif any(word in message_lower for word in ["merci", "thanks"]):
        return "De rien! Je suis là pour vous aider."
    
    elif any(word in message_lower for word in ["au revoir", "bye"]):
        return "Au revoir! À bientôt chez OLGA."
    
    else:
        if all_products:
            return f"Voici tous nos produits:\n\n{all_products}\n\nQuel produit vous intéresse?"
        else:
            return "Bienvenue chez OLGA! Nous vendons des caftans, robes marocaines, sacs et accessoires artisanale."

@app.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    message = request.message
    reply = generate_response(message)
    return ChatResponse(reply=reply)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "OLGA Chatbot API"}