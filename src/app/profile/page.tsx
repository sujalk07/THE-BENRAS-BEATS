"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  UserCircle,
  Mail,
  ArrowLeft,
  Crown,
  Music,
} from "lucide-react";

interface MembershipInfo {
  membership_status: "active" | "inactive";
  membership_id: string | null;
  plan: "intro" | "regular" | null;
  start_date: string | null;
  expiry_date: string | null;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [membership, setMembership] = useState<MembershipInfo>({
    membership_status: "inactive",
    membership_id: null,
    plan: null,
    start_date: null,
    expiry_date: null,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
      return;
    }

    async function fetchProfileData() {
      if (!user) return;

      try {
        const res = await fetch(`/api/membership-status?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setMembership({
            membership_status: data.membership_status ?? "inactive",
            membership_id: data.membership_id ?? null,
            plan: data.plan ?? null,
            start_date: data.start_date ?? null,
            expiry_date: data.expiry_date ?? null,
          });
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchProfileData();
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", { dateStyle: "medium" });
  };

  const isActive = membership.membership_status === "active";

  const planLabel =
    !isActive
      ? "No Active Plan"
      : membership.plan === "intro"
      ? "Introductory Membership"
      : membership.plan === "regular"
      ? "Regular Membership"
      : membership.plan
      ? membership.plan
      : "No Active Plan";

  const fullName =
    user.user_metadata?.full_name || user.user_metadata?.name || "Member";

  return (
    <main className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        {/* Back to Home */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="rounded-3xl border border-white/10 bg-[#1f232d]/60 p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <UserCircle size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-gray-400">Your account details</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {/* Full Name */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 text-gray-400">
                <UserCircle size={18} className="text-amber-400" />
                <span className="text-sm uppercase tracking-wider">Full Name</span>
              </div>
              <p className="mt-2 text-white">{fullName}</p>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-amber-400" />
                <span className="text-sm uppercase tracking-wider">Email</span>
              </div>
              <p className="mt-2 text-white">{user.email}</p>
            </div>

            {/* Membership Digital Card */}
            <div>
              <div className="flex items-center gap-3 text-gray-400 mb-3">
                <Crown size={18} className="text-amber-400" />
                <span className="text-sm uppercase tracking-wider">Membership Card</span>
              </div>

              {dataLoading ? (
                <div className="h-48 w-full animate-pulse rounded-2xl bg-white/5" />
              ) : isActive ? (
                <div
                  className="relative overflow-hidden rounded-2xl p-6"
                  style={{
                    background:
                      "linear-gradient(135deg, #fceabb 0%, #f8b500 25%, #b8860b 50%, #fceabb 75%, #d4af37 100%)",
                  }}
                >
                  {/* Decorative shine circles */}
                  <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Music size={20} style={{ color: "#3b2a06" }} />
                      <span
                        className="text-sm font-extrabold tracking-widest"
                        style={{ color: "#3b2a06" }}
                      >
                        THE BENARAS BEATS
                      </span>
                    </div>
                    <Crown size={22} style={{ color: "#3b2a06" }} />
                  </div>

                  <p
                    className="relative mt-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: "#5c4308" }}
                  >
                    {planLabel}
                  </p>

                  <div className="relative mt-8">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "#5c4308" }}
                    >
                      Member Name
                    </p>
                    <p
                      className="mt-0.5 text-xl font-extrabold tracking-wide"
                      style={{ color: "#2b1e03" }}
                    >
                      {fullName}
                    </p>
                  </div>

                  <div className="relative mt-5 flex items-end justify-between">
                    <div>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: "#5c4308" }}
                      >
                        Membership ID
                      </p>
                      <p
                        className="mt-0.5 font-mono text-sm font-bold tracking-widest"
                        style={{ color: "#2b1e03" }}
                      >
                        {membership.membership_id
                          ? membership.membership_id.slice(0, 8).toUpperCase()
                          : "—"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: "#5c4308" }}
                      >
                        Valid Until
                      </p>
                      <p
                        className="mt-0.5 text-sm font-bold"
                        style={{ color: "#2b1e03" }}
                      >
                        {formatDate(membership.expiry_date)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                  <Crown size={28} className="mx-auto text-gray-600" />
                  <p className="mt-3 text-sm text-gray-400">
                    You don't have an active membership yet.
                  </p>
                  <button
                    onClick={() => router.push("/membership")}
                    className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition"
                  >
                    Become a Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}