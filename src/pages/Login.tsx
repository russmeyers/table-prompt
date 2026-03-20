import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/dashboard");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (error) throw error;
        toast.success("Check your email to confirm your account");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <ScrollReveal>
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">TableText</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <h1 className="text-xl font-bold text-foreground">{isSignUp ? "Create account" : "Welcome back"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignUp ? "Start your free trial" : "Log in to your dashboard"}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@restaurant.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
              </div>
              <Button variant="accent" className="w-full" type="submit" disabled={loading}>
                {loading ? "..." : isSignUp ? "Create Account" : "Log In"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
