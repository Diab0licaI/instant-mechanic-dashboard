"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Wrench, Phone, Mail } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { PAPER, INK, INK_MUTED, LINE, RED, STEEL, MECHANIC_STATUS_STYLE } from "@/lib/theme";

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await api.get("/mechanics");
        setMechanics(response.data.data);
      } catch (error) {
        console.error("Error fetching mechanics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center" style={{ background: PAPER }}>
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: RED, borderRightColor: LINE }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-sm p-6 pb-24" style={{ background: PAPER, color: INK }}>
      <div className="border-b pb-4" style={{ borderColor: LINE }}>
        <h1 className="text-2xl font-semibold tracking-tight">Mechanic network</h1>
        <p className="mt-1 text-sm" style={{ color: INK_MUTED }}>
          On-duty technicians, active assignments, and completion stats.
        </p>
      </div>

      <div className="overflow-hidden rounded-sm border" style={{ borderColor: LINE }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-xs" style={{ borderColor: LINE, color: INK_MUTED }}>
              <th className="px-5 py-3 font-medium">Mechanic</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Jobs completed</th>
              <th className="px-5 py-3 font-medium">Current / last booking</th>
            </tr>
          </thead>
          <tbody>
            {mechanics.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm" style={{ color: INK_MUTED }}>
                  No mechanics found.
                </td>
              </tr>
            ) : (
              mechanics.map((mech) => {
                const status = MECHANIC_STATUS_STYLE[mech.status?.toLowerCase()] ?? {
                  label: mech.status || "Unknown",
                  color: INK_MUTED,
                };
                return (
                  <tr key={mech.id} className="border-b last:border-0" style={{ borderColor: LINE }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
                          style={{ background: LINE, color: STEEL }}
                        >
                          <Wrench className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="font-medium">{mech.name}</div>
                          <div className="text-xs" style={{ color: INK_MUTED }}>{mech.specialty || "General repair"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: INK_MUTED }}>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 shrink-0" /> {mech.email}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Phone className="h-3 w-3 shrink-0" /> {mech.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: status.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
                        {status.label}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono tabular-nums">{mech.jobsCompleted ?? 0}</td>
                    <td className="px-5 py-3 text-sm">
                      {mech.currentBooking ? (
                        <span className="font-mono text-xs" style={{ color: STEEL }}>{mech.currentBooking}</span>
                      ) : (
                        <span className="text-xs italic" style={{ color: INK_MUTED }}>No active dispatch</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <BottomNav />
    </div>
  );
}