import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CreateSuggestionRequest {
  restaurantId: string;
  triggerType: string;
  triggerReason: string;
  promoStyle?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const textbeltKey = Deno.env.get("TEXTBELT_API_KEY");
    const supabase = createClient(supabaseUrl, serviceKey);

    const body: CreateSuggestionRequest = await req.json();
    const { restaurantId, triggerType, triggerReason, promoStyle } = body;

    if (!restaurantId || !triggerType || !triggerReason) {
      return new Response(
        JSON.stringify({ error: "restaurantId, triggerType, and triggerReason are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Get restaurant info
    const { data: restaurant, error: restErr } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId)
      .single();
    if (restErr || !restaurant) {
      return new Response(
        JSON.stringify({ error: "Restaurant not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Count opted-in contacts
    const { count: contactCount } = await supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      .eq("opted_in", true)
      .eq("opted_out", false);

    const targetCount = contactCount ?? 0;

    // 3. Generate AI message
    let title = `${triggerReason}`;
    let message = "";
    let description = "";

    try {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a restaurant SMS copywriter. Write short, warm, actionable text messages. Rules: 160-300 chars, clear CTA, friendly tone, 1-2 emojis max, no generic AI phrasing. Return JSON with title, message, description fields.`,
            },
            {
              role: "user",
              content: `Generate an SMS campaign for:\nRestaurant: ${restaurant.name}\nType: ${restaurant.type || "restaurant"}\nReason: ${triggerReason}\nPromo style: ${promoStyle || "special"}`,
            },
          ],
          tools: [{
            type: "function",
            function: {
              name: "campaign_result",
              description: "Return the generated campaign",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  message: { type: "string" },
                  description: { type: "string" },
                },
                required: ["title", "message", "description"],
                additionalProperties: false,
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "campaign_result" } },
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall?.function?.arguments) {
          const parsed = JSON.parse(toolCall.function.arguments);
          title = parsed.title || title;
          message = parsed.message || "";
          description = parsed.description || "";
        }
      }
    } catch (e) {
      console.error("AI generation failed, using fallback:", e);
    }

    // Fallback if AI didn't produce a message
    if (!message) {
      message = `Hey! ${triggerReason} Stop by ${restaurant.name} today for something special. Show this text for a surprise treat!`;
    }

    // 4. Create suggestion in DB
    const now = new Date().toISOString();
    const workflow = [{ step: "suggestion_created", timestamp: now }];

    const { data: suggestion, error: sugErr } = await supabase
      .from("campaign_suggestions")
      .insert({
        restaurant_id: restaurantId,
        title,
        trigger_type: triggerType,
        suggestion_reason: triggerReason,
        recommended_message: message,
        recommended_send_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
        target_count: targetCount,
        status: "pending",
        workflow,
      })
      .select()
      .single();

    if (sugErr) {
      return new Response(
        JSON.stringify({ error: "Failed to create suggestion", detail: sugErr.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Notify owner via SMS
    let notifyResult = { success: false, error: "No phone configured" };
    const ownerPhone = restaurant.phone;

    if (ownerPhone && textbeltKey) {
      // Build secure review link using the app URL
      const appUrl = Deno.env.get("APP_URL") || `${supabaseUrl.replace('.supabase.co', '')}`; 
      // For now, use a relative path approach - the owner gets the link pattern
      const reviewPath = `/campaigns/review/${suggestion.id}`;

      const smsBody = `TableText: ${triggerReason}\n\n"${title}"\n${targetCount} guests ready.\n\nReview & send: ${reviewPath}\n\nReply SKIP to dismiss.`;

      try {
        const smsRes = await fetch("https://textbelt.com/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: ownerPhone, message: smsBody, key: textbeltKey }),
        });
        const smsData = await smsRes.json();
        notifyResult = { success: smsData.success, error: smsData.error };
      } catch (e) {
        notifyResult = { success: false, error: String(e) };
      }

      // Log notification
      await supabase.from("notification_logs").insert({
        restaurant_id: restaurantId,
        suggestion_id: suggestion.id,
        notification_type: "sms",
        destination: ownerPhone,
        message_body: smsBody,
        status: notifyResult.success ? "sent" : "failed",
      });

      // Update workflow
      const updatedWorkflow = [
        ...workflow,
        {
          step: "owner_notified",
          timestamp: new Date().toISOString(),
          note: notifyResult.success ? `SMS sent to ${ownerPhone}` : `Failed: ${notifyResult.error}`,
        },
      ];
      await supabase
        .from("campaign_suggestions")
        .update({ status: "notified", workflow: updatedWorkflow })
        .eq("id", suggestion.id);
    }

    return new Response(
      JSON.stringify({
        suggestion: { id: suggestion.id, title, status: "notified" },
        notification: notifyResult,
        targetCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-suggestion error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
