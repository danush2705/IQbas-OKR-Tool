import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import logo from "@/assets/iqbas-logo.png";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      const to = location.state?.from?.pathname || "/";
      navigate(to, { replace: true });
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Branding */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-primary text-primary-foreground p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={logo} alt="IQbas logo" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">IQbas</h1>
            <p className="text-sm opacity-90">OKR Management Platform</p>
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-center max-w-md leading-snug">
          Achieve Your Goals, Together.
        </h2>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <Card className="w-full max-w-md p-6 shadow-card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">Welcome back. Please enter your details.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@goalsforge.com"
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-danger">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="flex justify-end">
              <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
                Forgot Password?
              </button>
            </div>
          </form>

          <div className="mt-6 text-xs text-muted-foreground">
            <div>Use one of the mock accounts:</div>
            <ul className="mt-1 space-y-1">
              <li>ceo@iqbas.org</li>
              <li>manager@iqbas.org</li>
              <li>user@iqbas.org</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
