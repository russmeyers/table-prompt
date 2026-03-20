import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WorkflowBadge } from "@/components/WorkflowTimeline";
import { useRestaurant, useSuggestions, useCampaigns, useUpdateSuggestion } from "@/hooks/use-data";
import { useState } from "react";
import { Eye, Copy, Send, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

const tabs = ["Suggested", "Drafts", "Scheduled", "Sent"] as const;
type Tab = typeof tabs[number];

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState<Tab>("Suggested");
  const { data: restaurant } = useRestaurant();
  const { data: suggestions, isLoading: sugLoading } = useSuggestions(restaurant?.id);
  const { data: campaigns, isLoading: campLoading } = useCampaigns(restaurant?.id);
  const updateSuggestion = useUpdateSuggestion();

  const isLoading = sugLoading || campLoading;

  const allItems = activeTab === "Suggested"
    ? (suggestions ?? []).filter(s => ["pending", "notified", "in_review"].includes(s.status)).map(s => ({
        id: s.id, title: s.title, reason: s.suggestion_reason, message: s.recommended_message,
        target: s.target_count ?? 0, status: s.status, date: s.created_at, type: "suggestion" as const,
      }))
    : activeTab === "Drafts"
      ? (campaigns ?? []).filter(c => c.status === "draft").map(c => ({
          id: c.id, title: c.title, reason: "", message: c.message_body,
          target: c.target_count ?? 0, status: c.status, date: c.created_at, type: "campaign" as const,
        }))
      : activeTab === "Scheduled"
        ? (campaigns ?? []).filter(c => c.status === "scheduled").map(c => ({
            id: c.id, title: c.title, reason: "", message: c.message_body,
            target: c.target_count ?? 0, status: c.status, date: c.created_at, type: "campaign" as const,
          }))
        : (campaigns ?? []).filter(c => c.status === "sent").map(c => ({
            id: c.id, title: c.title, reason: "", message: c.message_body,
            target: c.target_count ?? 0, status: c.status, date: c.sent_at || c.created_at, type: "campaign" as const,
          }));

  const suggestedCount = (suggestions ?? []).filter(s => ["pending", "notified", "in_review"].includes(s.status)).length;

  const handleSkip = async (id: string) => {
    try {
      await updateSuggestion.mutateAsync({ id, status: "skipped" });
      toast.success("Suggestion skipped");
    } catch { toast.error("Failed to skip"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-4xl py-10">
        <ScrollReveal>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Campaigns</h1>
            <Button variant="accent" size="sm" asChild>
              <Link to="/campaigns/emergency"><Send className="h-3.5 w-3.5" /> New Campaign</Link>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <div className="mt-6 flex gap-1 rounded-lg border border-border bg-muted p-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {tab === "Suggested" && suggestedCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-xs text-accent-foreground">{suggestedCount}</span>
                )}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="mt-6 space-y-2">
            {isLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : allItems.length === 0 ? (
              <div className="rounded-xl border border-border bg-card py-16 text-center shadow-card">
                <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-3 font-medium text-foreground">No campaigns here yet</p>
                <p className="mt-1 text-sm text-muted-foreground">They'll appear as you create or receive suggestions.</p>
              </div>
            ) : (
              allItems.map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 shadow-card transition-shadow hover:shadow-card-hover">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{item.title}</p>
                      <WorkflowBadge status={item.status} />
                    </div>
                    {item.reason && <p className="mt-1 text-sm text-muted-foreground truncate">{item.reason}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.target.toLocaleString()} guests · {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2 ml-4">
                    {item.type === "suggestion" && (
                      <>
                        <Button variant="accent" size="sm" asChild>
                          <Link to={`/campaigns/review/${item.id}`}><Eye className="h-3.5 w-3.5" /> Review</Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSkip(item.id)}>Skip</Button>
                      </>
                    )}
                    {item.status === "sent" && (
                      <Button variant="outline" size="sm"><Copy className="h-3.5 w-3.5" /> Duplicate</Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
