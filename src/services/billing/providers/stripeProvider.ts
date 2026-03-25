import type { BillingProviderInterface, SubscriptionCatalogItem, PurchaseSession, RestorePurchasesResult, EntitlementState } from '@/types/billing';
import { SUBSCRIPTION_CATALOG, STRIPE_PUBLISHABLE_KEY, STRIPE_CUSTOMER_PORTAL_URL } from '@/config/subscriptions';

const isConfigured = () => !!STRIPE_PUBLISHABLE_KEY;

export const stripeProvider: BillingProviderInterface = {
  provider: 'stripe',
  get isAvailable() { return isConfigured(); },

  async loadProducts(): Promise<SubscriptionCatalogItem[]> {
    return SUBSCRIPTION_CATALOG;
  },

  async startPurchase(planId: string): Promise<PurchaseSession> {
    // In production: POST to /api/billing/stripe/create-checkout-session
    // with { priceId, successUrl, cancelUrl }
    // The endpoint creates a Stripe Checkout Session and returns the URL
    const session: PurchaseSession = {
      id: Date.now().toString(),
      provider: 'stripe',
      planType: planId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    // TODO: Replace with real Stripe Checkout redirect
    // const response = await fetch('/api/billing/stripe/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     priceId: catalog.providerProductIds.stripe,
    //     successUrl: window.location.origin + '/billing/success',
    //     cancelUrl: window.location.origin + '/billing/cancel',
    //   }),
    // });
    // const { url } = await response.json();
    // window.location.href = url;
    throw new Error('Stripe non è ancora configurato. Aggiungi le chiavi API nel file .env.');
  },

  async restorePurchases(): Promise<RestorePurchasesResult> {
    return { success: false, provider: 'stripe', message: 'Il ripristino acquisti non è necessario per Stripe. Lo stato è sincronizzato automaticamente.' };
  },

  async cancelSubscription(): Promise<boolean> {
    // In production: redirect to customer portal
    throw new Error('Utilizza il Customer Portal di Stripe per gestire il tuo abbonamento.');
  },

  async getEntitlements(): Promise<EntitlementState> {
    // In production: GET /api/billing/stripe/entitlements
    return { isPremium: false, planType: 'free', provider: 'stripe', isTrialing: false };
  },

  async getCustomerPortalUrl(): Promise<string | null> {
    return STRIPE_CUSTOMER_PORTAL_URL || null;
  },
};
