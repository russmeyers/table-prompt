import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Utensils, Send } from "lucide-react";
import { mockOfferTemplates } from "@/lib/mock-data";
import { toast } from "sonner";

export default function EmergencySend() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"meal" | "offer" | "review">("meal");
  const [meal, setMeal] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [message, setMessage] = useState("");

  const handleSelectMeal = (m: string) => {
    setMeal(m);
    setStep("offer");
  };

  const handleSelectOffer = (tpl: typeof mockOfferTemplates[0]) => {
    setSelectedTemplate(tpl.id);
    setMessage(tpl.exampleMessage.replace("{restaurant}", "Bella's Italian Kitchen").replace("{code}", "SLOW25"));
    setStep("review");
  };

  const handleSend = () => {
    toast.success("Campaign sent!", { description: "Your message is on its way to 842 guests." });
    setTimeout(() => navigate("/dashboard"), 1500);
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
              <div className="mt-4 space-y-3">
                {mockOfferTemplates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectOffer(tpl)}
                    className="w-full rounded-xl border border-border bg-card p-5 text-left shadow-card transition-all hover:shadow-card-hover hover:border-primary active:scale-[0.97]"
                  >
                    <h3 className="font-medium text-foreground">{tpl.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{tpl.description}</p>
                  </button>
                ))}
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
                  <span>842 guests</span>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="accent" size="lg" onClick={handleSend}>
                    <Send className="h-4 w-4" /> Send Now
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
