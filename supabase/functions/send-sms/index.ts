import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SendRequest {
  action: "notify_owner" | "send_campaign" | "estimate_cost" | "send_single";
  restaurantId?: string;
  campaignId?: string;
  suggestionId?: string;
  phone?: string;
  message?: string;
}

// ── Textbelt sender ──────────────────────────────────────
async function sendViaTextbelt(phone: string, message: string): Promise<{ success: boolean; textId?: string; error?: string }> {
  const apiKey = Deno.env.get("TEXTBELT_API_KEY");
  if (!apiKey) return { success: false, error: "TEXTBELT_API_KEY not configured" };

  const res = await fetch("https://textbelt.com/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, message, key: apiKey }),
  });
  const data = await res.json();
  return { success: data.success, textId: data.textId, error: data.error };
}

// ── Cost estimation ──────────────────────────────────────
function estimateCost(messageCount: number): number {
  // Textbelt: $0.01 per text on paid plans
  return Math.round(messageCount * 0.01 * 100) / 100;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SendRequest = await req.json();
    const { action } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── Estimate cost ────────────────────────────────────
    if (action === "estimate_cost") {
      const count = body.phone ? 1 : 0;
      // If campaignId provided, get target count
      if (body.campaignId) {
        const { data: campaign } = await supabase
          .from("campaigns")
          .select("target_count")
          .eq("id", body.campaignId)
          .single();
        return new Response(
          JSON.stringify({ cost: estimateCost(campaign?.target_count ?? 0) }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ cost: estimateCost(count) }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Send single SMS ──────────────────────────────────
    if (action === "send_single") {
      if (!body.phone || !body.message) {
        return new Response(
          JSON.stringify({ error: "phone and message required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const result = await sendViaTextbelt(body.phone, body.message);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Notify owner about a suggestion ──────────────────
    if (action === "notify_owner") {
      if (!body.restaurantId || !body.suggestionId) {
        return new Response(
          JSON.stringify({ error: "restaurantId and suggestionId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get restaurant + owner profile
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", body.restaurantId)
        .single();

      if (!restaurant) {
        return new Response(
          JSON.stringify({ error: "Restaurant not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get owner profile for phone number
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", restaurant.owner_user_id)
        .single();

      // Get the suggestion
      const { data: suggestion } = await supabase
        .from("campaign_suggestions")
        .select("*")
        .eq("id", body.suggestionId)
        .single();

      if (!suggestion) {
        return new Response(
          JSON.stringify({ error: "Suggestion not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Build the review link
      const appUrl = Deno.env.get("APP_URL") || "https://tabletext.app";
      const reviewLink = `${appUrl}/campaigns/review/${suggestion.id}`;

      // Build owner notification message
      const ownerMessage = `TableText: ${suggestion.suggestion_reason}\n\n"${suggestion.title}"\n\nReview: ${reviewLink}\n\nReply SKIP to dismiss.`;

      // Use restaurant phone as owner phone fallback
      const ownerPhone = restaurant.phone;
      if (!ownerPhone) {
        return new Response(
          JSON.stringify({ error: "No owner phone number configured" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await sendViaTextbelt(ownerPhone, ownerMessage);

      // Log the notification
      await supabase.from("notification_logs").insert({
        restaurant_id: body.restaurantId,
        suggestion_id: body.suggestionId,
        notification_type: "sms",
        destination: ownerPhone,
        message_body: ownerMessage,
        status: result.success ? "sent" : "failed",
      });

      // Update suggestion workflow
      const currentWorkflow = suggestion.workflow || [];
      const updatedWorkflow = [
        ...currentWorkflow,
        { step: "owner_notified", timestamp: new Date().toISOString(), note: result.success ? "SMS sent" : result.error },
      ];
      await supabase
        .from("campaign_suggestions")
        .update({ status: "notified", workflow: updatedWorkflow })
        .eq("id", body.suggestionId);

      return new Response(
        JSON.stringify({ success: result.success, textId: result.textId, error: result.error }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Send campaign to contacts ────────────────────────
    if (action === "send_campaign") {
      if (!body.campaignId) {
        return new Response(
          JSON.stringify({ error: "campaignId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: campaign } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", body.campaignId)
        .single();

      if (!campaign) {
        return new Response(
          JSON.stringify({ error: "Campaign not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get opted-in contacts for this restaurant
      const { data: contacts } = await supabase
        .from("contacts")
        .select("mobile_number")
        .eq("restaurant_id", campaign.restaurant_id)
        .eq("opted_in", true)
        .eq("opted_out", false);

      if (!contacts || contacts.length === 0) {
        return new Response(
          JSON.stringify({ error: "No opted-in contacts found" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Send to each contact
      let sentCount = 0;
      let failedCount = 0;

      for (const contact of contacts) {
        const result = await sendViaTextbelt(contact.mobile_number, campaign.message_body);
        if (result.success) sentCount++;
        else failedCount++;
      }

      // Log the send
      await supabase.from("campaign_sends").insert({
        campaign_id: body.campaignId,
        sent_count: sentCount,
        failed_count: failedCount,
        provider: "textbelt",
        provider_cost: estimateCost(sentCount),
      });

      // Update campaign status
      await supabase
        .from("campaigns")
        .update({ status: "sent", sent_at: new Date().toISOString(), target_count: contacts.length })
        .eq("id", body.campaignId);

      // Update suggestion workflow if linked
      if (campaign.suggestion_id) {
        const { data: suggestion } = await supabase
          .from("campaign_suggestions")
          .select("workflow")
          .eq("id", campaign.suggestion_id)
          .single();

        if (suggestion) {
          const updatedWorkflow = [
            ...(suggestion.workflow || []),
            { step: "sent", timestamp: new Date().toISOString(), note: `${sentCount} sent, ${failedCount} failed` },
          ];
          await supabase
            .from("campaign_suggestions")
            .update({ status: "sent", workflow: updatedWorkflow })
            .eq("id", campaign.suggestion_id);
        }
      }

      return new Response(
        JSON.stringify({ success: true, sentCount, failedCount, cost: estimateCost(sentCount) }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use: notify_owner, send_campaign, send_single, estimate_cost" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
