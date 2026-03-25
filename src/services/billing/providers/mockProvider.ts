import type { BillingProviderInterface, SubscriptionCatalogItem, PurchaseSession, RestorePurchasesResult, EntitlementState } from '@/types/billing';
import { SUBSCRIPTION_CATALOG } from '@/config/subscriptions';
import { useAuthStore } from '@/store/useAuthStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

export const mockProvider: BillingProviderInterface = {
  provider: 'mock',
  isAvailable: true,

  async loadProducts(): Promise<SubscriptionCatalogItem[]> {
    return SUBSCRIPTION_CATALOG;
  },

  async startPurchase(planId: string): Promise<PurchaseSession> {
    const store = useSubscriptionStore.getState();
    if (planId === 'trial') store.startTrial();
    else if (planId === 'premium_monthly') store.upgradeToMonthly();
    else if (planId === 'premium_yearly') store.upgradeToYearly();
    return {
      id: Date.now().toString(),
      provider: 'mock',
      planType: planId,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  },

  async restorePurchases(): Promise<RestorePurchasesResult> {
    const user = useAuthStore.getState().currentUser;
    if (user && (user.plan === 'premium_monthly' || user.plan === 'premium_yearly')) {
      return { success: true, restoredPlan: user.plan, provider: 'mock', message: 'Acquisti ripristinati con successo.' };
    }
    return { success: false, provider: 'mock', message: 'Nessun acquisto da ripristinare.' };
  },

  async cancelSubscription(): Promise<boolean> {
    useSubscriptionStore.getState().cancelSubscription();
    return true;
  },

  async getEntitlements(): Promise<EntitlementState> {
    const user = useAuthStore.getState().currentUser;
    return {
      isPremium: user?.plan === 'premium_monthly' || user?.plan === 'premium_yearly',
      planType: user?.plan || 'free',
      provider: 'mock',
      expiresAt: user?.subscriptionEnd,
      isTrialing: user?.subscriptionStatus === 'in_trial',
    };
  },
};
