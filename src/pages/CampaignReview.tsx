import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WorkflowTimeline, WorkflowBadge } from "@/components/WorkflowTimeline";
import { mockSuggestions } from "@/lib/mock-data";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Send, Clock, Save, SkipForward, Sparkles, Users, Info } from "lucide-react";
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
    toast.success("Message rewritten");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-5xl py-10">
        <ScrollReveal>
          <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </button>
          <div className="mt-4 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{suggestion.title}</h1>
            <WorkflowBadge status={suggestion.status} />
          </div>
          <p className="mt-1 text-muted-foreground">{suggestion.suggestionReason}</p>
        </ScrollReveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Main editor — 3 cols */}
          <ScrollReveal delay={60} className="lg:col-span-3">
            <div className="space-y-6">
              {/* Message */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-foreground">Message</label>
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">AI Suggested</span>
                </div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background p-4 text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{charCount} chars · {segments} segment{segments > 1 ? "s" : ""}</span>
                  <span>${estCost} est. cost</span>
                </div>

                {/* AI rewrite */}
                <div className="mt-4 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  {["shorter", "casual", "urgent"].map(style => (
                    <button
                      key={style}
                      onClick={() => handleRewrite(style)}
                      className="rounded-md border border-input px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors active:scale-[0.97]"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Redemption code */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <label className="text-sm font-semibold text-foreground">Redemption Code</label>
                <input
                  value={redemptionCode}
                  onChange={e => setRedemptionCode(e.target.value)}
                  className="mt-2 w-full max-w-xs rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">Guests see: "Show this text or use code {redemptionCode}"</p>
              </div>

              {/* Compliance */}
              <div className="flex items-start gap-2.5 rounded-lg bg-surface-warm px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All recipients have opted in. Messages include "Reply STOP to unsubscribe."
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
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

          {/* Sidebar — 2 cols */}
          <ScrollReveal delay={120} className="lg:col-span-2">
            <div className="space-y-5">
              {/* Workflow timeline — the core feature */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm font-semibold text-foreground mb-4">Approval Workflow</h3>
                <WorkflowTimeline events={suggestion.workflow} />
              </div>

              {/* Quick stats */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">Details</h3>
                <div className="space-y-3 text-sm">
                  <Row label="Audience" value={`${suggestion.targetCount.toLocaleString()} guests`} />
                  <Row label="Segments" value={String(segments)} />
                  <Row label="Est. Cost" value={`$${estCost}`} />
                  <Row label="Suggested Send" value="Today 2:00 PM" />
                </div>
              </div>

              {/* SMS preview */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">SMS Preview</h3>
                <div className="rounded-lg bg-secondary p-4 text-sm text-foreground leading-relaxed">
                  <p>{message}</p>
                  {redemptionCode && <p className="mt-2">Show this text or use code {redemptionCode}</p>}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground tabular-nums">{value}</span>
    </div>
  );
}
