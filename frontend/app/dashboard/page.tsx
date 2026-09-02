"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Wrench, CalendarCheck, IndianRupee, Users,
  RefreshCw, CheckCircle2, Clock, XCircle, Layers, MapPin,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/bottom-nav";
import {
  PAPER, INK, INK_MUTED, LINE, RED, RED_TINT, RED_DEEP, STEEL, EMBER, MOSS,
  monoTick, BOOKING_STATUS_STYLE, MECHANIC_STATUS_STYLE,
} from "@/lib/theme";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [kpiRes, analyticsRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/dashboard/analytics"),
      ]);

      setDashboardData({
        ...kpiRes.data.data,
        ...(analyticsRes.data.data || {}),
      });
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

   
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="flex h-96 items-center justify-center" style={{ background: PAPER }}>
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: RED, borderRightColor: LINE }}
        />
      </div>
    );
  }

  const strip = [
    { label: "Total bookings", value: dashboardData?.totalBookings ?? 0, icon: Layers, tone: INK },
    { label: "Today", value: dashboardData?.todayBookings ?? 0, icon: CalendarCheck, tone: STEEL },
    { label: "Completed", value: dashboardData?.completedBookings ?? 0, icon: CheckCircle2, tone: MOSS },
    { label: "Pending", value: dashboardData?.pendingBookings ?? 0, icon: Clock, tone: EMBER },
    { label: "Cancelled", value: dashboardData?.cancelledBookings ?? 0, icon: XCircle, tone: INK_MUTED },
  ];

  const bookingsOverTime = dashboardData?.bookingsOverTime || [
    { date: "Day 1", count: 4 }, { date: "Day 2", count: 7 }, { date: "Day 3", count: 5 },
    { date: "Day 4", count: 10 }, { date: "Day 5", count: 8 }, { date: "Day 6", count: 12 },
  ];

  const revenueOverTime = dashboardData?.revenueOverTime || [
    { date: "Mon", revenue: 4500 }, { date: "Tue", revenue: 8200 }, { date: "Wed", revenue: 6100 },
    { date: "Thu", revenue: 11000 }, { date: "Fri", revenue: 9500 }, { date: "Sat", revenue: 14000 },
  ];

  const bookingStatusData = dashboardData?.bookingStatus || [
    { name: "Completed", value: dashboardData?.completedBookings || 45 },
    { name: "Pending", value: dashboardData?.pendingBookings || 15 },
    { name: "In progress", value: 20 },
    { name: "Cancelled", value: dashboardData?.cancelledBookings || 5 },
  ];

  const serviceCategories = dashboardData?.serviceCategories || [
    { name: "Roadside assist", value: 38 },
    { name: "Battery / tyre", value: 26 },
    { name: "Garage repair", value: 22 },
    { name: "Health check", value: 14 },
  ];

  const PIE_COLORS = [MOSS, EMBER, STEEL, INK_MUTED];

  const recentBookings = dashboardData?.recentBookings || [
    { id: "IM-4021", customer: "Rohit Sharma", service: "Battery Jumpstart", area: "Sector 75, Gurugram", mechanic: "Deepak Yadav", status: "completed", amount: 499, time: "8 min ago" },
    { id: "IM-4020", customer: "Anjali Verma", service: "Towing", area: "NH48, Gurugram", mechanic: "Sanjay Kumar", status: "in progress", amount: 1899, time: "22 min ago" },
    { id: "IM-4019", customer: "Karan Mehta", service: "Flat Tyre", area: "Rohini, Delhi", mechanic: "Unassigned", status: "pending", amount: 349, time: "31 min ago" },
    { id: "IM-4018", customer: "Priya Kapoor", service: "AI Diagnosis → Repair", area: "DLF Phase 2", mechanic: "Ramesh Chauhan", status: "completed", amount: 2350, time: "1 hr ago" },
    { id: "IM-4017", customer: "Vikram Tandon", service: "Health Check", area: "Dwarka, Delhi", mechanic: "Deepak Yadav", status: "completed", amount: 0, time: "2 hr ago" },
    { id: "IM-4016", customer: "Udit Kumar", service: "Fuel Delivery", area: "Vatika Business Park", mechanic: "—", status: "cancelled", amount: 0, time: "3 hr ago" },
  ];

  const mechanics = dashboardData?.mechanicStatus || [
    { name: "Deepak Yadav", area: "Gurugram", status: "on-job", jobsToday: 5 },
    { name: "Sanjay Kumar", area: "NH48 / Faridabad", status: "on-job", jobsToday: 3 },
    { name: "Ramesh Chauhan", area: "Dwarka", status: "available", jobsToday: 4 },
    { name: "Imran Khan", area: "Noida", status: "available", jobsToday: 2 },
    { name: "Suresh Pal", area: "Rohini", status: "offline", jobsToday: 0 },
  ];

  return (
    <div className="space-y-6 rounded-sm p-6 pb-24" style={{ background: PAPER, color: INK }}>
      {/* Header */}
      <div className="flex items-end justify-between border-b pb-4" style={{ borderColor: LINE }}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dispatch overview</h1>
          <p className="mt-1 text-sm" style={{ color: INK_MUTED }}>
            Instant Mechanic · Delhi NCR · live, refreshed every 30 seconds.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboardData}
          className="gap-2 rounded-sm border"
          style={{ borderColor: LINE, color: INK }}
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      <div
        className="grid grid-cols-2 divide-y rounded-sm border sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-5"
        style={{ borderColor: LINE }}
      >
        {strip.map((item, i) => (
          <div key={i} className="flex flex-col gap-2 p-4" style={{ borderColor: LINE }}>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: INK_MUTED }}>
              <item.icon className="h-3.5 w-3.5" style={{ color: item.tone }} />
              {item.label}
            </div>
            <div className="font-mono text-2xl font-medium tabular-nums" style={{ color: item.tone }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

     
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border sm:grid-cols-3" style={{ borderColor: LINE, background: LINE }}>
        <div className="flex flex-col justify-between gap-4 p-6" style={{ background: RED_TINT }}>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: RED_DEEP }}>
            <IndianRupee className="h-3.5 w-3.5" /> Total revenue
          </div>
          <div>
            <div className="font-mono text-3xl font-semibold tabular-nums" style={{ color: RED_DEEP }}>
              ₹{(dashboardData?.totalRevenue ?? 0).toLocaleString()}
            </div>
            <p className="mt-1 text-xs" style={{ color: RED_DEEP }}>up 12.5% vs last month</p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 p-6" style={{ background: PAPER }}>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: INK_MUTED }}>
            <Wrench className="h-3.5 w-3.5" style={{ color: STEEL }} /> Active mechanics
          </div>
          <div className="font-mono text-3xl font-semibold tabular-nums">{dashboardData?.activeMechanics ?? 0}</div>
        </div>
        <div className="flex flex-col justify-between gap-4 p-6" style={{ background: PAPER }}>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: INK_MUTED }}>
            <Users className="h-3.5 w-3.5" style={{ color: STEEL }} /> New customers, this week
          </div>
          <div className="font-mono text-3xl font-semibold tabular-nums">{dashboardData?.newCustomers ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-sm border p-5 lg:col-span-2" style={{ borderColor: LINE }}>
          <h2 className="text-sm font-medium">Bookings over time</h2>
          <p className="text-xs" style={{ color: INK_MUTED }}>Daily volume of service requests</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsOverTime}>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke={LINE} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={monoTick} />
                <YAxis axisLine={false} tickLine={false} tick={monoTick} />
                <Tooltip contentStyle={{ borderRadius: 2, border: `1px solid ${LINE}`, fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke={RED} strokeWidth={2} dot={{ r: 3, fill: RED }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-sm border p-5" style={{ borderColor: LINE }}>
          <h2 className="text-sm font-medium">Status breakdown</h2>
          <p className="text-xs" style={{ color: INK_MUTED }}>Share of completed, pending, active jobs</p>
          <div className="mt-2 flex h-56 w-full items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: 2, border: `1px solid ${LINE}`, fontSize: 12 }} />
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke={PAPER} strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs" style={{ color: INK_MUTED }}>
            {bookingStatusData.map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-sm border p-5" style={{ borderColor: LINE }}>
          <h2 className="text-sm font-medium">Revenue over time</h2>
          <p className="text-xs" style={{ color: INK_MUTED }}>Daily earnings, ₹</p>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueOverTime}>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke={LINE} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={monoTick} />
                <YAxis axisLine={false} tickLine={false} tick={monoTick} />
                <Tooltip contentStyle={{ borderRadius: 2, border: `1px solid ${LINE}`, fontSize: 12 }} />
                <Bar dataKey="revenue" fill={RED} radius={[2, 2, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-sm border p-5" style={{ borderColor: LINE }}>
          <h2 className="text-sm font-medium">Service category breakdown</h2>
          <p className="text-xs" style={{ color: INK_MUTED }}>Jobs by service type</p>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceCategories} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="2 4" horizontal={false} stroke={LINE} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={monoTick} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ ...monoTick, fontSize: 12 }} width={100} />
                <Tooltip contentStyle={{ borderRadius: 2, border: `1px solid ${LINE}`, fontSize: 12 }} />
                <Bar dataKey="value" fill={STEEL} radius={[0, 2, 2, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

  
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-sm border lg:col-span-2" style={{ borderColor: LINE }}>
          <div className="flex items-center justify-between border-b p-5 pb-3" style={{ borderColor: LINE }}>
            <div>
              <h2 className="text-sm font-medium">Recent bookings</h2>
              <p className="text-xs" style={{ color: INK_MUTED }}>Latest service requests across Delhi NCR</p>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: LINE }}>
            {recentBookings.map((b: any) => {
              const status = BOOKING_STATUS_STYLE[b.status] ?? BOOKING_STATUS_STYLE.pending;
              return (
                <div key={b.id} className="flex items-center gap-4 px-5 py-3" style={{ borderColor: LINE }}>
                  <div className="w-20 shrink-0 font-mono text-xs" style={{ color: INK_MUTED }}>{b.id}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{b.customer}</div>
                    <div className="flex items-center gap-1 truncate text-xs" style={{ color: INK_MUTED }}>
                      <MapPin className="h-3 w-3 shrink-0" /> {b.area} · {b.service}
                    </div>
                  </div>
                  <div className="hidden shrink-0 text-xs sm:block" style={{ color: INK_MUTED }}>{b.mechanic}</div>
                  <div className="flex shrink-0 items-center gap-1.5 text-xs" style={{ color: status.color }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
                    {status.label}
                  </div>
                  <div className="w-16 shrink-0 text-right font-mono text-sm tabular-nums">
                    {b.amount ? `₹${b.amount}` : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-sm border" style={{ borderColor: LINE }}>
          <div className="border-b p-5 pb-3" style={{ borderColor: LINE }}>
            <h2 className="text-sm font-medium">Mechanic status</h2>
            <p className="text-xs" style={{ color: INK_MUTED }}>Who's on duty, right now</p>
          </div>
          <div className="divide-y" style={{ borderColor: LINE }}>
            {mechanics.map((m: any) => {
              const status = MECHANIC_STATUS_STYLE[m.status] ?? { label: m.status, color: INK_MUTED };
              return (
                <div key={m.name} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{m.name}</div>
                    <div className="truncate text-xs" style={{ color: INK_MUTED }}>{m.area} · {m.jobsToday} jobs today</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-xs" style={{ color: status.color }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
                    {status.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}