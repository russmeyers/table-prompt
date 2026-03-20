import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WorkflowBadge } from "@/components/WorkflowTimeline";
import { mockSuggestions, mockCampaigns } from "@/lib/mock-data";
import { useState } from "react";
import { Eye, Copy, Send, MessageSquare } from "lucide-react";

const tabs = ["Suggested", "Drafts", "Scheduled", "Sent"] as const;
type Tab = typeof tabs[number];

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState<Tab>("Suggested");

  const allItems = activeTab === "Suggested"
    ? mockSuggestions.map(s => ({ id: s.id, title: s.title, reason: s.suggestionReason, message: s.recommendedMessage, target: s.targetCount, status: s.status, date: s.createdAt }))
    : activeTab === "Sent"
      ? mockCampaigns.filter(c => c.status === "sent").map(c => ({ id: c.id, title: c.title, reason: "", message: c.messageBody, target: c.targetCount, status: c.status, date: c.sentAt || c.createdAt }))
      : [];

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
                {tab === "Suggested" && mockSuggestions.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-xs text-accent-foreground">{mockSuggestions.length}</span>
                )}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="mt-6 space-y-2">
            {allItems.length === 0 ? (
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
                    {(item.status === "pending" || item.status === "notified" || item.status === "in_review") && (
                      <>
                        <Button variant="accent" size="sm" asChild>
                          <Link to={`/campaigns/review/${item.id}`}><Eye className="h-3.5 w-3.5" /> Review</Link>
                        </Button>
                        <Button variant="outline" size="sm">Skip</Button>
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
