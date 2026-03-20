import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardNav } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Settings as SettingsIcon, Save, Crown, MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserRow {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: string | null;
  created_at: string;
}

interface AppSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  updated_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"users" | "settings" | "test-sms">("users");
  const [loading, setLoading] = useState(true);

  // Test SMS state
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("This is a test message from TableText! 🍕");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/login"); return; }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    await Promise.all([loadUsers(), loadSettings()]);
    setLoading(false);
  }

  async function loadUsers() {
    const { data: profiles } = await supabase.from("profiles").select("user_id, email, display_name, created_at");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    if (profiles) {
      const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);
      setUsers(profiles.map(p => ({ ...p, role: roleMap.get(p.user_id) || "user" })));
    }
  }

  async function loadSettings() {
    const { data } = await supabase.from("app_settings").select("*").order("key");
    if (data) {
      setSettings(data);
      const edits: Record<string, string> = {};
      data.forEach(s => { edits[s.key] = s.value || ""; });
      setEditedSettings(edits);
    }
  }

  async function toggleAdmin(userId: string, currentRole: string | null) {
    if (currentRole === "admin") {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      toast.success("Admin role removed");
    } else {
      await supabase.from("user_roles").upsert({ user_id: userId, role: "admin" as any });
      toast.success("Admin role granted");
    }
    await loadUsers();
  }

  async function saveSetting(key: string) {
    const { error } = await supabase
      .from("app_settings")
      .update({ value: editedSettings[key] })
      .eq("key", key);
    if (error) toast.error("Failed to save: " + error.message);
    else { toast.success(`Setting "${key}" saved`); await loadSettings(); }
  }

  async function saveAllSettings() {
    for (const key of Object.keys(editedSettings)) {
      await supabase.from("app_settings").update({ value: editedSettings[key] }).eq("key", key);
    }
    toast.success("All settings saved");
    await loadSettings();
  }

  async function sendTestSMS() {
    if (!testPhone.trim() || !testMessage.trim()) {
      toast.error("Enter a phone number and message");
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-sms", {
        body: { action: "send_single", phone: testPhone.trim(), message: testMessage.trim() },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success("Test SMS sent!", { description: `Delivered to ${testPhone}` });
      } else {
        toast.error("SMS failed", { description: data?.error || "Unknown error" });
      }
    } catch (err: any) {
      toast.error("Failed to send", { description: err.message });
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="container max-w-4xl py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="h-64 rounded-xl bg-muted" />
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="container max-w-lg py-20 text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h1 className="mt-4 text-xl font-bold text-foreground">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">You need admin privileges to access this page.</p>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-4xl py-10">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage users, settings, and test SMS</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={60}>
          <div className="mt-8 flex gap-1 rounded-lg border border-border bg-muted p-1">
            {[
              { id: "users" as const, icon: Users, label: "Users" },
              { id: "settings" as const, icon: SettingsIcon, label: "Settings" },
              { id: "test-sms" as const, icon: MessageSquare, label: "Test SMS" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Users tab */}
        {activeTab === "users" && (
          <ScrollReveal delay={120}>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-4">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
              <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="p-4 font-medium">User</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Joined</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No users yet.</td></tr>
                    ) : users.map(u => (
                      <tr key={u.user_id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{u.display_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            u.role === "admin" ? "bg-amber-50 text-amber-700" : "bg-muted text-muted-foreground"
                          }`}>
                            {u.role === "admin" && <Crown className="h-3 w-3" />}
                            {u.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="p-4">
                          <Button variant={u.role === "admin" ? "outline" : "default"} size="sm" onClick={() => toggleAdmin(u.user_id, u.role)}>
                            {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Settings tab */}
        {activeTab === "settings" && (
          <ScrollReveal delay={120}>
            <div className="mt-6 space-y-4">
              {settings.map(s => (
                <div key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-foreground">{s.key}</label>
                      {s.description && <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>}
                      <input
                        value={editedSettings[s.key] || ""}
                        onChange={e => setEditedSettings(prev => ({ ...prev, [s.key]: e.target.value }))}
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">Last updated: {new Date(s.updated_at).toLocaleString()}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => saveSetting(s.key)}>
                      <Save className="h-3.5 w-3.5" /> Save
                    </Button>
                  </div>
                </div>
              ))}
              <div className="rounded-lg bg-surface-warm px-4 py-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Note:</strong> The Textbelt API key is stored as a secure environment secret.
                  These settings control application behavior.
                </p>
              </div>
              <Button variant="accent" onClick={saveAllSettings}>
                <Save className="h-4 w-4" /> Save All Settings
              </Button>
            </div>
          </ScrollReveal>
        )}

        {/* Test SMS tab */}
        {activeTab === "test-sms" && (
          <ScrollReveal delay={120}>
            <div className="mt-6 space-y-5">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-base font-semibold text-foreground">Send a Test SMS</h3>
                <p className="mt-1 text-sm text-muted-foreground">Test your Textbelt integration by sending a message to any phone number.</p>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={testPhone}
                      onChange={e => setTestPhone(e.target.value)}
                      placeholder="+15551234567"
                      className="w-full max-w-sm rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Include country code (e.g. +1 for US)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                    <textarea
                      value={testMessage}
                      onChange={e => setTestMessage(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{testMessage.length} characters · {Math.ceil(testMessage.length / 160)} segment{Math.ceil(testMessage.length / 160) > 1 ? "s" : ""}</p>
                  </div>
                  <Button variant="accent" onClick={sendTestSMS} disabled={sending}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {sending ? "Sending..." : "Send Test"}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-surface-warm px-4 py-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Tip:</strong> Each test SMS uses one Textbelt credit. Use your own phone number to verify delivery.
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </main>
    </div>
  );
}
