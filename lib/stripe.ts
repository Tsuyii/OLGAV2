let stripe: any = null

try {
  const Stripe = require('stripe')
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil',
    })
  }
} catch (e) {
  console.warn('Stripe not configured')
}

export { stripe }

export async function createCheckoutSession(params: {
  lineItems: { name: string; amount: number; quantity: number; currency?: string }[]
  successUrl: string
  cancelUrl: string
  customerId?: string
  customerEmail?: string
  metadata?: Record<string, string>
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: params.lineItems.map((item) => ({
      price_data: {
        currency: item.currency || 'mad',
        product_data: { name: item.name },
        unit_amount: Math.round(item.amount * 100),
      },
      quantity: item.quantity,
    })),
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer: params.customerId,
    customer_email: params.customerEmail,
    metadata: params.metadata,
  })

  return session
}

export async function retrieveSession(sessionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }
  return stripe.checkout.sessions.retrieve(sessionId)
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}