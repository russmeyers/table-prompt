import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MessageSquare, ArrowRight, ArrowLeft, Upload, Check } from "lucide-react";
import { toast } from "sonner";

const steps = ["Restaurant Info", "Marketing Setup", "Import Contacts", "Review"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleFinish = () => {
    toast.success("You're all set!", { description: "Welcome to TableText." });
    navigate("/dashboard");
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
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-accent text-accent-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`hidden text-sm sm:block ${i === step ? "font-medium text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < steps.length - 1 && <div className="hidden h-px w-8 bg-border sm:block" />}
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
                  <InputField label="Restaurant Name" placeholder="Bella's Italian Kitchen" />
                  <InputField label="Your Name" placeholder="Maria Rossi" />
                  <InputField label="Mobile Number" placeholder="(555) 123-4567" />
                  <InputField label="Email" placeholder="maria@bellaskitchen.com" type="email" />
                  <InputField label="Restaurant Type" placeholder="Italian, Mexican, BBQ..." />
                  <InputField label="Timezone" placeholder="Eastern, Central, Pacific..." />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Marketing preferences</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Slow days (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                      <label key={d} className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">
                        <input type="checkbox" className="rounded" />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Service type</label>
                  <div className="flex gap-2">
                    {["Lunch", "Dinner", "Both"].map(s => (
                      <label key={s} className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">
                        <input type="radio" name="service" />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Promotion style</label>
                  <div className="flex flex-wrap gap-2">
                    {["Discounts", "Events", "Specials", "Loyalty / VIP"].map(p => (
                      <label key={p} className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">
                        <input type="checkbox" className="rounded" />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-surface-warm p-3">
                  <p className="text-sm text-foreground font-medium">✓ Approval required before sending</p>
                  <p className="text-sm text-muted-foreground">Nothing goes out without your say-so. You can change this later.</p>
                </div>
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
                <p className="text-xs text-muted-foreground">Expected columns: first_name, last_name, phone. You can also skip this step and add contacts later.</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">You're all set!</h2>
                <p className="text-sm text-muted-foreground">Here's a summary of your setup. You can change anything in Settings.</p>
                <div className="space-y-3">
                  <SummaryRow label="Restaurant" value="Bella's Italian Kitchen" />
                  <SummaryRow label="Owner" value="Maria Rossi" />
                  <SummaryRow label="Slow Days" value="Tuesday, Wednesday" />
                  <SummaryRow label="Service" value="Both" />
                  <SummaryRow label="Approval" value="Required before sending" />
                  <SummaryRow label="Contacts" value="Imported 0 (add later)" />
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : <div />}
              {step < steps.length - 1 ? (
                <Button variant="accent" onClick={() => setStep(step + 1)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="accent" onClick={handleFinish}>
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}

function InputField({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
