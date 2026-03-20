import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

// ── Auth hook ────────────────────────────────────────────
export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { userId, loading };
}

// ── Restaurant hook ──────────────────────────────────────
export function useRestaurant() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ["restaurant", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_user_id", userId!)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

// ── Profile hook ─────────────────────────────────────────
export function useProfile() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

// ── Contacts hooks ───────────────────────────────────────
export function useContacts(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["contacts", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("restaurant_id", restaurantId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!restaurantId,
  });
}

export function useAddContact(restaurantId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (contact: { first_name: string; last_name?: string; mobile_number: string; email?: string; source?: string }) => {
      const { error } = await supabase.from("contacts").insert({
        restaurant_id: restaurantId!,
        ...contact,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts", restaurantId] }),
  });
}

// ── Suggestions hooks ────────────────────────────────────
export function useSuggestions(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["suggestions", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_suggestions")
        .select("*")
        .eq("restaurant_id", restaurantId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!restaurantId,
  });
}

export function useSuggestion(id: string | undefined) {
  return useQuery({
    queryKey: ["suggestion", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_suggestions")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; workflow?: any }) => {
      const { error } = await supabase
        .from("campaign_suggestions")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suggestions"] });
      qc.invalidateQueries({ queryKey: ["suggestion"] });
    },
  });
}

// ── Campaigns hooks ──────────────────────────────────────
export function useCampaigns(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["campaigns", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("restaurant_id", restaurantId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!restaurantId,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (campaign: {
      restaurant_id: string;
      suggestion_id?: string;
      title: string;
      message_body: string;
      status?: string;
      target_count?: number;
      estimated_cost?: number;
      redemption_code?: string;
    }) => {
      const { data, error } = await supabase
        .from("campaigns")
        .insert(campaign)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("campaigns").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

// ── Offer templates hook ─────────────────────────────────
export function useOfferTemplates() {
  return useQuery({
    queryKey: ["offer_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offer_templates")
        .select("*")
        .order("title");
      if (error) throw error;
      return data ?? [];
    },
  });
}

// ── Calendar events hook ─────────────────────────────────
export function useCalendarEvents() {
  return useQuery({
    queryKey: ["calendar_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("event_date");
      if (error) throw error;
      return data ?? [];
    },
  });
}

// ── Dashboard stats ──────────────────────────────────────
export function useDashboardStats(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard_stats", restaurantId],
    queryFn: async () => {
      const [contactsRes, campaignsRes, suggestionsRes] = await Promise.all([
        supabase.from("contacts").select("id, opted_in, opted_out", { count: "exact" }).eq("restaurant_id", restaurantId!),
        supabase.from("campaigns").select("id, sent_at, status").eq("restaurant_id", restaurantId!).eq("status", "sent"),
        supabase.from("campaign_suggestions").select("id, status").eq("restaurant_id", restaurantId!).in("status", ["pending", "notified", "in_review"]),
      ]);

      const contacts = contactsRes.data ?? [];
      const campaigns = campaignsRes.data ?? [];
      const suggestions = suggestionsRes.data ?? [];

      const subscriberCount = contacts.filter(c => c.opted_in && !c.opted_out).length;
      const sentThisMonth = campaigns.filter(c => {
        if (!c.sent_at) return false;
        const d = new Date(c.sent_at);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length;

      const lastSent = campaigns
        .filter(c => c.sent_at)
        .sort((a, b) => new Date(b.sent_at!).getTime() - new Date(a.sent_at!).getTime())[0];

      return {
        subscriberCount,
        campaignsSentThisMonth: sentThisMonth,
        pendingSuggestions: suggestions.length,
        lastCampaignDate: lastSent?.sent_at
          ? new Date(lastSent.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "None yet",
      };
    },
    enabled: !!restaurantId,
  });
}

// ── Restaurant update ────────────────────────────────────
export function useUpdateRestaurant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("restaurants").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["restaurant"] }),
  });
}
