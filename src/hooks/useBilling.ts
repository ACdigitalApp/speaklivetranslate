import { useState, useCallback, useMemo } from 'react';
import type { BillingProvider, SubscriptionCatalogItem, PurchaseSession } from '@/types/billing';
import { detectPlatform, getDefaultProvider, getPurchaseCTA, getProviderLabel, getUnavailableMessage } from '@/config/subscriptions';
import { getBillingProvider } from '@/services/billing/providerResolver';
import { SUBSCRIPTION_CATALOG } from '@/config/subscriptions';

export function useBilling() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platform = useMemo(() => detectPlatform(), []);
  const activeProvider = useMemo(() => getDefaultProvider(platform), [platform]);
  const billingProvider = useMemo(() => getBillingProvider(), []);
  const isAvailable = billingProvider.isAvailable;
  const isMock = activeProvider === 'mock';

  const plans = SUBSCRIPTION_CATALOG;

  const ctaLabel = useMemo(() => getPurchaseCTA(activeProvider), [activeProvider]);
  const providerLabel = useMemo(() => getProviderLabel(activeProvider), [activeProvider]);
  const unavailableMessage = useMemo(() => getUnavailableMessage(activeProvider), [activeProvider]);

  const startPurchase = useCallback(async (planId: string): Promise<PurchaseSession | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await billingProvider.startPurchase(planId);
      return result;
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'acquisto');
      return null;
    } finally {
      setLoading(false);
    }
  }, [billingProvider]);

  const restorePurchases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await billingProvider.restorePurchases();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [billingProvider]);

  return {
    platform,
    activeProvider,
    providerLabel,
    ctaLabel,
    unavailableMessage,
    isAvailable,
    isMock,
    plans,
    loading,
    error,
    startPurchase,
    restorePurchases,
    clearError: () => setError(null),
  };
}
