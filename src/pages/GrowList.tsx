import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { QrCode, Link as LinkIcon, Smartphone, Gift } from "lucide-react";
import { mockRestaurant } from "@/lib/mock-data";

export default function GrowList() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container py-8">
        <ScrollReveal>
          <h1 className="text-2xl font-bold text-foreground">Grow Your List</h1>
          <p className="mt-1 text-sm text-muted-foreground">Give guests easy ways to join your text list</p>
        </ScrollReveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* QR Code */}
          <ScrollReveal delay={80}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">QR Code</h2>
              <p className="mt-1 text-sm text-muted-foreground">Print and place at tables, counter, or register. Guests scan to join your list.</p>
              <div className="mt-4 flex h-40 items-center justify-center rounded-lg bg-muted">
                <div className="text-center">
                  <div className="mx-auto grid h-28 w-28 grid-cols-5 gap-0.5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Sample QR</p>
                </div>
              </div>
              <Button variant="accent" className="mt-4 w-full">Download QR Code</Button>
            </div>
          </ScrollReveal>

          {/* Signup Page */}
          <ScrollReveal delay={160}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <LinkIcon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">Signup Page</h2>
              <p className="mt-1 text-sm text-muted-foreground">Share this link on social media, your website, or anywhere online.</p>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <code className="flex-1 text-sm text-foreground truncate">tabletext.io/join/{mockRestaurant.publicSignupToken}</code>
                <Button variant="outline" size="sm">Copy</Button>
              </div>
              <div className="mt-4 rounded-lg border border-border p-4">
                <p className="text-sm font-medium text-foreground">{mockRestaurant.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">Join our VIP list for exclusive deals</p>
                <div className="mt-3 flex items-center gap-2">
                  <Gift className="h-4 w-4 text-accent" />
                  <p className="text-sm text-accent font-medium">{mockRestaurant.joinIncentive}</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">Customize Page</Button>
            </div>
          </ScrollReveal>

          {/* Keyword Signup */}
          <ScrollReveal delay={240}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">Keyword Signup</h2>
              <p className="mt-1 text-sm text-muted-foreground">Guests text a keyword to join your list. Great for table tents and receipts.</p>
              <div className="mt-4 rounded-lg bg-secondary p-4 text-center">
                <p className="text-lg font-bold text-foreground">Text BELLAS to 55555</p>
                <p className="mt-1 text-sm text-muted-foreground">to join our VIP list</p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Full inbound SMS parsing coming soon. Keyword is stored and ready.</p>
            </div>
          </ScrollReveal>

          {/* Incentive */}
          <ScrollReveal delay={320}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">Join Incentive</h2>
              <p className="mt-1 text-sm text-muted-foreground">What do guests get for signing up? This shows on your signup page and QR landing.</p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-1">Current Incentive</label>
                <input defaultValue={mockRestaurant.joinIncentive} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button variant="accent" className="mt-4">Save Incentive</Button>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
