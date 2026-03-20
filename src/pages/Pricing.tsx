import { LandingNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { mockPricingPlans } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Check, MessageSquare } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="container py-16">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ lineHeight: "1.15" }}>
            Simple pricing for every restaurant
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">No contracts. No hidden fees. Cancel anytime.</p>
        </ScrollReveal>
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3">
          {mockPricingPlans.map((plan, i) => (
            <ScrollReveal key={plan.id} delay={i * 100}>
              <div className={`relative rounded-xl border p-6 ${plan.popular ? "border-accent bg-card shadow-elevated" : "border-border bg-card shadow-card"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-accent-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-foreground tabular-nums">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.textsIncluded.toLocaleString()} texts included</p>
                <p className="text-xs text-muted-foreground">${plan.overageRate}/text overage</p>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? "accent" : "outline"} className="mt-6 w-full" asChild>
                  <Link to="/onboarding">Start Free Trial</Link>
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>
      <footer className="border-t border-border/60 bg-card py-8">
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
