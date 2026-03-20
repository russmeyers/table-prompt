import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Utensils, Send, Loader2, Sparkles } from "lucide-react";
import { useOfferTemplates, useRestaurant, useContacts, useCreateCampaign } from "@/hooks/use-data";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function EmergencySend() {
  const navigate = useNavigate();
  const { data: restaurant } = useRestaurant();
  const { data: contacts } = useContacts(restaurant?.id);
  const { data: templates, isLoading: tplLoading } = useOfferTemplates();
  const createCampaign = useCreateCampaign();

  const [step, setStep] = useState<"meal" | "offer" | "review">("meal");
  const [meal, setMeal] = useState("");
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);

  const optedIn = (contacts ?? []).filter(c => c.opted_in && !c.opted_out).length;

  const handleSelectMeal = (m: string) => {
    setMeal(m);
    setStep("offer");
  };

  const handleSelectOffer = async (tpl: { title: string; example_message: string }) => {
    const filled = tpl.example_message
      .replace("{restaurant}", restaurant?.name ?? "our restaurant")
      .replace("{code}", "SLOW25");
    setMessage(filled);
    setStep("review");
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-campaign", {
        body: {
          action: "generate",
          restaurantName: restaurant?.name,
          restaurantType: restaurant?.type,
          timeContext: `${meal.toLowerCase()} today — we're slow right now`,
          triggerReason: "Restaurant is slow, need to fill seats quickly",
          promoStyle: "special",
        },
      });
      if (error) throw error;
      if (data?.message) {
        setMessage(data.message);
        setStep("review");
      }
    } catch {
      toast.error("AI generation failed — pick a template instead");
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!restaurant) return;
    setSending(true);
    try {
      const campaign = await createCampaign.mutateAsync({
        restaurant_id: restaurant.id,
        title: `Quick Send — ${meal}`,
        message_body: message + "\n\nReply STOP to unsubscribe",
        status: "sending",
        target_count: optedIn,
        estimated_cost: optedIn * 0.01,
      });

      const { error } = await supabase.functions.invoke("send-sms", {
        body: { action: "send_campaign", campaignId: campaign.id },
      });
      if (error) throw error;

      toast.success("Campaign sent!", { description: `Message sent to ${optedIn.toLocaleString()} guests.` });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      toast.error("Failed to send", { description: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-2xl py-8">
        <ScrollReveal>
          <button onClick={() => navigate(-1)} className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive">
              <Flame className="h-5 w-5 text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Quick Send</h1>
              <p className="text-sm text-muted-foreground">Get a campaign out in under 30 seconds</p>
            </div>
          </div>
        </ScrollReveal>

        {step === "meal" && (
          <ScrollReveal delay={80}>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground">Which meal are you filling seats for?</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {["Lunch", "Dinner"].map(m => (
                  <button
                    key={m}
                    onClick={() => handleSelectMeal(m)}
                    className="rounded-xl border border-border bg-card p-6 text-left shadow-card transition-all hover:shadow-card-hover hover:border-primary active:scale-[0.97]"
                  >
                    <Utensils className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 font-semibold text-foreground">{m}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{m === "Lunch" ? "Drive traffic from 11am–2pm" : "Fill seats for tonight"}</p>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {step === "offer" && (
          <ScrollReveal delay={80}>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground">Pick an offer for {meal.toLowerCase()}</h2>

              {/* AI generate option */}
              <button
                onClick={handleGenerateAI}
                disabled={generating}
                className="mt-4 w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 text-left transition-all hover:border-primary/60 active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  {generating ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Sparkles className="h-5 w-5 text-primary" />}
                  <h3 className="font-medium text-foreground">{generating ? "Generating..." : "Let AI write it for you"}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Generate a custom message based on your restaurant</p>
              </button>

              <div className="mt-4 space-y-3">
                {tplLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : (
                  (templates ?? []).map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectOffer(tpl)}
                      className="w-full rounded-xl border border-border bg-card p-5 text-left shadow-card transition-all hover:shadow-card-hover hover:border-primary active:scale-[0.97]"
                    >
                      <h3 className="font-medium text-foreground">{tpl.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{tpl.description}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </ScrollReveal>
        )}

        {step === "review" && (
          <ScrollReveal delay={80}>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground">Review and send</h2>
              <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-card">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background p-4 text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{message.length} characters</span>
                  <span>{optedIn.toLocaleString()} guests · Est. ${(optedIn * 0.01).toFixed(2)}</span>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="accent" size="lg" onClick={handleSend} disabled={sending}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send Now
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setStep("offer")}>Back</Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
      </main>
    </div>
  );
}
