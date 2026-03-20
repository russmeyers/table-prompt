import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WorkflowBadge, WorkflowTimeline } from "@/components/WorkflowTimeline";
import { useRestaurant, useProfile, useDashboardStats, useSuggestions, useCampaigns } from "@/hooks/use-data";
import { Users, Send, Clock, Flame, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-data";
import { useEffect } from "react";

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
  const navigate = useNavigate();
  const { userId, loading: authLoading } = useAuth();
  const { data: profile } = useProfile();
  const { data: restaurant, isLoading: restLoading } = useRestaurant();
  const { data: stats } = useDashboardStats(restaurant?.id);
  const { data: suggestions } = useSuggestions(restaurant?.id);
  const { data: campaigns } = useCampaigns(restaurant?.id);

  useEffect(() => {
    if (!authLoading && !userId) navigate("/login");
  }, [authLoading, userId, navigate]);

  if (authLoading || restLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="container max-w-5xl py-10">
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Welcome to TableText</h2>
            <p className="mt-2 text-muted-foreground">Get started by setting up your restaurant.</p>
            <Button variant="accent" className="mt-4" asChild>
              <Link to="/onboarding">Set Up Restaurant</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const pendingSuggestions = (suggestions ?? []).filter(s =>
    ["pending", "notified", "in_review"].includes(s.status)
  );
  const recentCampaigns = (campaigns ?? []).filter(c => c.status === "sent").slice(0, 3);
  const displayName = profile?.display_name || "there";

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-5xl py-10">
        <ScrollReveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ lineHeight: "1.2" }}>
                Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {displayName}
              </h1>
              <p className="mt-1 text-muted-foreground">{restaurant.name}</p>
            </div>
            <Button variant="emergency" size="lg" asChild>
              <Link to="/campaigns/emergency">
                <Flame className="h-4 w-4" />
                We're Slow — Send Now
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Subscribers" value={stats?.subscriberCount ?? 0} />
            <StatCard label="Sent This Month" value={stats?.campaignsSentThisMonth ?? 0} sub={`Last: ${stats?.lastCampaignDate ?? "—"}`} />
            <StatCard label="Pending Review" value={stats?.pendingSuggestions ?? 0} sub="Suggestions waiting for you" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-foreground">Needs Your Attention</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Campaign suggestions — nothing sends without your approval.</p>
            <div className="mt-5 space-y-3">
              {pendingSuggestions.length === 0 ? (
                <div className="rounded-xl border border-border bg-card py-12 text-center shadow-card">
                  <p className="font-medium text-foreground">All clear!</p>
                  <p className="mt-1 text-sm text-muted-foreground">No pending suggestions right now.</p>
                </div>
              ) : (
                pendingSuggestions.map(sug => (
                  <div key={sug.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-semibold text-foreground">{sug.title}</h3>
                          <WorkflowBadge status={sug.status} />
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{sug.suggestion_reason}</p>
                        <div className="mt-3">
                          <WorkflowTimeline events={(sug.workflow as any[]) ?? []} compact />
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{(sug.target_count ?? 0).toLocaleString()} guests</span>
                          <span>·</span>
                          <span>Est. ${((sug.target_count ?? 0) * 0.01).toFixed(2)}</span>
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
                ))
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={180}>
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Campaigns</h2>
              <Link to="/campaigns" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <div className="mt-4 space-y-2">
              {recentCampaigns.length === 0 ? (
                <div className="rounded-xl border border-border bg-card py-8 text-center shadow-card">
                  <p className="text-sm text-muted-foreground">No campaigns sent yet.</p>
                </div>
              ) : (
                recentCampaigns.map(c => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 shadow-card">
                    <div>
                      <p className="font-medium text-foreground">{c.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {c.sent_at ? new Date(c.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"} · {(c.target_count ?? 0).toLocaleString()} guests
                        {c.redemption_code && ` · Code: ${c.redemption_code}`}
                      </p>
                    </div>
                    {c.estimated_revenue && (
                      <p className="text-sm font-semibold text-foreground tabular-nums">${Number(c.estimated_revenue).toLocaleString()}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
