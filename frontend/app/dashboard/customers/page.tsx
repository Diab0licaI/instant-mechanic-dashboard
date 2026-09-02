"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Users, Mail, Phone, Car } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { PAPER, INK, INK_MUTED, LINE, RED, STEEL } from "@/lib/theme";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/customers");
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
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
        <h1 className="text-2xl font-semibold tracking-tight">Customer directory</h1>
        <p className="mt-1 text-sm" style={{ color: INK_MUTED }}>
          Registered users, contact details, and vehicle profiles.
        </p>
      </div>

      <div className="overflow-hidden rounded-sm border" style={{ borderColor: LINE }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-xs" style={{ borderColor: LINE, color: INK_MUTED }}>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Vehicle</th>
              <th className="px-5 py-3 text-right font-medium">Total bookings</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm" style={{ color: INK_MUTED }}>
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b last:border-0" style={{ borderColor: LINE }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
                        style={{ background: LINE, color: STEEL }}
                      >
                        <Users className="h-4 w-4" />
                      </span>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: INK_MUTED }}>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 shrink-0" /> {customer.email}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Phone className="h-3 w-3 shrink-0" /> {customer.phone || "N/A"}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-3.5 w-3.5" style={{ color: INK_MUTED }} />
                      {customer.vehicleModel || customer.vehicle || "Standard vehicle"}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums">
                    {customer.totalBookings ?? customer.bookingsCount ?? 1}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BottomNav />
    </div>
  );
}