import type { BillingProviderInterface, SubscriptionCatalogItem, PurchaseSession, RestorePurchasesResult, EntitlementState } from '@/types/billing';
import { SUBSCRIPTION_CATALOG } from '@/config/subscriptions';

const isNativeIOS = () => typeof (window as any).Capacitor !== 'undefined' && (window as any).Capacitor?.getPlatform?.() === 'ios';

export const appleProvider: BillingProviderInterface = {
  provider: 'apple',
  get isAvailable() { return isNativeIOS(); },

  async loadProducts(): Promise<SubscriptionCatalogItem[]> {
    // In production: use @awesome-cordova-plugins/in-app-purchase-2
    // or capacitor-purchases (RevenueCat) to fetch App Store products
    // Products: com.speaklivetranslate.premium.monthly, com.speaklivetranslate.premium.yearly
    return SUBSCRIPTION_CATALOG;
  },

  async startPurchase(planId: string): Promise<PurchaseSession> {
    if (!isNativeIOS()) {
      throw new Error("Gli acquisti App Store sono disponibili nell'app iOS pubblicata, non nel preview web.");
    }
    // In production:
    // const product = await store.get('com.speaklivetranslate.premium.' + planId);
    // await store.order(product);
    throw new Error('App Store billing non ancora integrato. Configura il plugin IAP di Capacitor.');
  },

  async restorePurchases(): Promise<RestorePurchasesResult> {
    if (!isNativeIOS()) {
      return { success: false, provider: 'apple', message: "Il ripristino acquisti App Store è disponibile solo nell'app iOS." };
    }
    // In production: await store.restorePurchases();
    return { success: false, provider: 'apple', message: 'Nessun acquisto da ripristinare.' };
  },

  async cancelSubscription(): Promise<boolean> {
    // iOS subscriptions are managed through Settings > Apple ID > Subscriptions
    throw new Error("Gestisci il tuo abbonamento dalle Impostazioni del tuo iPhone > Apple ID > Abbonamenti.");
  },

  async getEntitlements(): Promise<EntitlementState> {
    return { isPremium: false, planType: 'free', provider: 'apple', isTrialing: false };
  },
};
