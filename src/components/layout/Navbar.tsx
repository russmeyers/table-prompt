import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MessageSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">TableText</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <Link to="/onboarding">Start Free Trial</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export function DashboardNav() {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Campaigns", path: "/campaigns" },
    { label: "Contacts", path: "/contacts" },
    { label: "Grow List", path: "/grow" },
    { label: "Calendar", path: "/calendar" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <MessageSquare className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground tracking-tight">TableText</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  location.pathname === item.path
                    ? "bg-secondary text-secondary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground">
            <option>Bella's Italian Kitchen</option>
          </select>
          <Link to="/admin" className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Admin">
            <Shield className="h-4 w-4" />
          </Link>
          <button
            onClick={async () => { await supabase.auth.signOut(); toast.success("Logged out"); window.location.href = "/login"; }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
