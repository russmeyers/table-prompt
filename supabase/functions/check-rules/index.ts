import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get all active restaurants
    const { data: restaurants } = await supabase
      .from("restaurants")
      .select("id, name, type, slow_days, meal_service, phone");

    if (!restaurants || restaurants.length === 0) {
      return new Response(JSON.stringify({ message: "No restaurants to check" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];
    const now = new Date();
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
    const hour = now.getHours();

    for (const restaurant of restaurants) {
      // Skip if already has a pending/notified suggestion today
      const { data: existing } = await supabase
        .from("campaign_suggestions")
        .select("id")
        .eq("restaurant_id", restaurant.id)
        .in("status", ["pending", "notified", "in_review"])
        .gte("created_at", new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString())
        .limit(1);

      if (existing && existing.length > 0) continue;

      // Rule 1: Inactivity — no campaign sent in 5+ days
      const { data: recentCampaigns } = await supabase
        .from("campaigns")
        .select("sent_at")
        .eq("restaurant_id", restaurant.id)
        .eq("status", "sent")
        .order("sent_at", { ascending: false })
        .limit(1);

      const lastSentAt = recentCampaigns?.[0]?.sent_at;
      const daysSinceSend = lastSentAt
        ? Math.floor((now.getTime() - new Date(lastSentAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      if (daysSinceSend >= 5) {
        const res = await callCreateSuggestion(supabaseUrl, {
          restaurantId: restaurant.id,
          triggerType: "inactivity",
          triggerReason: `No campaign sent in ${daysSinceSend === 999 ? "a while" : `${daysSinceSend} days`} — keep guests engaged`,
          promoStyle: "special",
        });
        results.push({ restaurant: restaurant.name, trigger: "inactivity", result: res });
        continue; // One suggestion per restaurant per run
      }

      // Rule 2: Slow day
      const slowDays = restaurant.slow_days ?? [];
      if (slowDays.includes(dayName) && hour >= 9 && hour <= 11) {
        const res = await callCreateSuggestion(supabaseUrl, {
          restaurantId: restaurant.id,
          triggerType: "weekday",
          triggerReason: `${dayName} is usually slow — fill seats with a deal`,
          promoStyle: "discount",
        });
        results.push({ restaurant: restaurant.name, trigger: "weekday", result: res });
        continue;
      }

      // Rule 3: Meal period approaching
      const isLunchWindow = hour >= 9 && hour <= 10;
      const isDinnerWindow = hour >= 14 && hour <= 16;
      const service = restaurant.meal_service ?? "both";

      if (isLunchWindow && (service === "lunch" || service === "both")) {
        // Only suggest if no recent lunch campaign
        const res = await callCreateSuggestion(supabaseUrl, {
          restaurantId: restaurant.id,
          triggerType: "meal_period",
          triggerReason: "Lunch is approaching — drive midday traffic",
          promoStyle: "lunch",
        });
        results.push({ restaurant: restaurant.name, trigger: "meal_period_lunch", result: res });
        continue;
      }

      if (isDinnerWindow && (service === "dinner" || service === "both")) {
        const res = await callCreateSuggestion(supabaseUrl, {
          restaurantId: restaurant.id,
          triggerType: "meal_period",
          triggerReason: "Dinner is coming up — fill tonight's tables",
          promoStyle: "special",
        });
        results.push({ restaurant: restaurant.name, trigger: "meal_period_dinner", result: res });
        continue;
      }
    }

    return new Response(
      JSON.stringify({ checked: restaurants.length, triggered: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("check-rules error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function callCreateSuggestion(supabaseUrl: string, body: any) {
  try {
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const res = await fetch(`${supabaseUrl}/functions/v1/create-suggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}
