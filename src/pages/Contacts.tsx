import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { mockContacts } from "@/lib/mock-data";
import { useState } from "react";
import { Users, UserPlus, Upload, Search } from "lucide-react";

export default function Contacts() {
  const [search, setSearch] = useState("");
  const filtered = mockContacts.filter(c =>
    `${c.firstName} ${c.lastName} ${c.mobileNumber}`.toLowerCase().includes(search.toLowerCase())
  );
  const optedIn = mockContacts.filter(c => c.optedIn).length;
  const optedOut = mockContacts.filter(c => c.optedOut).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container py-8">
        <ScrollReveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5" /> Import CSV</Button>
              <Button variant="accent" size="sm"><UserPlus className="h-3.5 w-3.5" /> Add Contact</Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={80}>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Total Contacts</p>
              <p className="mt-1 text-xl font-bold text-foreground tabular-nums">{mockContacts.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Opted In</p>
              <p className="mt-1 text-xl font-bold text-success tabular-nums">{optedIn}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Opted Out</p>
              <p className="mt-1 text-xl font-bold text-destructive tabular-nums">{optedOut}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Search and table */}
        <ScrollReveal delay={160}>
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Tags</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{c.firstName} {c.lastName}</td>
                    <td className="p-4 text-muted-foreground tabular-nums">{c.mobileNumber}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.optedIn ? "bg-secondary text-success" : "bg-muted text-destructive"}`}>
                        {c.optedIn ? "Opted In" : "Opted Out"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {c.tags.map(t => (
                          <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{c.source}</td>
                    <td className="p-4 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
