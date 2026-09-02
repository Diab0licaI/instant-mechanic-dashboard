"use client";

import { MapPin, Activity, ShieldCheck, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const regions = [
  "Gurugram", "Delhi", "Noida", "Faridabad", "Ghaziabad",
  "Greater Noida", "Manesar", "Dwarka", "Rohini",
  "NH48 / NH8", "DND Corridor", "Indirapuram"
];

export default function CoverageSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] bg-[linear-gradient(to_right,#f1f0ea_1px,transparent_1px),linear-gradient(to_bottom,#f1f0ea_1px,transparent_1px)] bg-[size:3rem_3rem] border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Service Coverage
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Delhi NCR — <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Every Corner Covered.
            </span>
          </h2>
          
          <p className="text-slate-600 text-base leading-relaxed max-w-xl">
            Deploying 500+ active mechanics across the region with an average 20-minute roadside response time. Rapidly expanding to top Indian cities by 2028.
          </p>

          {/* Region Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {regions.map((city, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-medium text-slate-700 shadow-2xs hover:border-orange-300 transition-all cursor-default"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                {city}
              </span>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-orange-900 uppercase tracking-wide">
                🚀 Expanding to Mumbai, Pune, Bangalore Soon
              </p>
              <p className="text-xs text-orange-700/80">Speed with trust, nationwide.</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-orange-600 shrink-0" />
          </div>
        </div>


        <div className="lg:col-span-5">
          <Card className="border-slate-200/80 bg-white/80 backdrop-blur-md shadow-xl overflow-hidden relative rounded-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-60 pointer-events-none" />
            
            <CardContent className="p-6 relative z-10 space-y-6">
              {/* Simulated Map Grid UI */}
              <div className="h-64 w-full bg-amber-50/50 rounded-xl border border-amber-100/60 relative overflow-hidden flex items-center justify-center">
                {/* Simulated radar pulse points */}
                <div className="absolute top-12 left-16 w-3 h-3 bg-orange-500 rounded-full animate-ping opacity-75" />
                <div className="absolute top-12 left-16 w-3 h-3 bg-orange-600 rounded-full" />
                
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-orange-500 rounded-full animate-ping opacity-75 delay-300" />
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-orange-600 rounded-full" />

                <div className="absolute top-28 right-28 w-2.5 h-2.5 bg-blue-600 rounded-full" />
                <div className="absolute bottom-12 left-28 w-2.5 h-2.5 bg-emerald-600 rounded-full" />

            
                <div className="bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-xl shadow-lg border border-slate-100 text-center space-y-1">
                  <p className="text-sm font-bold text-slate-900">Delhi NCR Operations</p>
                  <p className="text-xs text-slate-500">500+ mechanics • 20 min response</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                <span>HQ: Sector 75, Gurugram</span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live 24x7
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
}