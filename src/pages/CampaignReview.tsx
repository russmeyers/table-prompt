import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { mockSuggestions } from "@/lib/mock-data";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Send, Clock, Save, SkipForward, Sparkles, Users, MessageSquare, Info } from "lucide-react";
import { toast } from "sonner";

export default function CampaignReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const suggestion = mockSuggestions.find(s => s.id === id) || mockSuggestions[0];
  const [message, setMessage] = useState(suggestion.recommendedMessage);
  const [redemptionCode, setRedemptionCode] = useState("COMFORT10");
  const charCount = message.length;
  const segments = Math.ceil(charCount / 160);
  const estCost = (suggestion.targetCount * 0.01 * segments).toFixed(2);

  const handleSend = () => {
    toast.success("Campaign sent!", { description: `Message sent to ${suggestion.targetCount.toLocaleString()} guests.` });
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const handleRewrite = (style: string) => {
    const rewrites: Record<string, string> = {
      shorter: "Rainy tonight 🍲 Free soup with any entrée. See you at Bella's!",
      casual: "Hey! It's pouring out there. Perfect excuse for comfort food. Free soup with dinner tonight at Bella's 🍲",
      urgent: "TONIGHT ONLY: Rainy night comfort special. Free soup with any entrée at Bella's. Don't miss it! 🍲",
    };
    setMessage(rewrites[style] || message);
    toast.success("Message rewritten", { description: `Style: ${style}` });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-4xl py-8">
        <ScrollReveal>
          <button onClick={() => navigate(-1)} className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to campaigns
          </button>
          <h1 className="text-2xl font-bold text-foreground">{suggestion.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review and approve before sending</p>
        </ScrollReveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main editor */}
          <ScrollReveal delay={80} className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <label className="block text-sm font-medium text-foreground">Message</label>
              <div className="relative mt-2">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-input bg-background p-4 text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{charCount} characters · {segments} segment{segments > 1 ? "s" : ""}</span>
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">AI Suggested</span>
                </div>
              </div>

              {/* AI rewrite buttons */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Quick Rewrite
                </p>
                <div className="flex flex-wrap gap-2">
                  {["shorter", "casual", "urgent"].map(style => (
                    <button
                      key={style}
                      onClick={() => handleRewrite(style)}
                      className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors active:scale-[0.97]"
                    >
                      Make it {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Redemption code */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground">Redemption Code</label>
                <input
                  value={redemptionCode}
                  onChange={e => setRedemptionCode(e.target.value)}
                  className="mt-1 w-full max-w-xs rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">Included in SMS: "Show this text or use code {redemptionCode}"</p>
              </div>

              {/* Compliance note */}
              <div className="mt-6 rounded-lg bg-surface-warm p-3">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Messages will include opt-out instructions: "Reply STOP to unsubscribe." All recipients have opted in.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="accent" size="lg" onClick={handleSend}>
                  <Send className="h-4 w-4" /> Send Now
                </Button>
                <Button variant="outline" size="lg">
                  <Clock className="h-4 w-4" /> Schedule
                </Button>
                <Button variant="outline" size="lg">
                  <Save className="h-4 w-4" /> Save Draft
                </Button>
                <Button variant="ghost" size="lg" onClick={() => navigate("/dashboard")}>
                  <SkipForward className="h-4 w-4" /> Skip
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Side panel */}
          <ScrollReveal delay={160}>
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm font-semibold text-foreground">Why this was suggested</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{suggestion.suggestionReason}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm font-semibold text-foreground">Campaign Details</h3>
                <div className="mt-3 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Audience</span>
                    <span className="font-medium text-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {suggestion.targetCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Segments</span>
                    <span className="font-medium text-foreground tabular-nums">{segments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Cost</span>
                    <span className="font-medium text-foreground tabular-nums">${estCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Send Time</span>
                    <span className="font-medium text-foreground">Today 2:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> SMS Preview</h3>
                <div className="mt-3 rounded-lg bg-secondary p-4">
                  <p className="text-sm text-foreground leading-relaxed">{message}</p>
                  {redemptionCode && <p className="mt-2 text-sm text-foreground">Show this text or use code {redemptionCode}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">Reply STOP to unsubscribe</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
