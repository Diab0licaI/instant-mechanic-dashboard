"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { PAPER, INK, INK_MUTED, LINE, RED, STEEL, BOOKING_STATUS_STYLE } from "@/lib/theme";

type Booking = {
  id: string;
  customer: any;
  vehicle: any;
  service: string;
  mechanic: any;
  status: string;
  amount: number;
  datetime: string; // ISO string
};

type SortKey = "customer" | "amount" | "datetime" | "status";

const PAGE_SIZE = 8;

const STATUS_FILTERS = ["all", "completed", "pending", "in progress", "cancelled"];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("datetime");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data.data ?? []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Reset to page 1 whenever the filtered set changes shape
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = bookings.filter((b) => {
      const customerName = typeof b.customer === "object" ? b.customer?.name : b.customer;
      const vehicleName = typeof b.vehicle === "object" ? `${b.vehicle?.make || ""} ${b.vehicle?.model || ""}` : b.vehicle;
      const serviceName = typeof b.service === "object" ? b.service?.name : b.service;
      const mechanicName = typeof b.mechanic === "object" ? b.mechanic?.name : b.mechanic;

      const matchesSearch =
        !q ||
        b.id?.toLowerCase().includes(q) ||
        customerName?.toLowerCase().includes(q) ||
        vehicleName?.toLowerCase().includes(q) ||
        serviceName?.toLowerCase().includes(q) ||
        mechanicName?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || b.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
    rows = rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "amount") {
        cmp = (a.amount ?? 0) - (b.amount ?? 0);
      } else if (sortKey === "datetime") {
        cmp = new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
      } else if (sortKey === "customer") {
        const nameA = String(typeof a.customer === "object" ? a.customer?.name ?? "" : a.customer ?? "");
        const nameB = String(typeof b.customer === "object" ? b.customer?.name ?? "" : b.customer ?? "");
        cmp = nameA.localeCompare(nameB);
      } else {
        cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [bookings, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortHeader = ({ label, sortable }: { label: string; sortable?: SortKey }) => (
    <th
      className="px-5 py-3 font-medium"
      onClick={sortable ? () => toggleSort(sortable) : undefined}
      style={{ cursor: sortable ? "pointer" : "default" }}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortable && sortKey === sortable && (
          sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
        )}
      </span>
    </th>
  );

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
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="mt-1 text-sm" style={{ color: INK_MUTED }}>
          Every service request, searchable and sortable.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex items-center gap-2 rounded-sm border px-3 py-2 sm:w-72"
          style={{ borderColor: LINE }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: INK_MUTED }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ID, customer, vehicle..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-current"
            style={{ color: INK }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => {
            const active = statusFilter === s;
            const style = s === "all" ? null : BOOKING_STATUS_STYLE[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="rounded-sm border px-3 py-1.5 text-xs capitalize transition-colors"
                style={{
                  borderColor: active ? (style?.color ?? INK) : LINE,
                  color: active ? (style?.color ?? INK) : INK_MUTED,
                  background: active ? (style ? `${style.color}14` : "#F1F0EC") : "transparent",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-sm border" style={{ borderColor: LINE }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-xs select-none" style={{ borderColor: LINE, color: INK_MUTED }}>
                <th className="px-5 py-3 font-medium">Booking ID</th>
                <SortHeader label="Customer" sortable="customer" />
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Mechanic</th>
                <SortHeader label="Status" sortable="status" />
                <SortHeader label="Amount" sortable="amount" />
                <SortHeader label="Date / time" sortable="datetime" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-sm" style={{ color: INK_MUTED }}>
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      No bookings match your search.
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((b) => {
                  const status = BOOKING_STATUS_STYLE[b.status?.toLowerCase()] ?? {
                    label: b.status || "Unknown",
                    color: INK_MUTED,
                  };

                  const customerName = typeof b.customer === "object" ? b.customer?.name ?? "N/A" : b.customer ?? "N/A";
                  const vehicleText = typeof b.vehicle === "object" 
                    ? `${b.vehicle?.make || ""} ${b.vehicle?.model || ""} ${b.vehicle?.registrationNumber ? `(${b.vehicle.registrationNumber})` : ""}`.trim() || "Standard Vehicle" 
                    : b.vehicle || "Standard Vehicle";
                  const mechanicName = typeof b.mechanic === "object" ? b.mechanic?.name : b.mechanic;

                  return (
                    <tr key={b.id} className="border-b last:border-0" style={{ borderColor: LINE }}>
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: INK_MUTED }}>{b.id}</td>
                      <td className="px-5 py-3 font-medium">{customerName}</td>
                      <td className="px-5 py-3" style={{ color: INK_MUTED }}>{vehicleText}</td>
                      <td className="px-5 py-3">
                         {typeof b.service === "object" ? b.service?.name ?? "General Service" : b.service ?? "General Service"}
                      </td>
                      <td className="px-5 py-3" style={{ color: STEEL }}>{mechanicName || "Unassigned"}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: status.color }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono tabular-nums">
                        {b.amount ? `₹${b.amount.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: INK_MUTED }}>
                        {b.datetime ? new Date(b.datetime).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        }) : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between border-t px-5 py-3 text-xs"
          style={{ borderColor: LINE, color: INK_MUTED }}
        >
          <span>
            {filtered.length === 0
              ? "0 results"
              : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded-sm border disabled:opacity-40"
              style={{ borderColor: LINE }}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 font-mono">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-sm border disabled:opacity-40"
              style={{ borderColor: LINE }}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}