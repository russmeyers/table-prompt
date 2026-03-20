import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useRestaurant, useProfile, useUpdateRestaurant } from "@/hooks/use-data";
import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const tabs = ["Restaurant", "Notifications", "SMS Provider", "Approval Rules", "Auto-Send", "Advanced"] as const;

export default function Settings() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Restaurant");
  const { data: restaurant, isLoading } = useRestaurant();
  const { data: profile } = useProfile();
  const updateRestaurant = useUpdateRestaurant();

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("");
  const [slowDays, setSlowDays] = useState("");
  const [mealService, setMealService] = useState("");
  const [smsNotif, setSmsNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoSend, setAutoSend] = useState(false);
  const [maxAutoPerWeek, setMaxAutoPerWeek] = useState("2");
  const [autoSendDays, setAutoSendDays] = useState("");
  const [doneForYou, setDoneForYou] = useState(false);
  const [joinIncentive, setJoinIncentive] = useState("");

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name || "");
      setType(restaurant.type || "");
      setPhone(restaurant.phone || "");
      setTimezone(restaurant.timezone || "");
      setSlowDays((restaurant.slow_days ?? []).join(", "));
      setMealService(restaurant.meal_service || "both");
      setAutoSend(restaurant.auto_send_enabled ?? false);
      setMaxAutoPerWeek(String(restaurant.max_auto_per_week ?? 2));
      setAutoSendDays((restaurant.auto_send_days ?? []).join(", "));
      setDoneForYou(restaurant.done_for_you_mode ?? false);
      setJoinIncentive(restaurant.join_incentive || "");
    }
  }, [restaurant]);

  const handleSave = async () => {
    if (!restaurant) return;
    try {
      await updateRestaurant.mutateAsync({
        id: restaurant.id,
        name,
        type,
        phone,
        timezone,
        slow_days: slowDays.split(",").map(s => s.trim()).filter(Boolean),
        meal_service: mealService,
        auto_send_enabled: autoSend,
        max_auto_per_week: parseInt(maxAutoPerWeek) || 2,
        auto_send_days: autoSendDays.split(",").map(s => s.trim()).filter(Boolean),
        done_for_you_mode: doneForYou,
        join_incentive: joinIncentive,
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="flex justify-center py-32"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-4xl py-8">
        <ScrollReveal>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="mt-6 flex gap-1 overflow-x-auto rounded-lg border border-border bg-muted p-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
            {activeTab === "Restaurant" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Restaurant Profile</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Restaurant Name" value={name} onChange={setName} />
                  <Field label="Restaurant Type" value={type} onChange={setType} />
                  <Field label="Phone" value={phone} onChange={setPhone} />
                  <Field label="Timezone" value={timezone} onChange={setTimezone} />
                </div>
                <Field label="Slow Days (comma separated)" value={slowDays} onChange={setSlowDays} />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Service</label>
                  <select value={mealService} onChange={e => setMealService(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Owner Notification Settings</h2>
                <Toggle label="Receive SMS prompts" description="Get text messages when campaigns are suggested" checked={smsNotif} onChange={setSmsNotif} />
                <Toggle label="Receive email prompts" description="Get email notifications for suggestions" checked={emailNotif} onChange={setEmailNotif} />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Owner Email</label>
                  <p className="text-sm text-muted-foreground">{profile?.email ?? "—"}</p>
                </div>
              </div>
            )}

            {activeTab === "SMS Provider" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">SMS Provider</h2>
                <div className="rounded-lg bg-surface-warm p-4">
                  <p className="text-sm text-foreground font-medium">Currently using: Textbelt</p>
                  <p className="mt-1 text-sm text-muted-foreground">Ready to scale? You can switch to Twilio in the future.</p>
                </div>
                <p className="text-xs text-muted-foreground">API key is managed by your admin. Contact them to update.</p>
              </div>
            )}

            {activeTab === "Approval Rules" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Campaign Approval</h2>
                <div className="rounded-lg bg-surface-warm p-4">
                  <p className="text-sm text-foreground font-medium">Approval is always required</p>
                  <p className="mt-1 text-sm text-muted-foreground">Nothing goes out without your say-so.</p>
                </div>
              </div>
            )}

            {activeTab === "Auto-Send" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Auto-Send Mode <span className="ml-2 rounded bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">BETA</span></h2>
                <p className="text-sm text-muted-foreground">When enabled, the system can send campaigns automatically based on your rules — without manual approval.</p>
                <Toggle label="Enable Auto-Send" description="Campaigns will send automatically based on rules below" checked={autoSend} onChange={setAutoSend} />
                <Field label="Max auto campaigns per week" value={maxAutoPerWeek} onChange={setMaxAutoPerWeek} />
                <Field label="Allowed days (comma separated)" value={autoSendDays} onChange={setAutoSendDays} />
              </div>
            )}

            {activeTab === "Advanced" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Advanced</h2>
                <Toggle label="Request help with campaigns" description="Flag your account for our team to review and assist with campaigns" checked={doneForYou} onChange={setDoneForYou} />
                <Field label="Join Incentive" value={joinIncentive} onChange={setJoinIncentive} />
                {restaurant && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Public Signup Link</label>
                    <p className="text-sm text-muted-foreground font-mono break-all">/join/{restaurant.public_signup_token}</p>
                  </div>
                )}
              </div>
            )}

            <Button variant="accent" className="mt-6" onClick={handleSave} disabled={updateRestaurant.isPending}>
              {updateRestaurant.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-input"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
