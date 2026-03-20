import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WorkflowBadge, WorkflowTimeline } from "@/components/WorkflowTimeline";
import { dashboardStats, mockSuggestions, mockCampaigns } from "@/lib/mock-data";
import { Users, Send, Clock, Flame, Eye } from "lucide-react";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-foreground tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-5xl py-10">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ lineHeight: "1.2" }}>
                Good afternoon, Maria
              </h1>
              <p className="mt-1 text-muted-foreground">Bella's Italian Kitchen</p>
            </div>
            <Button variant="emergency" size="lg" asChild>
              <Link to="/campaigns/emergency">
                <Flame className="h-4 w-4" />
                We're Slow — Send Now
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        {/* Stats — 3 cards only, less noise */}
        <ScrollReveal delay={60}>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Subscribers" value={dashboardStats.subscriberCount.toLocaleString()} sub="+12 this week" />
            <StatCard label="Sent This Month" value={dashboardStats.campaignsSentThisMonth} sub={`Last: ${dashboardStats.lastCampaignDate}`} />
            <StatCard label="Pending Review" value={dashboardStats.pendingSuggestions} sub="Suggestions waiting for you" />
          </div>
        </ScrollReveal>

        {/* Suggested Campaigns — simplified cards with workflow badge */}
        <ScrollReveal delay={120}>
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-foreground">Needs Your Attention</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Campaign suggestions — nothing sends without your approval.</p>
            <div className="mt-5 space-y-3">
              {mockSuggestions.map(sug => (
                <div key={sug.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-semibold text-foreground">{sug.title}</h3>
                        <WorkflowBadge status={sug.status} />
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{sug.suggestionReason}</p>

                      {/* Compact workflow dots */}
                      <div className="mt-3">
                        <WorkflowTimeline events={sug.workflow} compact />
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{sug.targetCount.toLocaleString()} guests</span>
                        <span>·</span>
                        <span>Est. ${(sug.targetCount * 0.01).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant="accent" size="sm" asChild>
                        <Link to={`/campaigns/review/${sug.id}`}><Eye className="h-3.5 w-3.5" /> Review</Link>
                      </Button>
                      <Button variant="outline" size="sm">Skip</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Recent Campaigns — simpler table */}
        <ScrollReveal delay={180}>
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Campaigns</h2>
              <Link to="/campaigns" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <div className="mt-4 space-y-2">
              {mockCampaigns.map(c => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 shadow-card">
                  <div>
                    <p className="font-medium text-foreground">{c.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {c.sentAt ? new Date(c.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"} · {c.targetCount.toLocaleString()} guests · Code: {c.redemptionCode}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground tabular-nums">${c.estimatedRevenue?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
