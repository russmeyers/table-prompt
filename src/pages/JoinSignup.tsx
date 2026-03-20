import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { mockRestaurant } from "@/lib/mock-data";
import { MessageSquare, Gift, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function JoinSignup() {
  const { token } = useParams();
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { toast.error("Please agree to receive text messages"); return; }
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <ScrollReveal>
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>

            {!submitted ? (
              <>
                <h1 className="mt-5 text-xl font-bold text-foreground">{mockRestaurant.name}</h1>
                <p className="mt-2 text-sm text-muted-foreground">Join our VIP text list for exclusive deals and specials.</p>

                {mockRestaurant.joinIncentive && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-accent/10 px-3 py-2">
                    <Gift className="h-4 w-4 text-accent" />
                    <p className="text-sm font-medium text-accent">{mockRestaurant.joinIncentive}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 text-left space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={e => setConsent(e.target.checked)}
                      className="mt-0.5 rounded"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I agree to receive text messages from {mockRestaurant.name}. Message & data rates may apply. Reply STOP to unsubscribe.
                    </span>
                  </label>
                  <Button variant="accent" className="w-full" type="submit">
                    Join VIP List
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="mt-4 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-secondary">
                  <Check className="h-6 w-6 text-success" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-foreground">You're in!</h2>
                <p className="mt-2 text-sm text-muted-foreground">Welcome to the {mockRestaurant.name} VIP list. You'll get exclusive deals and specials right to your phone.</p>
                {mockRestaurant.joinIncentive && (
                  <div className="mt-4 rounded-lg bg-accent/10 px-3 py-2">
                    <p className="text-sm font-medium text-accent">Your reward: {mockRestaurant.joinIncentive}</p>
                  </div>
                )}
              </>
            )}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">Powered by TableText</p>
        </div>
      </ScrollReveal>
    </div>
  );
}
