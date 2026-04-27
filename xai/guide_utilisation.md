# Guide d'installation - Backend Python Chatbot (xai/)

## Prérequis

- Python 3.10+ (vérifier avec `python --version`)

## Installation

### 1. Créer le virtuel environment

```bash
cd xai
python -m venv venv
```

### 2. Activer le venv

**Windows :**
```bash
.\venv\Scripts\activate
```

**Mac/Linux :**
```bash
source venv/bin/activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

## Variables d'environnement

Créer un fichier `.env` dans le dossier `xai/` avec :

```env
# Groq API Key (requis pour le LLM)
GROQ_API_KEY=votre_groq_api_key_ici

# OpenAI API Key (pour les embeddings - optionnel)
OPENAI_API_KEY=votre_openai_api_key_ici

# Supabase (optionnel - pour connexionDB)
NEXT_PUBLIC_SUPABASE_URL=https://votre_projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

Pour obtenir une clé Groq :
1. Allez sur https://console.groq.com/
2. Créez un compte gratuit
3. Allez dans API Keys
4. Copiez votre clé

## Lancer le serveur

```bash
uvicorn main:app --host 127.0.0.1 --port 8080
```

Le serveur sera accessible sur : http://127.0.0.1:8080

## Tester l'API

### Health check
```bash
curl http://localhost:8080/health
```

### Tester le chatbot
```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "je cherche un caftan"}'
```

### Avec PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/chat" -Method Post -ContentType "application/json" -Body '{"message": "bonjour"}'
```

## Connexion avec Next.js

Dans votre fichier `.env.local` à la racine du projet :

```env
PYTHON_BACKEND_URL=http://localhost:8080
```

## Fonctionnalités

Le chatbot utilise des données produits locales (pour démonstration) :
- Caftan Traditionnel Rouge - 2500 DH
- Caftan Moderne Noir - 2800 DH
- Robe Marocaine Verte - 1800 DH
- Sac Cabas Signature - 1200 DH
- Ceinture Cuir Artisanale - 450 DH
- Parfum Ambre Orientale - 650 DH
- Babouches Traditionnelles - 350 DH
- Foulard Soie - 280 DH

## Pour连接到 Supabase (production)

Pour utiliser les vraie données produits :

1. Installer les dépendances supplémentaires :
```bash
pip install sqlalchemy psycopg2-binary requests supabase
```

2. Modifier `tools.py` pour utiliser l'API Supabase au lieu des données locales

3. Utiliser les variables d'environnement adecuadas

## Dépannage

### "Module not found"
```bash
pip install -r requirements.txt
```

### "Port already in use"
Changer le port :
```bash
uvicorn main:app --port 8081
```

### "Connection refused"
Le serveur n'est peut-être pas démarré. Relancer avec :
```bash
.\venv\Scripts\python -m uvicorn main:app --reload
```

## Structure des fichiers

```
xai/
├── main.py           # FastAPI app et routes
├── tools.py         # Fonctions pour produits, DB, search
├── agent.py        # Logique du chatbot (LLM)
├── requirements.txt    # Dépendances Python
├── .env           # Variables d'environnement
└── README.md      # Ce fichier
```

## Notes

- Actuellement, le chatbot utilise des données locales (SAMPLE_PRODUCTS)
- Pour la production, connecter à Supabase pour les vrais produits
- Le chatbot peut répondre en français avec les réponses pré-définies