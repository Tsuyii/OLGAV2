import { NextRequest, NextResponse } from 'next/server'

const FAQ_RESPONSES: Record<string, { reply: string; suggestions?: string[] }> = {
  'shipping|delivery|livraison': {
    reply: 'Nous proposons la livraison gratuite dès 999 Dh. Les délais de livraison sont de 2 à 4 jours ouvrés au Maroc. Pour les envies internationaux, comptez 5 à 10 jours.',
    suggestions: ['Suivre ma commande', 'Retours & échanges', 'Points de vente'],
  },
  'return|exchange|retour|échange': {
    reply: 'Vous pouvez retourner ou échanger vos articles gratuitement en boutique sous 14 jours. Veuillez joindre le reçu de achat.',
    suggestions: ['Suivre ma commande', 'Livraison', 'Contact'],
  },
  'size|guide|taille': {
    reply: 'Consultez notre guide des tailles disponible sur chaque page produit. Cliquez sur "Guide des tailles" sous les options de taille.',
    suggestions: ['Contact', 'Livraison gratuite'],
  },
  'payment|pay|paie|cb': {
    reply: 'Nous acceptons tous les moyens de paiement : cartes bancaires (CMI), pago[], et enlèvement en boutique. Toutes les transactions sont sécurisées.',
    suggestions: ['Livraison', 'Retours'],
  },
  'contact|help|support|aide': {
    reply: 'Notre service client est disponible du lundi au samedi de 9h à 19h. Appelez-nous au +212 522 XX XX XX ou utilisez notre chatbot.',
    suggestions: ['Nos boutiques', 'Questions fréquentes'],
  },
  'store|boutique|magasin': {
    reply: 'OLGA dispose de plusieurs boutiques à Casablanca, Rabat et Marrakech. Consultez notre page "Nos Boutiques" pour connaître les horaires et adresses.',
    suggestions: ['Contact', 'Livraison'],
  },
  'order|commande|tracking': {
    reply: 'Pour suivre votre commande, veuillez fournir votre numéro de commande ou votre adresse email utilisée lors de la commande.',
    suggestions: ['Statut de commande #XXXX', 'Retours'],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId, context } = await request.json()

    const lowerMessage = message.toLowerCase()
    let reply = ''
    let suggestions: string[] = ['Commander', 'Livraisons', 'Retours', 'Contact']
    let action: { type: string; data?: unknown } | undefined

    for (const [keywords, response] of Object.entries(FAQ_RESPONSES)) {
      if (keywords.split('|').some((k) => lowerMessage.includes(k))) {
        reply = response.reply
        suggestions = response.suggestions || suggestions
        break
      }
    }

    if (!reply) {
      if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
        reply = 'Bonjour ! Bienvenue chez OLGA. Comment puis-je vous aider aujourd\'hui ?'
      } else if (lowerMessage.includes('merci')) {
        reply = 'Je vous en prie ! Est-ce que je peux vous aider avec autre chose ?'
      } else if (lowerMessage.includes('bye') || lowerMessage.includes('au revoir')) {
        reply = 'Au revoir ! Rendez-vous en boutique ou sur notre site. Bonne journée !'
      } else {
        reply = 'Je vous ai mieux comprendre votre demande. Voici quelques sujets courants :'
      }
    }

    if (lowerMessage.includes('order') || lowerMessage.includes('commande')) {
      const orderMatch = lowerMessage.match(/(?:commande|order)[#:\s]*([a-z0-9-]+)/i)
      if (orderMatch) {
        action = { type: 'order_status', data: { orderId: orderMatch[1] } }
      }
    }

    return NextResponse.json({
      reply,
      suggestions,
      action,
    })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { reply: 'Une erreur est survenue. Veuillez réessayer plus tard.', suggestions: ['Contact'] },
      { status: 500 }
    )
  }
}