SAMPLE_PRODUCTS = [
    {"id": 1, "name": "Caftan Traditionnel Rouge", "price": 2500, "stock_quantity": 5, "category": "caftan"},
    {"id": 2, "name": "Caftan Moderne Noir", "price": 2800, "stock_quantity": 3, "category": "caftan"},
    {"id": 3, "name": "Robe Marocaine Verte", "price": 1800, "stock_quantity": 8, "category": "robe"},
    {"id": 4, "name": "Sac Cabas Signature", "price": 1200, "stock_quantity": 12, "category": "sac"},
    {"id": 5, "name": "Ceinture Cuir Artisanale", "price": 450, "stock_quantity": 20, "category": "accessoire"},
    {"id": 6, "name": "Parfum Ambre Orientale", "price": 650, "stock_quantity": 15, "category": "parfum"},
    {"id": 7, "name": "Babouches Traditionnelles", "price": 350, "stock_quantity": 25, "category": "chaussure"},
    {"id": 8, "name": "Foulard Soie", "price": 280, "stock_quantity": 30, "category": "accessoire"},
]

def get_products() -> list:
    return SAMPLE_PRODUCTS

def search_products(query: str) -> list:
    query_lower = query.lower()
    results = []
    for p in SAMPLE_PRODUCTS:
        name = p.get('name', '').lower()
        # Check if any word in query matches the product name
        query_words = query_lower.split()
        for word in query_words:
            if len(word) > 2 and word in name:
                results.append(p)
                break
    return results

def get_all_products_text() -> str:
    output = []
    for p in SAMPLE_PRODUCTS:
        output.append(f"{p['name']} - {p['price']} DH - Stock: {p['stock_quantity']}")
    return "\n".join(output)

def search_products_text(query: str) -> str:
    products = search_products(query)
    if not products:
        return ""
    output = []
    for p in products:
        output.append(f"{p['name']} - {p['price']} DH - Stock: {p['stock_quantity']}")
    return "\n".join(output)

def get_categories_text() -> str:
    categories = set(p['category'] for p in SAMPLE_PRODUCTS)
    return ", ".join(sorted(categories))