import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useRestaurant, useContacts, useAddContact } from "@/hooks/use-data";
import { useState } from "react";
import { UserPlus, Upload, Search, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function Contacts() {
  const { data: restaurant } = useRestaurant();
  const { data: contacts, isLoading } = useContacts(restaurant?.id);
  const addContact = useAddContact(restaurant?.id);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ first_name: "", last_name: "", mobile_number: "", email: "" });

  const filtered = (contacts ?? []).filter(c =>
    `${c.first_name} ${c.last_name} ${c.mobile_number}`.toLowerCase().includes(search.toLowerCase())
  );
  const optedIn = (contacts ?? []).filter(c => c.opted_in && !c.opted_out).length;
  const optedOut = (contacts ?? []).filter(c => c.opted_out).length;

  const handleAdd = async () => {
    if (!newContact.first_name || !newContact.mobile_number) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      await addContact.mutateAsync(newContact);
      toast.success("Contact added");
      setShowAdd(false);
      setNewContact({ first_name: "", last_name: "", mobile_number: "", email: "" });
    } catch {
      toast.error("Failed to add contact");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container py-8">
        <ScrollReveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5" /> Import CSV</Button>
              <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}><UserPlus className="h-3.5 w-3.5" /> Add Contact</Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Add contact modal */}
        {showAdd && (
          <ScrollReveal>
            <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Add Contact</h3>
                <button onClick={() => setShowAdd(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="First name *" value={newContact.first_name} onChange={e => setNewContact(p => ({ ...p, first_name: e.target.value }))} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input placeholder="Last name" value={newContact.last_name} onChange={e => setNewContact(p => ({ ...p, last_name: e.target.value }))} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input placeholder="Phone number *" value={newContact.mobile_number} onChange={e => setNewContact(p => ({ ...p, mobile_number: e.target.value }))} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input placeholder="Email (optional)" value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button variant="accent" className="mt-4" onClick={handleAdd} disabled={addContact.isPending}>
                {addContact.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Contact"}
              </Button>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={80}>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Total Contacts</p>
              <p className="mt-1 text-xl font-bold text-foreground tabular-nums">{(contacts ?? []).length}</p>
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
            {isLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-medium text-foreground">No contacts found</p>
                <p className="mt-1 text-sm text-muted-foreground">Add contacts or share your signup link to grow your list.</p>
              </div>
            ) : (
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
                      <td className="p-4 font-medium text-foreground">{c.first_name} {c.last_name}</td>
                      <td className="p-4 text-muted-foreground tabular-nums">{c.mobile_number}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.opted_in && !c.opted_out ? "bg-secondary text-success" : "bg-muted text-destructive"}`}>
                          {c.opted_in && !c.opted_out ? "Opted In" : "Opted Out"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {(c.tags ?? []).map((t: string) => (
                            <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{c.source}</td>
                      <td className="p-4 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
