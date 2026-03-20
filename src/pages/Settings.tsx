import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { mockRestaurant, mockOwner } from "@/lib/mock-data";
import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

const tabs = ["Restaurant", "Notifications", "SMS Provider", "Approval Rules", "Auto-Send", "Advanced"] as const;

export default function Settings() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Restaurant");

  const handleSave = () => toast.success("Settings saved");

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
                  <Field label="Restaurant Name" defaultValue={mockRestaurant.name} />
                  <Field label="Restaurant Type" defaultValue={mockRestaurant.type} />
                  <Field label="Phone" defaultValue={mockRestaurant.phone} />
                  <Field label="Timezone" defaultValue={mockRestaurant.timezone} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Slow Days</label>
                  <p className="text-sm text-muted-foreground">{mockRestaurant.slowDays.join(", ")}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Service</label>
                  <p className="text-sm text-muted-foreground capitalize">{mockRestaurant.mealService}</p>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Owner Notification Settings</h2>
                <Toggle label="Receive SMS prompts" description="Get text messages when campaigns are suggested" defaultChecked={mockOwner.smsNotificationsEnabled} />
                <Toggle label="Receive email prompts" description="Get email notifications for suggestions" defaultChecked={mockOwner.emailNotificationsEnabled} />
                <Field label="Owner Mobile Number" defaultValue={mockOwner.mobileNumber} />
                <Field label="Email" defaultValue={mockOwner.email} />
              </div>
            )}

            {activeTab === "SMS Provider" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">SMS Provider</h2>
                <div className="rounded-lg bg-surface-warm p-4">
                  <p className="text-sm text-foreground font-medium">Currently using: Textbelt</p>
                  <p className="mt-1 text-sm text-muted-foreground">Ready to scale? You can switch to Twilio in the future.</p>
                </div>
                <Field label="API Key" defaultValue="••••••••••••" />
              </div>
            )}

            {activeTab === "Approval Rules" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Campaign Approval</h2>
                <Toggle label="Require approval before sending" description="Nothing goes out without your say-so" defaultChecked={mockOwner.approvalRequired} />
                <Field label="Max suggestions per week" defaultValue="5" />
                <Field label="Daily suggestion window" defaultValue="9:00 AM – 4:00 PM" />
              </div>
            )}

            {activeTab === "Auto-Send" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Auto-Send Mode <span className="ml-2 rounded bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">BETA</span></h2>
                <p className="text-sm text-muted-foreground">When enabled, the system can send campaigns automatically based on your rules — without manual approval.</p>
                <Toggle label="Enable Auto-Send" description="Campaigns will send automatically based on rules below" defaultChecked={mockRestaurant.autoSendEnabled} />
                <Field label="Max auto campaigns per week" defaultValue={String(mockRestaurant.maxAutoPerWeek)} />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Allowed days</label>
                  <p className="text-sm text-muted-foreground">{mockRestaurant.autoSendDays.join(", ")}</p>
                </div>
              </div>
            )}

            {activeTab === "Advanced" && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Advanced</h2>
                <Toggle label="Request help with campaigns" description="Flag your account for our team to review and assist with campaigns" defaultChecked={mockRestaurant.doneForYouMode} />
                <Field label="Join Incentive" defaultValue={mockRestaurant.joinIncentive} />
              </div>
            )}

            <Button variant="accent" className="mt-6" onClick={handleSave}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input defaultValue={defaultValue} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}

function Toggle({ label, description, defaultChecked }: { label: string; description: string; defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-input"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
