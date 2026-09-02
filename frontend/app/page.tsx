"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Wrench, ShieldCheck, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@instantmechanic.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token || response.data.data?.token;
      
      if (token) {
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        setError("Invalid credentials returned from server.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to authenticate. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-white selection:bg-blue-600 selection:text-white">

      <div className="lg:col-span-7 relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border-r border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Instant Mechanic</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" /> Enterprise Operations Control
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Real-time vehicle service command center.
          </h1>
          
          <p className="text-slate-400 text-base leading-relaxed">
            Monitor active dispatches, track field technicians, analyze service revenue metrics, and streamline operations seamlessly across the network.
          </p>

          <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 font-medium border-t border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Secure JWT Auth
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <Activity className="w-4 h-4" /> Live 30s Polling
            </span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 Instant Mechanic Inc. All rights reserved.
        </div>
      </div>

      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 bg-white text-slate-900">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-blue-600 text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-bold text-base">Instant Mechanic</span>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500">Enter your credentials to access the operations console.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 text-xs rounded-lg bg-rose-50 border border-rose-200 text-rose-600 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-slate-200 focus:border-blue-600 focus:ring-blue-600 text-slate-900"
                placeholder="admin@instantmechanic.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-slate-200 focus:border-blue-600 focus:ring-blue-600 text-slate-900"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-600/20 gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign in to Dashboard <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1 text-slate-600">
            <p className="font-semibold text-slate-900">Demo Credentials:</p>
            <p><span className="text-slate-500">Email:</span> admin@instantmechanic.com</p>
            <p><span className="text-slate-500">Password:</span> admin123</p>
          </div>

        </div>
      </div>

    </div>
  );
}