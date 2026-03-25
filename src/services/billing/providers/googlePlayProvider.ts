import type { BillingProviderInterface, SubscriptionCatalogItem, PurchaseSession, RestorePurchasesResult, EntitlementState } from '@/types/billing';
import { SUBSCRIPTION_CATALOG } from '@/config/subscriptions';

const isNativeAndroid = () => typeof (window as any).Capacitor !== 'undefined' && (window as any).Capacitor?.getPlatform?.() === 'android';

export const googlePlayProvider: BillingProviderInterface = {
  provider: 'googleplay',
  get isAvailable() { return isNativeAndroid(); },

  async loadProducts(): Promise<SubscriptionCatalogItem[]> {
    // In production: use capacitor-purchases (RevenueCat) or Google Play Billing
    // Products: premium_monthly, premium_yearly
    return SUBSCRIPTION_CATALOG;
  },

  async startPurchase(planId: string): Promise<PurchaseSession> {
    if (!isNativeAndroid()) {
      throw new Error("Gli acquisti Google Play sono disponibili nell'app Android pubblicata, non nel preview web.");
    }
    throw new Error('Google Play billing non ancora integrato. Configura il plugin billing di Capacitor.');
  },

  async restorePurchases(): Promise<RestorePurchasesResult> {
    if (!isNativeAndroid()) {
      return { success: false, provider: 'googleplay', message: "Il ripristino acquisti Google Play è disponibile solo nell'app Android." };
    }
    return { success: false, provider: 'googleplay', message: 'Nessun acquisto da ripristinare.' };
  },

  async cancelSubscription(): Promise<boolean> {
    throw new Error("Gestisci il tuo abbonamento da Google Play Store > Abbonamenti.");
  },

  async getEntitlements(): Promise<EntitlementState> {
    return { isPremium: false, planType: 'free', provider: 'googleplay', isTrialing: false };
  },
};
