"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Wrench, ShieldCheck, Activity, ArrowRight, CarFront } from "lucide-react";
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FCFAF7] text-slate-900 selection:bg-orange-500 selection:text-white">
      
      {/* Left Branding Column (Matches the warm cream theme & car graphic aesthetic) */}
      <div className="lg:col-span-7 relative hidden lg:flex flex-col justify-between p-12 bg-[#FCFAF7] border-r border-orange-950/10 overflow-hidden">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb20_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb20_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
        
        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">Instant Mechanic</span>
        </div>

        {/* Center Hero Copy */}
        <div className="relative z-10 space-y-6 max-w-xl my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 text-xs font-bold uppercase tracking-wider">
            <CarFront className="w-4 h-4" /> Building India's Largest Car Care Platform
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Your Car Deserves <br />
            <span className="text-slate-900">Expert Care,</span> <br />
            <span className="text-orange-600">Not a Gamble.</span>
          </h1>
          
          <p className="text-slate-600 text-base leading-relaxed max-w-lg font-medium">
            One platform for every car need — instant roadside help in 20 minutes, AI-powered diagnosis, transparent repair bills, and complete car care membership across Delhi NCR.
          </p>

          <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-slate-500 border-t border-slate-200">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-4 h-4" /> Secure JWT Auth
            </span>
            <span className="flex items-center gap-1.5 text-orange-700">
              <Activity className="w-4 h-4" /> Live 30s Polling Telemetry
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 font-medium">
          © 2026 Instant Mechanic Inc. All rights reserved.
        </div>
      </div>

      {/* Right Login Form Column (Clean Contrast White Theme) */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 bg-white text-slate-900 shadow-sm">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-orange-600 text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-bold text-base">Instant Mechanic</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500">Enter your credentials to access the operations console.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 text-xs rounded-lg bg-rose-50 border border-rose-200 text-rose-600 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-slate-200 focus:border-orange-600 focus:ring-orange-600 text-slate-900 bg-slate-50/50 rounded-xl"
                placeholder="admin@instantmechanic.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-slate-200 focus:border-orange-600 focus:ring-orange-600 text-slate-900 bg-slate-50/50 rounded-xl"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all shadow-lg shadow-orange-600/25 rounded-xl gap-2 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign in to Dashboard <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/60 text-xs space-y-1.5 text-slate-700">
            <p className="font-bold text-orange-900">Demo Credentials:</p>
            <p><span className="text-slate-500 font-medium">Email:</span> <span className="font-mono font-semibold">admin@instantmechanic.com</span></p>
            <p><span className="text-slate-500 font-medium">Password:</span> <span className="font-mono font-semibold">admin123</span></p>
          </div>

        </div>
      </div>

    </div>
  );
}