const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateRequest {
  action: "generate" | "rewrite";
  // For generate
  restaurantType?: string;
  restaurantName?: string;
  timeContext?: string;
  triggerReason?: string;
  promoStyle?: string;
  // For rewrite
  currentMessage?: string;
  rewriteStyle?: "shorter" | "casual" | "urgent" | "friendly";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: GenerateRequest = await req.json();
    const { action } = body;

    let systemPrompt: string;
    let userPrompt: string;

    if (action === "generate") {
      systemPrompt = `You are a restaurant SMS copywriter. You write short, warm, actionable text messages for restaurants to send to their guests. Rules:
- Messages must be 160–300 characters
- Include a clear call to action
- Use a friendly, natural tone — not corporate or generic
- Avoid excessive emojis (1-2 max)
- Never use phrases like "Dear valued customer" or "We are pleased to"
- Sound like a real person at a restaurant talking to a regular
- Always include a specific offer or reason to visit

Return a JSON object with exactly these fields:
- title: a short campaign title (5-8 words)
- message: the SMS message text
- description: one sentence explaining this campaign`;

      userPrompt = `Generate an SMS campaign for:
Restaurant: ${body.restaurantName || "a local restaurant"}
Type: ${body.restaurantType || "casual dining"}
Time: ${body.timeContext || "tonight"}
Reason: ${body.triggerReason || "general promotion"}
Promo style: ${body.promoStyle || "special"}`;
    } else if (action === "rewrite") {
      if (!body.currentMessage) {
        return new Response(
          JSON.stringify({ error: "currentMessage is required for rewrite" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const styleGuide: Record<string, string> = {
        shorter: "Make this SMS shorter and punchier. Keep it under 160 characters. Preserve the core offer.",
        casual: "Rewrite this SMS to sound more casual and friendly, like a text from a friend. Keep the offer intact.",
        urgent: "Rewrite this SMS to create more urgency. Add time pressure or scarcity. Keep it honest.",
        friendly: "Rewrite this SMS to sound warmer and more personal. Like the restaurant owner texting a regular.",
      };

      systemPrompt = `You are a restaurant SMS copywriter. You rewrite text messages to match a requested style. Rules:
- Keep messages 160–300 characters
- Preserve the original offer/deal
- Don't add information that wasn't in the original
- Return ONLY a JSON object with a "message" field containing the rewritten text`;

      userPrompt = `${styleGuide[body.rewriteStyle || "shorter"]}

Original message: "${body.currentMessage}"`;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action. Use: generate, rewrite" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use tool calling for structured output
    const tools = action === "generate"
      ? [{
          type: "function" as const,
          function: {
            name: "campaign_result",
            description: "Return the generated campaign",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Short campaign title, 5-8 words" },
                message: { type: "string", description: "SMS message text, 160-300 characters" },
                description: { type: "string", description: "One sentence campaign description" },
              },
              required: ["title", "message", "description"],
              additionalProperties: false,
            },
          },
        }]
      : [{
          type: "function" as const,
          function: {
            name: "rewrite_result",
            description: "Return the rewritten message",
            parameters: {
              type: "object",
              properties: {
                message: { type: "string", description: "Rewritten SMS message, 160-300 characters" },
              },
              required: ["message"],
              additionalProperties: false,
            },
          },
        }];

    const toolChoice = action === "generate"
      ? { type: "function" as const, function: { name: "campaign_result" } }
      : { type: "function" as const, function: { name: "rewrite_result" } };

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: toolChoice,
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      // Fallback: try to parse content directly
      const content = aiData.choices?.[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ message: content }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      return new Response(JSON.stringify({ error: "No response from AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-campaign error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
