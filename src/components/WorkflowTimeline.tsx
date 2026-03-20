import type { WorkflowStep } from "@/lib/types";
import { workflowStepLabels, workflowStepColors } from "@/lib/mock-data";
import type { WorkflowEvent } from "@/lib/types";
import { Bell, Eye, Pencil, CheckCircle2, Send, XCircle, Lightbulb } from "lucide-react";

const stepIcons: Record<WorkflowStep, typeof Bell> = {
  suggestion_created: Lightbulb,
  owner_notified: Bell,
  owner_opened_link: Eye,
  owner_edited: Pencil,
  owner_approved: CheckCircle2,
  sent: Send,
  skipped: XCircle,
};

const allSteps: WorkflowStep[] = [
  "suggestion_created",
  "owner_notified",
  "owner_opened_link",
  "owner_edited",
  "owner_approved",
  "sent",
];

interface WorkflowTimelineProps {
  events: WorkflowEvent[];
  compact?: boolean;
}

export function WorkflowTimeline({ events, compact = false }: WorkflowTimelineProps) {
  const completedSteps = new Set(events.map(e => e.step));
  const isSkipped = completedSteps.has("skipped");

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {allSteps.map((step, i) => {
          const done = completedSteps.has(step);
          const Icon = stepIcons[step];
          return (
            <div
              key={step}
              title={workflowStepLabels[step]}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground/40"
              }`}
            >
              <Icon className="h-3 w-3" />
            </div>
          );
        })}
        {isSkipped && (
          <div title="Skipped" className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <XCircle className="h-3 w-3" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const Icon = stepIcons[event.step];
        const isLast = i === events.length - 1;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${workflowStepColors[event.step]}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border my-1" />}
            </div>
            <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
              <p className="text-sm font-medium text-foreground leading-7">{workflowStepLabels[event.step]}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </p>
              {event.note && <p className="mt-0.5 text-xs text-muted-foreground">{event.note}</p>}
            </div>
          </div>
        );
      })}
      {/* Remaining steps (greyed out) */}
      {allSteps.filter(s => !completedSteps.has(s) && !isSkipped).map((step, i) => {
        const Icon = stepIcons[step];
        const isLast = i === allSteps.filter(s => !completedSteps.has(s) && !isSkipped).length - 1;
        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/30">
                <Icon className="h-3.5 w-3.5" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border/40 my-1" />}
            </div>
            <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
              <p className="text-sm text-muted-foreground/50 leading-7">{workflowStepLabels[step]}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Status badge for dashboard cards
export function WorkflowBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: "Awaiting notification", className: "bg-muted text-muted-foreground" },
    notified: { label: "Owner notified", className: "bg-blue-50 text-blue-700" },
    in_review: { label: "In review", className: "bg-amber-50 text-amber-700" },
    approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700" },
    sent: { label: "Sent", className: "bg-emerald-100 text-emerald-800" },
    skipped: { label: "Skipped", className: "bg-muted text-muted-foreground" },
    dismissed: { label: "Dismissed", className: "bg-muted text-muted-foreground" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}
