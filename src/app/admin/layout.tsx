// app/admin/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { isAdminEmail } from "@/lib/admin";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  ArrowLeft,
  Mic2,
  Music,
  Bell,
  MessageCircle,
  FileCheck,
} from "lucide-react";

const adminLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Events", href: "/admin/events", icon: CalendarDays },
  { name: "Registrations", href: "/admin/registrations", icon: Users },
  { name: "Memberships", href: "/admin/memberships", icon: CreditCard },
  {
    name: "Membership Requests",
    href: "/admin/membership-requests",
    icon: FileCheck,
  },
  { name: "Performers", href: "/admin/performers", icon: Mic2 },
  { name: "Esteemed Members", href: "/admin/featured-members", icon: Users },
  { name: "Music Genres", href: "/admin/genres", icon: Music },
  { name: "Waitlist", href: "/admin/membership-waitlist", icon: Bell },
  { name: "Feedback", href: "/admin/feedback", icon: MessageCircle },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <aside className="hidden md:flex w-56 flex-col border-r border-white/10 bg-[#1f232d]/40 p-4">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs text-gray-400 transition hover:text-amber-400"
        >
          <ArrowLeft size={14} />
          Back to site
        </Link>

        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
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
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-white/10 bg-[#1f232d] py-2 md:hidden">
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
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-20 md:p-8 md:pb-8">
        {children}
      </main>
    </div>
  );
}