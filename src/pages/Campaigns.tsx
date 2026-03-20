import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { mockSuggestions, mockCampaigns } from "@/lib/mock-data";
import { useState } from "react";
import { Eye, Copy, Send, CloudRain, Clock, CalendarDays, MessageSquare } from "lucide-react";

const tabs = ["Suggested", "Drafts", "Scheduled", "Sent"] as const;
type Tab = typeof tabs[number];

const triggerIcons: Record<string, typeof CloudRain> = {
  weather: CloudRain,
  weekday: CalendarDays,
  inactivity: Clock,
};

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState<Tab>("Suggested");

  const allItems = activeTab === "Suggested"
    ? mockSuggestions.map(s => ({ id: s.id, title: s.title, reason: s.suggestionReason, message: s.recommendedMessage, target: s.targetCount, status: s.status, date: s.createdAt, triggerType: s.triggerType }))
    : activeTab === "Sent"
      ? mockCampaigns.filter(c => c.status === "sent").map(c => ({ id: c.id, title: c.title, reason: "", message: c.messageBody, target: c.targetCount, status: c.status, date: c.sentAt || c.createdAt, triggerType: "" }))
      : [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container py-8">
        <ScrollReveal>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
            <Button variant="accent" asChild>
              <Link to="/campaigns/emergency"><Send className="h-4 w-4" /> New Campaign</Link>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
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
                {tab === "Suggested" && <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-xs text-accent-foreground">{mockSuggestions.length}</span>}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <div className="mt-6 space-y-3">
            {allItems.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center shadow-card">
                <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">No campaigns here yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Campaigns will appear as you create or receive suggestions.</p>
              </div>
            ) : (
              allItems.map(item => {
                const TriggerIcon = triggerIcons[item.triggerType] || MessageSquare;
                return (
                  <div key={item.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <TriggerIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          {item.reason && <p className="mt-0.5 text-sm text-muted-foreground">{item.reason}</p>}
                          <p className="mt-2 rounded-lg bg-muted/60 p-3 text-sm text-foreground leading-relaxed">{item.message}</p>
                          <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                            <span>{item.target.toLocaleString()} guests</span>
                            <span>·</span>
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {item.status === "pending" && (
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
                  </div>
                );
              })
            )}
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
