import os
from typing import Optional, TypedDict
from dotenv import load_dotenv
from groq import Groq
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
import tools

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

FAQ_KEYWORDS = {
    "horaire": ["horaire", "ouvert", "fermé", "heure", "jour"],
    "commande": ["commander", "commande", "achat", "acheter", "panier"],
    "paiement": ["paiement", "payer", "carte", "cash", "espèce", "paypal"],
    "retour": ["retourner", "retour", "échanger", "échange"],
    "livraison": ["livrer", "livraison", "livrer", "shipping"],
    "contact": ["contact", "téléphone", "email", "whatsapp", "appeler"],
    "taille": ["taille", "mesure", "grand", "petit"],
    "caftan": ["caftan", "kaftan", "artisanal", "main", "artisan"],
    "carte": ["carte cadeau", "gift card", "bon"],
}

FAQ_DATA = [
    {"question": "Quels sont les horaires d'ouverture?", "answer": "Notre boutique est ouverte du lundi au samedi de 10h à 19h. Le dimanche, nous sommes fermés."},
    {"question": "Comment puis-je passer une commande?", "answer": "Vous pouvez passer commande directement sur notre site web en ajoutant les articles à votre panier, ou nous contacter via WhatsApp au +212 600-123-456."},
    {"question": "Quels sont les modes de paiement acceptés?", "answer": "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal, et le paiement à la livraison."},
    {"question": "Quelle est la politique de retour?", "answer": "Vous pouvez retourner tout article dans les 14 jours suivant l'achat, à condition qu'il soit dans son état original. Les frais de retour sont à votre charge."},
    {"question": "Livrez-vous à l'international?", "answer": "Oui, nous livrons dans le monde entier. Les frais de livraison varient selon la destination. Comptez 5-15 jours ouvrés pour la livraison internationale."},
    {"question": "Comment puis-je contacter le service client?", "answer": "Vous pouvez nous contacter par email à contact@olga.ma, par téléphone au +212 600-123-456, ou via WhatsApp."},
    {"question": "Avez-vous des tailles spéciales?", "answer": "Oui, nous proposons des tailles XXS à XXL. Pour les tailles spéciales ou sur mesure, contactez-nous pour une commande personnalisée."},
    {"question": "Les caftans sont-ils faits à la main?", "answer": "Oui, tous nos caftans sont confectionnés à la main par nos artisans au Maroc, avec des matériaux de haute qualité."},
    {"question": "Comment prendre mes mesures?", "answer": "Mesurez votre poitrine, taille et hanches avec un mètre de couture. consultez notre guide des tailles sur le site pour plus de détails."},
    {"question": "Proposez-vous des cartes cadeau?", "answer": "Oui, nous proposons des cartes cadeau de 100 à 1000 DH. Elles sont valables un an et utilisables en boutique ou sur le site."},
]

SQL_KEYWORDS = ["price", "order", "stock", "status", "inventory", "quantity", "product", "category", "user", "sales", "total", "amount", "id", "disponible"]

class AgentState(TypedDict):
    messages: list
    user_id: Optional[str]
    user_query: str
    route: Optional[str]
    sql_result: Optional[str]
    semantic_result: Optional[str]
    final_response: Optional[str]

def find_faq_answer(query: str) -> str | None:
    lower_query = query.lower()
    
    for category, keywords in FAQ_KEYWORDS.items():
        for keyword in keywords:
            if keyword in lower_query:
                matching_faqs = [faq for faq in FAQ_DATA if keyword in faq["question"].lower()]
                if matching_faqs:
                    return matching_faqs[0]["answer"]
    
    import random
    return random.choice(FAQ_DATA)["answer"]

def should_use_faq_route(query: str) -> bool:
    lower_query = query.lower()
    return any(keyword in lower_query for keywords in FAQ_KEYWORDS.values() for keyword in keywords)

def should_use_sql_route(query: str) -> bool:
    lower_query = query.lower()
    return any(keyword in lower_query for keyword in SQL_KEYWORDS)

def should_use_product_route(query: str) -> bool:
    """Check if user is looking for products"""
    PRODUCT_KEYWORDS = ["caftan", "robe", "sac", "bag", "main", "dress", "pantalon", "chemise", "veste", "manteau", "accessoire", "jewel", "bijoux", "ceinture", "foulard", "écharpe", "chaussure", "botte", "sandale", "chercher", "trouver", "voir", "produit", "collection", "handbag", "vendre"]
    lower_query = query.lower()
    return any(keyword in lower_query for keyword in PRODUCT_KEYWORDS)

def get_llm():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set")
    return ChatGroq(model="llama-3.3-70b-versatile", temperature=0, api_key=GROQ_API_KEY)

async def sql_agent_node(state: AgentState) -> AgentState:
    user_query = state["user_query"]
    user_id = state.get("user_id")
    
    llm = get_llm()
    
    user_filter = f"IMPORTANT: For user data queries, ALWAYS filter by user_id = '{user_id}'" if user_id else ""
    
    system_prompt = f"""You are a helpful SQL assistant for an e-commerce store (OLGA). Use the connected database to answer user questions about products, orders, inventory, and sales.

IMPORTANT SECURITY RULES:
1. Only use SELECT queries - NEVER execute INSERT, UPDATE, DELETE, DROP, or any data modification
2. {user_filter}
3. Always format results in a clean, readable way
4. If a query could return multiple rows, show the most relevant ones (limit to 10)
5. Include column names in your response
6. For stock queries, use: SELECT name, price, stock_quantity FROM products
7. For price queries, use: SELECT name, price, description FROM products
8. For product info, use products table

Database schema:
- products: id, name, description, price, category_id, stock_quantity, image_url, created_at
- orders: id, user_id, status, total_amount, created_at
- order_items: id, order_id, product_id, quantity, price
- categories: id, name, description
- users: id, email, full_name, created_at

Answer the user's question with a valid SQL query. Generate simple SELECT queries only."""
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_query)
    ]
    
    result = await llm.ainvoke(messages)
    sql_query = result.content
    
    try:
        sql_result = tools.run_sql_query(sql_query, user_id)
        if "Erreur" in sql_result:
            llm = get_llm()
            system_prompt = """You are a helpful shopping assistant for a Moroccan fashion store (OLGA).
            
If the database query failed, provide a helpful answer based on general knowledge about the store.
Don't mention database errors to the user."""
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_query)
            ]
            result = await llm.ainvoke(messages)
            sql_result = result.content
    except Exception as e:
        sql_result = "Désolé, je n'ai pas pu effectuer cette recherche. Contactez notre service client pour plus d'informations."
    
    state["sql_result"] = sql_result
    return state

async def recommendation_node(state: AgentState) -> AgentState:
    user_query = state["user_query"]
    
    # Search products directly from database
    context = tools.search_products(user_query, 5)
    
    if not context:
        # If no products found, get all products
        context = tools.get_all_products(10)
    
    if not context:
        # If still no products, get categories
        context = tools.get_categories()
    
    llm = get_llm()
    
    system_prompt = f"""You are a helpful shopping assistant for a Moroccan fashion store (OLGA). Help users find products they might like based on their preferences.

Available products from database:
{context or "No products found in database"}

Style guidelines:
- This is a luxury Moroccan fashion brand
- Products include caftans, modern Moroccan dresses, handbags, and contemporary fashion
- Be warm, helpful, and concise
- If products found, list them with prices
- If no products found, suggest browsing our collections

Provide personalized recommendations and helpful information about the products."""
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_query)
    ]
    
    result = await llm.ainvoke(messages)
    
    state["semantic_result"] = result.content
    return state

def create_route_node(state: AgentState) -> AgentState:
    user_query = state["user_query"]
    lower_query = user_query.lower()
    
    # Product search first (highest priority) - don't use FAQ for product searches
    if should_use_product_route(user_query):
        state["route"] = "recommendation"
    elif should_use_sql_route(user_query):
        state["route"] = "sql"
    elif should_use_faq_route(user_query):
        state["route"] = "faq"
    else:
        state["route"] = "recommendation"
    
    return state

def faq_node(state: AgentState) -> AgentState:
    user_query = state["user_query"]
    answer = find_faq_answer(user_query)
    state["sql_result"] = answer
    return state

def create_response_node(state: AgentState) -> AgentState:
    route = state.get("route")
    sql_result = state.get("sql_result")
    semantic_result = state.get("semantic_result")
    
    if route == "faq" and sql_result:
        state["final_response"] = sql_result
    elif route == "sql" and sql_result:
        state["final_response"] = sql_result
    elif route == "recommendation" and semantic_result:
        state["final_response"] = semantic_result
    else:
        state["final_response"] = "Je n'ai pas pu traiter votre demande. Veuillez réessayer ou contacter notre service client."
    
    return state

async def process_message(message: str, user_id: Optional[str] = None) -> str:
    try:
        sanitized_message = tools.sanitize_input(message)
        
        state: AgentState = {
            "messages": [],
            "user_query": sanitized_message,
            "user_id": user_id,
            "route": None,
            "sql_result": None,
            "semantic_result": None,
            "final_response": None,
        }
        
        state = create_route_node(state)
        
        route = state["route"]
        if route == "sql":
            state = await sql_agent_node(state)
            if state.get("sql_result") and not state["sql_result"].startswith("Erreur"):
                pass
            elif state.get("sql_result") and "Erreur" in state["sql_result"]:
                if should_use_faq_route(message):
                    state = faq_node(state)
                else:
                    state = await recommendation_node(state)
        elif route == "faq":
            state = faq_node(state)
        else:
            state = await recommendation_node(state)
        
        state = create_response_node(state)
        
        return state.get("final_response", "No response generated")
    except Exception as e:
        if str(e) == "Invalid input detected":
            return "Je ne peux pas traiter cette demande pour des raisons de sécurité."
        return f"Une erreur s'est produite: {str(e)}"