import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <Link to="/onboarding">See How It Works</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border/60 bg-background px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-2">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">How It Works</a>
            <a href="#features" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Features</a>
            <Link to="/pricing" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Pricing</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Log In</Link>
            <Button variant="accent" size="sm" className="mt-1" asChild>
              <Link to="/onboarding" onClick={() => setMenuOpen(false)}>See How It Works</Link>
            </Button>
          </div>
        </div>
      )}
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
