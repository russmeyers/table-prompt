import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MessageSquare, ArrowRight, ArrowLeft, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-data";

const stepLabels = ["Restaurant Info", "Marketing Setup", "Import Contacts", "Review"];

interface FormData {
  restaurantName: string;
  ownerName: string;
  phone: string;
  email: string;
  restaurantType: string;
  timezone: string;
  slowDays: string[];
  mealService: string;
  promoStyles: string[];
  joinIncentive: string;
}

const defaultForm: FormData = {
  restaurantName: "",
  ownerName: "",
  phone: "",
  email: "",
  restaurantType: "",
  timezone: "America/New_York",
  slowDays: [],
  mealService: "both",
  promoStyles: [],
  joinIncentive: "",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SERVICES = ["Lunch", "Dinner", "Both"];
const PROMOS = ["Discounts", "Events", "Specials", "Loyalty / VIP"];
const TIMEZONES = [
  { value: "America/New_York", label: "Eastern" },
  { value: "America/Chicago", label: "Central" },
  { value: "America/Denver", label: "Mountain" },
  { value: "America/Los_Angeles", label: "Pacific" },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const handleFinish = async () => {
    if (!userId) {
      toast.error("Please log in first", { description: "You need an account to complete setup." });
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      // Create the restaurant record
      const { error } = await supabase.from("restaurants").insert({
        owner_user_id: userId,
        name: form.restaurantName,
        type: form.restaurantType || null,
        phone: form.phone || null,
        timezone: form.timezone,
        slow_days: form.slowDays,
        meal_service: form.mealService,
        promo_styles: form.promoStyles,
        join_incentive: form.joinIncentive || null,
      });

      if (error) throw error;

      // Update profile display name
      await supabase.from("profiles").update({ display_name: form.ownerName }).eq("user_id", userId);

      toast.success("You're all set!", { description: "Welcome to TableText." });
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Setup failed", { description: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/60 bg-background">
        <div className="container flex h-14 items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <MessageSquare className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground tracking-tight">TableText</span>
          </Link>
        </div>
      </nav>

      <main className="container max-w-2xl py-8">
        {/* Progress */}
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-8">
            {stepLabels.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-accent text-accent-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`hidden text-sm sm:block ${i === step ? "font-medium text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < stepLabels.length - 1 && <div className="hidden h-px w-8 bg-border sm:block" />}
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Tell us about your restaurant</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Restaurant Name" value={form.restaurantName} onChange={v => setForm(f => ({ ...f, restaurantName: v }))} placeholder="Bella's Italian Kitchen" />
                  <Field label="Your Name" value={form.ownerName} onChange={v => setForm(f => ({ ...f, ownerName: v }))} placeholder="Maria Rossi" />
                  <Field label="Mobile Number" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="(555) 123-4567" />
                  <Field label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="maria@bellaskitchen.com" type="email" />
                  <Field label="Restaurant Type" value={form.restaurantType} onChange={v => setForm(f => ({ ...f, restaurantType: v }))} placeholder="Italian, Mexican, BBQ..." />
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                    <select
                      value={form.timezone}
                      onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Marketing preferences</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Slow days (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(d => (
                      <label key={d} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                        form.slowDays.includes(d) ? "border-primary bg-secondary text-secondary-foreground" : "border-input bg-background hover:bg-muted"
                      }`}>
                        <input type="checkbox" className="sr-only" checked={form.slowDays.includes(d)} onChange={() => setForm(f => ({ ...f, slowDays: toggleArray(f.slowDays, d) }))} />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Service type</label>
                  <div className="flex gap-2">
                    {SERVICES.map(s => (
                      <label key={s} className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm cursor-pointer transition-colors ${
                        form.mealService === s.toLowerCase() ? "border-primary bg-secondary text-secondary-foreground" : "border-input bg-background hover:bg-muted"
                      }`}>
                        <input type="radio" className="sr-only" name="service" checked={form.mealService === s.toLowerCase()} onChange={() => setForm(f => ({ ...f, mealService: s.toLowerCase() }))} />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Promotion style</label>
                  <div className="flex flex-wrap gap-2">
                    {PROMOS.map(p => (
                      <label key={p} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                        form.promoStyles.includes(p) ? "border-primary bg-secondary text-secondary-foreground" : "border-input bg-background hover:bg-muted"
                      }`}>
                        <input type="checkbox" className="sr-only" checked={form.promoStyles.includes(p)} onChange={() => setForm(f => ({ ...f, promoStyles: toggleArray(f.promoStyles, p) }))} />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>
                <Field label="Join Incentive (optional)" value={form.joinIncentive} onChange={v => setForm(f => ({ ...f, joinIncentive: v }))} placeholder="e.g. Free appetizer when you sign up" />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Import your guest list</h2>
                <p className="text-sm text-muted-foreground">Upload a CSV with phone numbers, or add contacts manually later.</p>
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-12">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">Drop your CSV here</p>
                  <p className="mt-1 text-xs text-muted-foreground">Or click to browse</p>
                  <Button variant="outline" size="sm" className="mt-4">Choose File</Button>
                </div>
                <p className="text-xs text-muted-foreground">Expected columns: first_name, last_name, phone. You can skip this and add contacts later.</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">You're all set!</h2>
                <p className="text-sm text-muted-foreground">Here's a summary. You can change anything in Settings.</p>
                <div className="space-y-2">
                  <SummaryRow label="Restaurant" value={form.restaurantName || "—"} />
                  <SummaryRow label="Owner" value={form.ownerName || "—"} />
                  <SummaryRow label="Phone" value={form.phone || "—"} />
                  <SummaryRow label="Slow Days" value={form.slowDays.length ? form.slowDays.join(", ") : "None selected"} />
                  <SummaryRow label="Service" value={form.mealService} />
                  <SummaryRow label="Promo Styles" value={form.promoStyles.length ? form.promoStyles.join(", ") : "None selected"} />
                  <SummaryRow label="Approval" value="Required before sending" />
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : <div />}
              {step < stepLabels.length - 1 ? (
                <Button variant="accent" onClick={() => setStep(step + 1)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="accent" onClick={handleFinish} disabled={saving}>
                  {saving ? "Setting up..." : "Go to Dashboard"} <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground capitalize">{value}</span>
    </div>
  );
}
