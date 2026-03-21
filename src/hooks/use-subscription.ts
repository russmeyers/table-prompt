import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getTierByProductId, type TierKey } from "@/lib/stripe-tiers";

interface SubscriptionState {
  loading: boolean;
  subscribed: boolean;
  tier: TierKey | null;
  subscriptionEnd: string | null;
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    loading: true,
    subscribed: false,
    tier: null,
    subscriptionEnd: null,
  });

  const check = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState({ loading: false, subscribed: false, tier: null, subscriptionEnd: null });
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;

      setState({
        loading: false,
        subscribed: data.subscribed ?? false,
        tier: data.product_id ? getTierByProductId(data.product_id) : null,
        subscriptionEnd: data.subscription_end ?? null,
      });
    } catch {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [check]);

  return { ...state, refresh: check };
}
