import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { dashboardStats, mockSuggestions, mockCampaigns } from "@/lib/mock-data";
import { Users, Send, MessageSquare, Clock, Flame, CloudRain, CalendarDays, ArrowRight, Eye, X } from "lucide-react";

const triggerIcons: Record<string, typeof CloudRain> = {
  weather: CloudRain,
  weekday: CalendarDays,
  inactivity: Clock,
};

function StatCard({ label, value, icon: Icon, sub }: { label: string; value: string | number; icon: typeof Users; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container py-8">
        {/* Emergency button */}
        <ScrollReveal>
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ lineHeight: "1.2" }}>Good afternoon, Maria</h1>
              <p className="mt-1 text-sm text-muted-foreground">Here's what's happening at Bella's Italian Kitchen</p>
            </div>
            <Button variant="emergency" size="lg" asChild>
              <Link to="/campaigns/emergency">
                <Flame className="h-4 w-4" />
                We're Slow — Send a Text Now
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={80}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Subscribers" value={dashboardStats.subscriberCount.toLocaleString()} icon={Users} sub="+12 this week" />
            <StatCard label="Campaigns This Month" value={dashboardStats.campaignsSentThisMonth} icon={Send} sub={`Last sent ${dashboardStats.lastCampaignDate}`} />
            <StatCard label="Pending Suggestions" value={dashboardStats.pendingSuggestions} icon={MessageSquare} sub="Review and approve" />
            <StatCard label="Texts Used" value={`${dashboardStats.estimatedTextsUsed.toLocaleString()} / ${dashboardStats.textsIncluded.toLocaleString()}`} icon={Clock} sub="This billing period" />
          </div>
        </ScrollReveal>

        {/* Suggested Campaigns */}
        <ScrollReveal delay={160}>
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Suggested Campaigns</h2>
              <Link to="/campaigns" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <div className="mt-4 space-y-3">
              {mockSuggestions.map(sug => {
                const TriggerIcon = triggerIcons[sug.triggerType] || MessageSquare;
                return (
                  <div key={sug.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <TriggerIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{sug.title}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">{sug.suggestionReason}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{sug.targetCount.toLocaleString()} guests</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="accent" size="sm" asChild>
                        <Link to={`/campaigns/review/${sug.id}`}>
                          <Eye className="h-3.5 w-3.5" /> Review
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">Skip</Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9"><X className="h-4 w-4" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Recent Campaigns */}
        <ScrollReveal delay={240}>
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Campaigns</h2>
              <Link to="/campaigns" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Campaign</th>
                    <th className="pb-3 font-medium">Sent</th>
                    <th className="pb-3 font-medium">Guests</th>
                    <th className="pb-3 font-medium">Code</th>
                    <th className="pb-3 font-medium">Est. Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCampaigns.map(c => (
                    <tr key={c.id} className="border-b border-border/60">
                      <td className="py-3 font-medium text-foreground">{c.title}</td>
                      <td className="py-3 text-muted-foreground">{c.sentAt ? new Date(c.sentAt).toLocaleDateString() : "—"}</td>
                      <td className="py-3 text-muted-foreground tabular-nums">{c.targetCount.toLocaleString()}</td>
                      <td className="py-3"><span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{c.redemptionCode}</span></td>
                      <td className="py-3 font-medium text-foreground tabular-nums">${c.estimatedRevenue?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
