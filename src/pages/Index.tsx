import { LandingNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Check, MessageSquare, ShieldCheck, Utensils, Users, BarChart3, ArrowRight, CloudRain, Clock, CalendarDays, ChevronDown } from "lucide-react";
import { mockPricingPlans } from "@/lib/mock-data";
import { useState } from "react";

function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-reveal-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-card">
              <Utensils className="h-3.5 w-3.5" />
              Built for restaurant owners
            </div>
          </div>
          <h1 className="animate-reveal-up stagger-1 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl" style={{ lineHeight: "1.1" }}>
            Know exactly when to text your guests
          </h1>
          <p className="animate-reveal-up stagger-2 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl" style={{ lineHeight: "1.6" }}>
            Get smart campaign suggestions based on timing, weather, and slow nights. Review, edit, and approve before anything goes out.
          </p>
          <div className="animate-reveal-up stagger-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/onboarding">Start Free Trial <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/dashboard">See Demo</Link>
            </Button>
          </div>
          <p className="animate-reveal-up stagger-4 mt-4 text-sm text-muted-foreground">No credit card required · Set up in 5 minutes</p>
        </div>

        {/* Phone mockup with SMS examples */}
        <div className="animate-reveal-up stagger-5 mx-auto mt-16 max-w-md">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Owner SMS Preview</p>
            <div className="space-y-3">
              {[
                { icon: CloudRain, text: "Rain tonight at 6pm. Want to send a comfort food promo to 842 guests?", time: "2:30 PM" },
                { icon: Clock, text: "You haven't texted guests in 5 days. Want to send a Tuesday dinner offer?", time: "9:00 AM" },
                { icon: CalendarDays, text: "Friday lunch is coming. Send your usual lunch promo?", time: "Thu 4:00 PM" },
              ].map((msg, i) => (
                <div key={i} className="flex gap-3 rounded-lg bg-secondary/60 p-3">
                  <msg.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground leading-relaxed">{msg.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{msg.time}</p>
                  </div>
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
    { icon: MessageSquare, title: "Smart Campaign Suggestions", description: "Get recommendations based on weather, day of week, and how long it's been since your last text." },
    { icon: ShieldCheck, title: "Owner Approval Before Sending", description: "Nothing goes out without your say-so. Review, edit, or skip any campaign." },
    { icon: Utensils, title: "Restaurant-Specific Promotions", description: "Pre-built offer templates designed for restaurants — not generic marketing." },
    { icon: Users, title: "Easy Subscriber Growth", description: "QR codes, signup pages, and keyword opt-ins to grow your guest list." },
    { icon: BarChart3, title: "Simple Results Dashboard", description: "See what's working with clear stats on sends, redemptions, and estimated revenue." },
    { icon: Clock, title: "Send in 30 Seconds", description: "Slow night? Hit one button, pick an offer, and send a text to your guests instantly." },
  ];

  return (
    <section id="features" className="border-t border-border/60 bg-card py-20 md:py-28">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ lineHeight: "1.15" }}>
            Everything you need to fill seats
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple restaurant texting, without the clutter.
          </p>
        </ScrollReveal>
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80}>
              <div className="group rounded-xl border border-border bg-background p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
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
    { num: "1", title: "Add your restaurant details", description: "Tell us about your restaurant, slow days, and what kind of promos you like." },
    { num: "2", title: "Get smart suggestions", description: "We'll recommend campaigns based on weather, timing, and when you last texted." },
    { num: "3", title: "Review and approve", description: "Read the suggested text, edit if you want, and approve it — by text or on the web." },
    { num: "4", title: "Send to your guests", description: "Your message goes out to opted-in subscribers. Track results on your dashboard." },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ lineHeight: "1.15" }}>
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Four steps from signup to sending your first campaign.</p>
        </ScrollReveal>
        <div className="mx-auto mt-14 grid max-w-3xl gap-8">
          {steps.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 100}>
              <div className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60 bg-card py-20 md:py-28">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ lineHeight: "1.15" }}>
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade when you're ready.</p>
        </ScrollReveal>
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3">
          {mockPricingPlans.map((plan, i) => (
            <ScrollReveal key={plan.id} delay={i * 100}>
              <div className={`relative rounded-xl border p-6 ${plan.popular ? "border-accent bg-background shadow-elevated" : "border-border bg-background shadow-card"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-accent-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-foreground tabular-nums">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{plan.textsIncluded.toLocaleString()} texts included · ${plan.overageRate}/extra</p>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? "accent" : "outline"} className="mt-6 w-full" asChild>
                  <Link to="/onboarding">Get Started</Link>
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Do I need any technical setup?", a: "No. Sign up, add your restaurant details, and start sending. We handle everything else." },
    { q: "Can I control what gets sent?", a: "Absolutely. Nothing goes out without your approval. You can review, edit, or skip any campaign." },
    { q: "How do guests opt in?", a: "Through a QR code at your restaurant, your signup page, or a text keyword. All fully compliant." },
    { q: "What if I'm too busy to check?", a: "We send you a text with the suggestion. You can approve in seconds right from your phone." },
    { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees. You can downgrade or cancel at any time." },
  ];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ lineHeight: "1.15" }}>
            Questions? We've got answers.
          </h2>
        </ScrollReveal>
        <div className="mx-auto mt-12 max-w-2xl space-y-2">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full rounded-lg border border-border bg-card p-4 text-left shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
                </div>
                {open === i && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>}
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
    <footer className="border-t border-border/60 bg-card py-12">
      <div className="container flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <MessageSquare className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">TableText</span>
        </div>
        <p className="text-sm text-muted-foreground">Simple restaurant texting, without the clutter.</p>
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
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
