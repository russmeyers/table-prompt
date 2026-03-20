import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { mockCalendarEvents } from "@/lib/mock-data";
import { CalendarDays, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Calendar() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-3xl py-8">
        <ScrollReveal>
          <h1 className="text-2xl font-bold text-foreground">Upcoming Opportunities</h1>
          <p className="mt-1 text-sm text-muted-foreground">Key dates to plan promotions around</p>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="mt-8 space-y-3">
            {mockCalendarEvents.map((evt, i) => {
              const d = new Date(evt.date);
              const isPast = d < new Date();
              return (
                <div key={evt.id} className={`flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover ${isPast ? "opacity-50" : ""}`}>
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-secondary">
                    <span className="text-xs font-medium text-muted-foreground">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                    <span className="text-lg font-bold text-foreground tabular-nums leading-none">{d.getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{evt.name}</h3>
                    <p className="text-sm text-muted-foreground">{evt.description}</p>
                  </div>
                  {!isPast && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/campaigns/emergency"><Plus className="h-3.5 w-3.5" /> Create Campaign</Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
