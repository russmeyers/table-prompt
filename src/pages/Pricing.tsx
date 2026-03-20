import { LandingNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { mockPricingPlans } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Check, MessageSquare, ArrowRight } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="container py-20">
        <ScrollReveal className="mx-auto max-w-xl text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
            style={{ lineHeight: "1.15" }}
          >
            Simple pricing that helps you fill seats
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            No complicated tools. No marketing experience needed. Just smart
            reminders, ready-to-send texts, and more customers when you need them.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockPricingPlans.map((plan, i) => (
            <ScrollReveal key={plan.id} delay={i * 80}>
              <div
                className={`relative flex h-full flex-col rounded-xl border p-5 ${
                  plan.popular
                    ? "border-accent bg-card shadow-elevated"
                    : "border-border bg-card shadow-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[11px] font-semibold text-accent-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-foreground tabular-nums">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.tagline && (
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    {plan.tagline}
                  </p>
                )}
                <Button
                  variant={plan.popular ? "accent" : "outline"}
                  className="mt-4 w-full"
                  size="sm"
                  asChild
                >
                  <Link to="/onboarding">Start Free Trial</Link>
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mx-auto mt-12 max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-card">
            <p className="text-sm font-semibold text-foreground">Simple, Transparent Overage</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Need more texts? Just <strong className="text-foreground">$0.03 per additional message</strong>. No hidden fees, no surprises.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <div className="mx-auto mt-16 grid max-w-3xl gap-5 md:grid-cols-3">
          {[
            "It reminds me when I should actually send something.",
            "I don't have to think — it's already written.",
            "I can fill a slow night in minutes.",
          ].map((q, i) => (
            <ScrollReveal key={i} delay={i * 70}>
              <blockquote className="rounded-xl border border-border bg-card p-5 shadow-card">
                <p className="text-sm italic leading-relaxed text-foreground">"{q}"</p>
                <p className="mt-3 text-xs text-muted-foreground">— Restaurant Owner</p>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>

        {/* Value prop + CTA */}
        <ScrollReveal className="mx-auto mt-16 max-w-lg text-center">
          <h2 className="text-xl font-bold text-foreground md:text-2xl" style={{ lineHeight: "1.25" }}>
            This isn't just texting software
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            It's a system that tells you when to send, writes it for you, and helps you fill seats on slow days.
          </p>
          <Button variant="hero" size="lg" className="mt-8" asChild>
            <Link to="/onboarding">Start Free Trial <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </ScrollReveal>
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
