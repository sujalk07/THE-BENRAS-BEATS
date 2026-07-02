// app/admin/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { isAdminEmail } from "@/lib/admin";
import { LayoutDashboard, CalendarDays, Users, CreditCard, ArrowLeft } from "lucide-react";

const adminLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Events", href: "/admin/events", icon: CalendarDays },
  { name: "Registrations", href: "/admin/registrations", icon: Users },
  { name: "Memberships", href: "/admin/memberships", icon: CreditCard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login?redirect=/admin");
      return;
    }
    if (!isAdminEmail(user.email)) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || !isAdminEmail(user.email)) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/10 bg-[#1f232d]/40 p-4 hidden md:flex flex-col">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber-400 transition"
        >
          <ArrowLeft size={14} /> Back to site
        </Link>

        <p className="mb-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
          Admin Panel
        </p>

        <nav className="flex flex-col gap-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-white/10 bg-[#1f232d] py-2">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-2 text-[10px] ${
                isActive ? "text-amber-400" : "text-gray-500"
              }`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">{children}</main>
    </div>
  );
}