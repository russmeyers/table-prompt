import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WorkflowTimeline, WorkflowBadge } from "@/components/WorkflowTimeline";
import { useSuggestion, useUpdateSuggestion, useCreateCampaign, useRestaurant, useContacts } from "@/hooks/use-data";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Send, Clock, Save, SkipForward, Sparkles, Info, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CampaignReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: suggestion, isLoading } = useSuggestion(id);
  const { data: restaurant } = useRestaurant();
  const { data: contacts } = useContacts(restaurant?.id);
  const updateSuggestion = useUpdateSuggestion();
  const createCampaign = useCreateCampaign();

  const [message, setMessage] = useState("");
  const [redemptionCode, setRedemptionCode] = useState("PROMO10");
  const [rewriting, setRewriting] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  const optedInCount = (contacts ?? []).filter(c => c.opted_in && !c.opted_out).length;

  useEffect(() => {
    if (suggestion?.recommended_message) {
      setMessage(suggestion.recommended_message);
    }
  }, [suggestion]);

  // Track that owner opened the review link
  useEffect(() => {
    if (suggestion && suggestion.status !== "in_review" && suggestion.status !== "approved" && suggestion.status !== "sent" && suggestion.status !== "skipped") {
      const workflow = [...((suggestion.workflow as any[]) ?? [])];
      if (!workflow.some((e: any) => e.step === "owner_opened_link")) {
        workflow.push({ step: "owner_opened_link", timestamp: new Date().toISOString() });
        updateSuggestion.mutate({ id: suggestion.id, status: "in_review", workflow });
      }
    }
  }, [suggestion?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="flex justify-center py-32"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (!suggestion) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="container max-w-5xl py-10 text-center">
          <p className="text-muted-foreground">Suggestion not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </main>
      </div>
    );
  }

  const charCount = message.length;
  const segments = Math.ceil(charCount / 160);
  const estCost = (optedInCount * 0.01 * segments).toFixed(2);

  const handleSend = async () => {
    try {
      // Create campaign from suggestion
      const campaign = await createCampaign.mutateAsync({
        restaurant_id: suggestion.restaurant_id,
        suggestion_id: suggestion.id,
        title: suggestion.title,
        message_body: message + (redemptionCode ? `\n\nShow this text or use code ${redemptionCode}` : "") + "\n\nReply STOP to unsubscribe",
        status: "sending",
        target_count: optedInCount,
        estimated_cost: parseFloat(estCost),
        redemption_code: redemptionCode || undefined,
      });

      // Update suggestion workflow
      const workflow = [...((suggestion.workflow as any[]) ?? [])];
      workflow.push({ step: "owner_approved", timestamp: new Date().toISOString() });
      await updateSuggestion.mutateAsync({ id: suggestion.id, status: "approved", workflow });

      // Trigger actual send via edge function
      const { error } = await supabase.functions.invoke("send-sms", {
        body: { action: "send_campaign", campaignId: campaign.id },
      });

      if (error) throw error;

      toast.success("Campaign sent!", { description: `Message sent to ${optedInCount.toLocaleString()} guests.` });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      toast.error("Failed to send", { description: err.message });
    }
  };

  const handleSkip = async () => {
    const workflow = [...((suggestion.workflow as any[]) ?? [])];
    workflow.push({ step: "skipped", timestamp: new Date().toISOString() });
    await updateSuggestion.mutateAsync({ id: suggestion.id, status: "skipped", workflow });
    toast.success("Suggestion skipped");
    navigate("/dashboard");
  };

  const handleSaveDraft = async () => {
    await createCampaign.mutateAsync({
      restaurant_id: suggestion.restaurant_id,
      suggestion_id: suggestion.id,
      title: suggestion.title,
      message_body: message,
      status: "draft",
      target_count: optedInCount,
      redemption_code: redemptionCode || undefined,
    });
    toast.success("Saved as draft");
  };

  const handleRewrite = async (style: string) => {
    setRewriting(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-campaign", {
        body: { action: "rewrite", currentMessage: message, rewriteStyle: style },
      });
      if (error) throw error;
      if (data?.message) {
        setMessage(data.message);
        // Track edit in workflow
        const workflow = [...((suggestion.workflow as any[]) ?? [])];
        if (!workflow.some((e: any) => e.step === "owner_edited")) {
          workflow.push({ step: "owner_edited", timestamp: new Date().toISOString(), note: `Rewrite: ${style}` });
          await updateSuggestion.mutateAsync({ id: suggestion.id, workflow });
        }
        toast.success("Message rewritten");
      }
    } catch {
      toast.error("Rewrite failed — try again");
    } finally {
      setRewriting(false);
    }
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
          <p className="mt-1 text-muted-foreground">{suggestion.suggestion_reason}</p>
        </ScrollReveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <ScrollReveal delay={60} className="lg:col-span-3">
            <div className="space-y-6">
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

                <div className="mt-4 flex items-center gap-2">
                  {rewriting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  {["shorter", "casual", "urgent"].map(style => (
                    <button
                      key={style}
                      onClick={() => handleRewrite(style)}
                      disabled={rewriting}
                      className="rounded-md border border-input px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors active:scale-[0.97] disabled:opacity-50"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <label className="text-sm font-semibold text-foreground">Redemption Code</label>
                <input
                  value={redemptionCode}
                  onChange={e => setRedemptionCode(e.target.value)}
                  className="mt-2 w-full max-w-xs rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">Guests see: "Show this text or use code {redemptionCode}"</p>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg bg-surface-warm px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All recipients have opted in. Messages include "Reply STOP to unsubscribe."
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="accent" size="lg" onClick={handleSend} disabled={createCampaign.isPending}>
                  {createCampaign.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send Now
                </Button>
                <Button variant="outline" size="lg" onClick={handleSendTest} disabled={sendingTest}>
                  {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                  Send Test to My Phone
                </Button>
                <Button variant="outline" size="lg" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4" /> Save Draft
                </Button>
                <Button variant="ghost" size="lg" onClick={handleSkip}>
                  <SkipForward className="h-4 w-4" /> Skip
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120} className="lg:col-span-2">
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm font-semibold text-foreground mb-4">Approval Workflow</h3>
                <WorkflowTimeline events={(suggestion.workflow as any[]) ?? []} />
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">Details</h3>
                <div className="space-y-3 text-sm">
                  <Row label="Audience" value={`${optedInCount.toLocaleString()} guests`} />
                  <Row label="Segments" value={String(segments)} />
                  <Row label="Est. Cost" value={`$${estCost}`} />
                  <Row label="Suggested Send" value={suggestion.recommended_send_time ? new Date(suggestion.recommended_send_time).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "ASAP"} />
                </div>
              </div>

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
