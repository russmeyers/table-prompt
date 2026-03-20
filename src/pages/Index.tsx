import { LandingNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Check, MessageSquare, ShieldCheck, Utensils, Users, BarChart3, ArrowRight, CloudRain, Clock, CalendarDays, ChevronDown, Zap } from "lucide-react";
import { mockPricingPlans } from "@/lib/mock-data";
import { useState } from "react";

function Hero() {
  return (
    <section className="pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className="animate-reveal-up text-4xl font-bold tracking-tight text-foreground md:text-5xl"
            style={{ lineHeight: "1.12" }}
          >
            Know exactly when to text your guests
          </h1>
          <p
            className="animate-reveal-up stagger-1 mx-auto mt-5 max-w-lg text-base text-muted-foreground md:text-lg"
            style={{ lineHeight: "1.65" }}
          >
            Smart campaign suggestions based on timing, weather, and slow nights.
            Review, edit, and approve before anything goes out.
          </p>
          <div className="animate-reveal-up stagger-2 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/onboarding">Start Free Trial <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/dashboard">See Demo</Link>
            </Button>
          </div>
          <p className="animate-reveal-up stagger-3 mt-3 text-sm text-muted-foreground">
            No credit card required · Set up in 5 minutes
          </p>
        </div>

        {/* SMS preview */}
        <div className="animate-reveal-up stagger-4 mx-auto mt-16 max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Owner SMS Preview
            </p>
            <div className="space-y-2.5">
              {[
                { icon: CloudRain, text: "Rain tonight. Want to send a comfort food promo to 842 guests?" },
                { icon: Clock, text: "Haven't texted guests in 5 days. Send a Tuesday dinner offer?" },
                { icon: CalendarDays, text: "Friday lunch is coming. Send your usual lunch promo?" },
              ].map((msg, i) => (
                <div key={i} className="flex gap-3 rounded-lg bg-secondary/60 px-3 py-2.5">
                  <msg.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm text-foreground leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: MessageSquare, title: "Smart Suggestions", description: "Recommendations based on weather, timing, and guest engagement." },
    { icon: ShieldCheck, title: "You Approve Everything", description: "Nothing goes out without your say-so. Review, edit, or skip." },
    { icon: Utensils, title: "Restaurant-Ready Offers", description: "Pre-built templates designed for restaurants, not generic marketing." },
    { icon: Users, title: "Grow Your List", description: "QR codes, signup pages, and keyword opt-ins to build your guest list." },
    { icon: Zap, title: "Send in Seconds", description: "Slow night? One button, pick an offer, text your guests instantly." },
    { icon: BarChart3, title: "Simple Results", description: "Clear stats on sends, redemptions, and estimated revenue." },
  ];

  return (
    <section id="features" className="border-t border-border/60 bg-card py-20 md:py-24">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl" style={{ lineHeight: "1.2" }}>
            Everything you need to fill seats
          </h2>
        </ScrollReveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 70}>
              <div className="rounded-xl border border-border bg-background p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Add your restaurant", description: "Tell us your slow days, promo style, and restaurant details." },
    { title: "Get smart suggestions", description: "We recommend campaigns based on weather, timing, and engagement." },
    { title: "Approve your first message", description: "Read the text, edit if you want, and approve — from your phone." },
    { title: "Start bringing customers in", description: "Your message goes out. Track results on your dashboard." },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-24">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl" style={{ lineHeight: "1.2" }}>
            Set it up in minutes. See results fast.
          </h2>
        </ScrollReveal>
        <div className="mx-auto mt-12 grid max-w-2xl gap-6">
          {steps.map((s, i) => (
            <ScrollReveal key={i} delay={i * 90}>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    "It reminds me when I should actually send something.",
    "I don't have to think — it's already written.",
    "I can fill a slow night in minutes.",
  ];

  return (
    <section className="border-t border-border/60 bg-card py-16 md:py-20">
      <div className="container">
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <blockquote className="rounded-xl border border-border bg-background p-5 shadow-card">
                <p className="text-sm italic leading-relaxed text-foreground">"{q}"</p>
                <p className="mt-3 text-xs text-muted-foreground">— Restaurant Owner</p>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-24">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl" style={{ lineHeight: "1.2" }}>
            Simple pricing that helps you fill seats
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            No complicated tools. No marketing experience needed.
          </p>
        </ScrollReveal>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockPricingPlans.map((plan, i) => (
            <ScrollReveal key={plan.id} delay={i * 80}>
              <div className={`relative flex h-full flex-col rounded-xl border p-5 ${plan.popular ? "border-accent bg-card shadow-elevated" : "border-border bg-card shadow-card"}`}>
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[11px] font-semibold text-accent-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-foreground tabular-nums">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.tagline && (
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{plan.tagline}</p>
                )}
                <Button variant={plan.popular ? "accent" : "outline"} className="mt-4 w-full" size="sm" asChild>
                  <Link to="/onboarding">Start Free Trial</Link>
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <p className="mx-auto mt-8 max-w-md text-center text-sm text-muted-foreground">
            Need more texts? Just <strong className="text-foreground">$0.03 per additional message</strong>. No hidden fees.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ValueProp() {
  return (
    <section className="border-t border-border/60 bg-card py-16 md:py-20">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-lg text-center">
          <h2 className="text-xl font-bold text-foreground md:text-2xl" style={{ lineHeight: "1.25" }}>
            This isn't just texting software
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            It's a system that tells you when to send, writes it for you,
            and helps you fill seats on slow days.
          </p>
          <Button variant="hero" size="lg" className="mt-8" asChild>
            <Link to="/onboarding">Start Free Trial <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Do I need any technical setup?", a: "No. Sign up, add your restaurant details, and start sending. We handle everything." },
    { q: "Can I control what gets sent?", a: "Absolutely. Nothing goes out without your approval. Review, edit, or skip any campaign." },
    { q: "How do guests opt in?", a: "Through a QR code, your signup page, or a text keyword. All fully compliant." },
    { q: "What if I'm too busy to check?", a: "We send you a text with the suggestion. Approve in seconds from your phone." },
    { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees." },
  ];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl" style={{ lineHeight: "1.2" }}>
            Questions? We've got answers.
          </h2>
        </ScrollReveal>
        <div className="mx-auto mt-10 max-w-xl space-y-2">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 50}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full rounded-lg border border-border bg-card p-4 text-left shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
                </div>
                {open === i && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>}
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card py-10">
      <div className="container flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <MessageSquare className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">TableText</span>
        </div>
        <p className="text-xs text-muted-foreground">© 2025 TableText. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <ValueProp />
      <FAQ />
      <Footer />
    </div>
  );
}
