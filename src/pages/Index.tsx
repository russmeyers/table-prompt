import { LandingNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { MessageSquare, ArrowRight, CloudRain, Clock, CalendarDays, ChevronLeft, ChevronRight, ChevronDown, ShieldCheck, Utensils, Users, Zap, BarChart3 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const CTA_TEXT = "See How It Works";
const CTA_PATH = "/onboarding";

function Hero() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className="animate-reveal-up text-4xl font-bold tracking-tight text-foreground md:text-5xl"
            style={{ lineHeight: "1.1", textWrap: "balance" }}
          >
            Fill more seats on slow nights
          </h1>
          <p
            className="animate-reveal-up stagger-1 mx-auto mt-5 max-w-md text-base text-muted-foreground"
            style={{ lineHeight: "1.7", textWrap: "pretty" }}
          >
            TableText tells you when to send, writes the message, and lets you approve it from your phone. No marketing experience needed.
          </p>
          <div className="animate-reveal-up stagger-2 mt-8">
            <Button variant="hero" size="xl" asChild>
              <Link to={CTA_PATH}>{CTA_TEXT} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <p className="animate-reveal-up stagger-3 mt-3 text-sm text-muted-foreground">
            No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const quotes = [
    { text: "It reminds me when I should actually send something.", name: "Sarah K.", role: "Owner, The Brick Oven" },
    { text: "I don't have to think — it's already written.", name: "Marco R.", role: "GM, Bella Vista" },
    { text: "I can fill a slow night in minutes.", name: "Tanya L.", role: "Owner, Soul & Smoke BBQ" },
  ];

  return (
    <section className="border-t border-border/60 py-14">
      <div className="container">
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="text-center">
                <p className="text-sm italic text-foreground leading-relaxed">"{q.text}"</p>
                <p className="mt-2 text-xs font-medium text-foreground">{q.name}</p>
                <p className="text-xs text-muted-foreground">{q.role}</p>
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
    { num: "1", title: "Add your restaurant", desc: "Tell us your slow days and what kind of promos you like." },
    { num: "2", title: "Get smart suggestions", desc: "We recommend campaigns based on weather, timing, and your calendar." },
    { num: "3", title: "Approve from your phone", desc: "Read it, edit if you want, hit send — all via text message." },
  ];

  return (
    <section id="how-it-works" className="border-t border-border/60 py-20 md:py-24">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl" style={{ lineHeight: "1.2", textWrap: "balance" }}>
            Set it up in minutes
          </h2>
        </ScrollReveal>
        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-8 md:flex-row md:gap-12">
          {steps.map((s, i) => (
            <ScrollReveal key={i} delay={i * 100} className="flex-1 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {s.num}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCarousel() {
  const features = [
    { icon: MessageSquare, title: "Smart Suggestions", desc: "Get campaign ideas based on weather, timing, and guest engagement — no guesswork." },
    { icon: ShieldCheck, title: "You Approve Everything", desc: "Nothing goes out without your say-so. Review, edit, or skip any message." },
    { icon: Utensils, title: "Restaurant-Ready Offers", desc: "Pre-built templates designed for restaurants, not generic marketing software." },
    { icon: Users, title: "Grow Your List", desc: "QR codes, signup pages, and keyword opt-ins to build your guest list." },
    { icon: Zap, title: "Send in Seconds", desc: "Slow night? One button, pick an offer, text your guests instantly." },
    { icon: BarChart3, title: "Simple Results", desc: "Clear stats on sends, redemptions, and estimated revenue — nothing complicated." },
  ];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(i => (i + 1) % features.length), [features.length]);
  const prev = useCallback(() => setCurrent(i => (i - 1 + features.length) % features.length), [features.length]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [paused, next]);

  const f = features[current];

  return (
    <section id="features" className="border-t border-border/60 py-20 md:py-24">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl" style={{ lineHeight: "1.2", textWrap: "balance" }}>
            Everything you need to fill seats
          </h2>
        </ScrollReveal>

        <div
          className="mx-auto mt-12 max-w-md"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative rounded-xl border border-border bg-card p-8 shadow-card min-h-[180px] transition-all duration-500">
            <div key={current} className="animate-reveal-up text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={prev}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:scale-95"
              aria-label="Previous feature"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"}`}
                  aria-label={`Go to feature ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:scale-95"
              aria-label="Next feature"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
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
    <section className="border-t border-border/60 py-20 md:py-24">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl" style={{ lineHeight: "1.2" }}>
            Questions?
          </h2>
        </ScrollReveal>
        <div className="mx-auto mt-10 max-w-xl space-y-2">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 50}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full rounded-lg border border-border bg-card p-4 text-left transition-shadow hover:shadow-card"
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

function FinalCTA() {
  return (
    <section className="border-t border-border/60 py-20 md:py-24">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-bold text-foreground md:text-2xl" style={{ lineHeight: "1.25", textWrap: "balance" }}>
            Start simple. See results fast.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Set it up in minutes. Approve your first message. Start bringing customers in today.
          </p>
          <Button variant="hero" size="lg" className="mt-8" asChild>
            <Link to={CTA_PATH}>{CTA_TEXT} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">No contracts · No marketing experience needed</p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="container flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <MessageSquare className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">TableText</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/login" className="hover:text-foreground transition-colors">Log In</Link>
        </div>
        <p className="text-xs text-muted-foreground">© 2025 TableText. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <FeatureCarousel />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
