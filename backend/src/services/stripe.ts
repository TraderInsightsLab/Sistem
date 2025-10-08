import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

interface CreatePaymentSessionParams {
  sessionId: string;
  amount: number;
  currency: string;
  userEmail: string;
  metadata?: Record<string, string>;
}

interface PaymentSession {
  id: string;
  url: string;
  status: string;
}

export class StripeService {
  
  async createPaymentSession(params: CreatePaymentSessionParams): Promise<PaymentSession> {
    try {
      const { sessionId, amount, currency, userEmail, metadata = {} } = params;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: 'Raport Psihologic TraderInsightsLab',
                description: 'Analiză AI detaliată a profilului tău de trader cu recomandări personalizate',
                images: [
                  // Add your product image URL here
                  'https://your-domain.com/images/report-preview.jpg'
                ],
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.getBaseUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.getBaseUrl()}/results?session_id=${sessionId}&payment=cancelled`,
        customer_email: userEmail,
        client_reference_id: sessionId,
        metadata: {
          sessionId,
          ...metadata
        },
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
        payment_intent_data: {
          metadata: {
            sessionId,
            type: 'trader_report'
          }
        }
      });

      return {
        id: session.id,
        url: session.url!,
        status: session.status || 'pending'
      };

    } catch (error) {
      console.error('Error creating Stripe session:', error);
      throw new Error('Failed to create payment session');
    }
  }

  async verifyWebhookSignature(body: any, signature: string): Promise<boolean> {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      
      stripe.webhooks.constructEvent(body, signature, endpointSecret);
      return true;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  async handleWebhookEvent(body: any, signature: string): Promise<any> {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      
      const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      return event;
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  async getPaymentSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      return await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error('Error retrieving payment session:', error);
      throw error;
    }
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw error;
    }
  }

  private getBaseUrl(): string {
    // In production, this should be your actual domain
    return process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com'
      : 'http://localhost:3000';
  }

  // Helper method to format amount for display
  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  // Helper method to validate amount
  validateAmount(amount: number, currency: string): boolean {
    const minAmounts = {
      'ron': 50, // 0.50 RON
      'eur': 50, // 0.50 EUR
      'usd': 50  // 0.50 USD
    };

    const minAmount = minAmounts[currency.toLowerCase() as keyof typeof minAmounts] || 50;
    return amount >= minAmount;
  }
}

export const stripeService = new StripeService();