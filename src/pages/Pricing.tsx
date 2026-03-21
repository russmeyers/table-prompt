import { LandingNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link, useNavigate } from "react-router-dom";
import { Check, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { STRIPE_TIERS, type TierKey } from "@/lib/stripe-tiers";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const tierOrder: TierKey[] = ["starter", "launch", "growth", "pro"];

const tierFeatures: Record<TierKey, { features: string[]; tagline: string }> = {
  starter: {
    features: ["Up to 500 texts/month", "Smart campaign suggestions", "Easy 1-click sending", "QR code signup page", "Pre-built offer templates", "Simple performance dashboard"],
    tagline: "A simple way to stay consistent and start building your customer list.",
  },
  launch: {
    features: ["Up to 2,500 texts/month", "Everything in Starter, plus:", "AI-written text messages", "Smart reminders", "\"We're slow — send now\" button", "Basic redemption tracking"],
    tagline: "This is where most restaurants start seeing real results.",
  },
  growth: {
    features: ["Up to 6,000 texts/month", "Everything in Launch, plus:", "Optional auto-send campaigns", "Built-in campaign calendar", "Smarter timing suggestions", "Priority sending"],
    tagline: "Stay top of mind with your customers — without thinking about it.",
  },
  pro: {
    features: ["Up to 12,000 texts/month", "Everything in Growth, plus:", "Multi-location support", "Expanded offer library", "Simple performance insights", "\"Done-for-you\" campaign option"],
    tagline: "Scale your marketing without adding more work.",
  },
};

export default function PricingPage() {
  const { subscribed, tier: currentTier } = useSubscription();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);

  const handleCheckout = async (tierKey: TierKey) => {
    if (!userId) {
      navigate("/login?redirect=/pricing");
      return;
    }

    setLoadingTier(tierKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS[tierKey].price_id },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error("Checkout failed", { description: err.message });
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="container py-20">
        <ScrollReveal className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ lineHeight: "1.15", textWrap: "balance" }}>
            Simple pricing that helps you fill seats
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            No complicated tools. No marketing experience needed.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tierOrder.map((key, i) => {
            const tier = STRIPE_TIERS[key];
            const meta = tierFeatures[key];
            const isPopular = key === "launch";
            const isCurrent = subscribed && currentTier === key;

            return (
              <ScrollReveal key={key} delay={i * 80}>
                <div className={`relative flex h-full flex-col rounded-xl border p-5 ${
                  isCurrent ? "border-primary bg-card shadow-elevated ring-2 ring-primary/20" :
                  isPopular ? "border-accent bg-card shadow-elevated" :
                  "border-border bg-card shadow-card"
                }`}>
                  {isCurrent && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">
                      Your Plan
                    </div>
                  )}
                  {isPopular && !isCurrent && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[11px] font-semibold text-accent-foreground">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-base font-bold text-foreground">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground tabular-nums">${tier.price}</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  <ul className="mt-5 flex-1 space-y-2">
                    {meta.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{meta.tagline}</p>
                  <Button
                    variant={isPopular ? "accent" : "outline"}
                    className="mt-4 w-full"
                    size="sm"
                    disabled={isCurrent || loadingTier === key}
                    onClick={() => handleCheckout(key)}
                  >
                    {loadingTier === key ? <Loader2 className="h-4 w-4 animate-spin" /> : isCurrent ? "Current Plan" : "Get Started"}
                  </Button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal>
          <div className="mx-auto mt-12 max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-card">
            <p className="text-sm font-semibold text-foreground">Simple, Transparent Overage</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Need more texts? Just <strong className="text-foreground">$0.03 per additional message</strong>. No hidden fees.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-16 max-w-md text-center">
          <h2 className="text-xl font-bold text-foreground md:text-2xl" style={{ lineHeight: "1.25" }}>
            Start simple. See results fast.
          </h2>
          <Button variant="hero" size="lg" className="mt-6" asChild>
            <Link to="/onboarding">See How It Works <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </ScrollReveal>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="container flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
            <MessageSquare className="h-3 w-3 text-primary-foreground" />
          </div>
          © 2025 TableText
        </div>
      </footer>
    </div>
  );
}
