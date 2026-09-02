"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ClipboardList, Wrench, Users } from "lucide-react";
import { INK, INK_MUTED, LINE, PAPER, RED } from "@/lib/theme";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/dashboard/mechanics", label: "Mechanics", icon: Wrench },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t"
      style={{ background: PAPER, borderColor: LINE }}
    >
      <div className="mx-auto flex max-w-3xl items-stretch justify-around">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-xs"
              style={{ color: active ? RED : INK_MUTED }}
            >
              {active && (
                <span
                  className="absolute top-0 h-0.5 w-8 rounded-full"
                  style={{ background: RED }}
                />
              )}
              <item.icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
              <span className={active ? "font-medium" : ""} style={{ color: active ? INK : INK_MUTED }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}