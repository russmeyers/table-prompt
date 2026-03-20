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
      .select("id, name, type, slow_days, meal_service, phone, timezone");

    if (!restaurants || restaurants.length === 0) {
      return new Response(JSON.stringify({ message: "No restaurants to check" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];
    const now = new Date();

    for (const restaurant of restaurants) {
      // Use restaurant timezone for day/hour calc
      const tz = restaurant.timezone || "America/New_York";
      const localTime = new Date(now.toLocaleString("en-US", { timeZone: tz }));
      const dayName = localTime.toLocaleDateString("en-US", { weekday: "long" });
      const hour = localTime.getHours();

      // Skip if already has a pending/notified suggestion today
      const todayStart = new Date(localTime.getFullYear(), localTime.getMonth(), localTime.getDate()).toISOString();
      const { data: existing } = await supabase
        .from("campaign_suggestions")
        .select("id")
        .eq("restaurant_id", restaurant.id)
        .in("status", ["pending", "notified", "in_review"])
        .gte("created_at", todayStart)
        .limit(1);

      if (existing && existing.length > 0) continue;

      // === RULE 1: Calendar events within next 3 days ===
      const threeDaysOut = new Date(localTime);
      threeDaysOut.setDate(threeDaysOut.getDate() + 3);
      const todayStr = localTime.toISOString().split("T")[0];
      const futureStr = threeDaysOut.toISOString().split("T")[0];

      const { data: upcomingEvents } = await supabase
        .from("calendar_events")
        .select("id, name, event_date, description")
        .gte("event_date", todayStr)
        .lte("event_date", futureStr)
        .is("suggested_campaign_id", null)
        .limit(1);

      if (upcomingEvents && upcomingEvents.length > 0) {
        const event = upcomingEvents[0];
        const res = await callCreateSuggestion(supabaseUrl, {
          restaurantId: restaurant.id,
          triggerType: "calendar_event",
          triggerReason: `${event.name} is coming up on ${event.event_date} — perfect time for a themed promotion`,
          promoStyle: "event",
        });
        // Link event to suggestion
        if (res?.suggestion?.id) {
          await supabase.from("calendar_events").update({ suggested_campaign_id: res.suggestion.id }).eq("id", event.id);
        }
        results.push({ restaurant: restaurant.name, trigger: "calendar_event", event: event.name, result: res });
        continue;
      }

      // === RULE 2: Weather trigger (free Open-Meteo API, no key needed) ===
      if (hour >= 8 && hour <= 12) {
        try {
          // Use a default US location; in production, store lat/lon per restaurant
          const weatherRes = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&hourly=weathercode,temperature_2m&timezone=America/New_York&forecast_days=1"
          );
          if (weatherRes.ok) {
            const weatherData = await weatherRes.json();
            const codes = weatherData.hourly?.weathercode ?? [];
            const temps = weatherData.hourly?.temperature_2m ?? [];
            // Check evening hours (17-21) for bad weather
            const eveningCodes = codes.slice(17, 22);
            const eveningTemps = temps.slice(17, 22);
            const hasRain = eveningCodes.some((c: number) => c >= 51 && c <= 82); // drizzle, rain, showers
            const hasSnow = eveningCodes.some((c: number) => c >= 71 && c <= 77);
            const isCold = eveningTemps.some((t: number) => t < 2); // below ~35°F
            const isHot = eveningTemps.some((t: number) => t > 35); // above ~95°F

            let weatherReason = "";
            let promoStyle = "special";
            if (hasRain) {
              weatherReason = "Rain in the forecast tonight — comfort food promo could drive orders";
              promoStyle = "comfort";
            } else if (hasSnow) {
              weatherReason = "Snow expected tonight — warm up guests with a cozy dining deal";
              promoStyle = "comfort";
            } else if (isCold) {
              weatherReason = "Cold night ahead — perfect for a warm meal promotion";
              promoStyle = "comfort";
            } else if (isHot) {
              weatherReason = "Hot day today — promote cold drinks or patio specials";
              promoStyle = "special";
            }

            if (weatherReason) {
              const res = await callCreateSuggestion(supabaseUrl, {
                restaurantId: restaurant.id,
                triggerType: "weather",
                triggerReason: weatherReason,
                promoStyle,
              });
              results.push({ restaurant: restaurant.name, trigger: "weather", result: res });
              continue;
            }
          }
        } catch (e) {
          console.error("Weather check failed:", e);
          // Non-fatal, continue to other rules
        }
      }

      // === RULE 3: Inactivity — no campaign sent in 5+ days ===
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
        continue;
      }

      // === RULE 4: Slow day ===
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

      // === RULE 5: Meal period approaching ===
      const isLunchWindow = hour >= 9 && hour <= 10;
      const isDinnerWindow = hour >= 14 && hour <= 16;
      const service = restaurant.meal_service ?? "both";

      if (isLunchWindow && (service === "lunch" || service === "both")) {
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
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const res = await fetch(`${supabaseUrl}/functions/v1/create-suggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}
