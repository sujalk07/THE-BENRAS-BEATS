"use client";

import { useEffect } from "react";
import { useMembership } from "@/hooks/useMembership";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  UserCircle,
  Mail,
  ArrowLeft,
  Crown,
  Music,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { membership, loading: dataLoading } = useMembership();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090807] text-stone-500">
        Loading profile...
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";

    return new Date(dateStr).toLocaleDateString("en-IN", {
      dateStyle: "medium",
    });
  };

  const isActive = !!membership;
  const planLabel = "Premium Membership";

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "Member";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090807] px-5 py-8 text-white sm:px-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#C9A24B]/[0.035] blur-[130px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Back to home"
          className="mb-10 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-[#C9A24B]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-10 border-b border-white/[0.07] pb-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A24B]" />

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24B]">
              My Account
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl tracking-wide text-[#EDE6D9] sm:text-5xl">
                Profile
              </h1>

              <p className="mt-2 text-sm text-stone-500">
                Your personal details and membership.
              </p>
            </div>

            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-stone-700">
              MEMBER / PROFILE
            </span>
          </div>
        </div>

        {/* Profile layout */}
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Identity card */}
          <div className="border border-white/[0.08] bg-[#11100E] p-7">
            <div className="flex items-center gap-4 border-b border-white/[0.07] pb-7">
              <div className="flex h-14 w-14 items-center justify-center border border-[#C9A24B]/20 bg-[#C9A24B]/[0.05]">
                <UserCircle
                  size={32}
                  className="text-[#C9A24B]"
                />
              </div>

              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
                  Account Holder
                </p>

                <h2 className="mt-1 truncate font-serif text-2xl text-[#EDE6D9]">
                  {fullName}
                </h2>
              </div>
            </div>

            {/* Name */}
            <div className="border-b border-white/[0.06] py-5">
              <div className="flex items-center gap-3">
                <UserCircle
                  size={16}
                  className="text-[#C9A24B]"
                />

                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-600">
                  Full Name
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-stone-200">
                {fullName}
              </p>
            </div>

            {/* Email */}
            <div className="py-5">
              <div className="flex items-center gap-3">
                <Mail
                  size={16}
                  className="text-[#C9A24B]"
                />

                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-600">
                  Email Address
                </span>
              </div>

              <p className="mt-2 break-all text-sm font-medium text-stone-200">
                {user.email}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-stone-600">
              <CheckCircle2 size={13} />
              Account Active
            </div>
          </div>

          {/* Membership */}
          <div className="border border-white/[0.08] bg-[#11100E] p-7">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown
                  size={18}
                  className="text-[#C9A24B]"
                />

                <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">
                  Membership Card
                </span>
              </div>

              {isActive && (
                <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-500">
                  Active
                </span>
              )}
            </div>

            {dataLoading ? (
              <div className="h-[270px] animate-pulse bg-white/[0.03]" />
            ) : isActive ? (
              <div className="relative min-h-[270px] overflow-hidden bg-gradient-to-br from-[#E5C66B] via-[#C9A24B] to-[#8C6820] p-6 text-[#211804]">
                {/* Card decoration */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20" />
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/20" />

                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Music size={19} />

                    <span className="text-xs font-black tracking-[0.2em]">
                      THE BENARAS BEATS
                    </span>
                  </div>

                  <Crown size={21} />
                </div>

                <p className="relative mt-2 text-[9px] font-bold uppercase tracking-[0.25em] opacity-70">
                  {planLabel}
                </p>

                <div className="relative mt-12">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
                    Member Name
                  </p>

                  <p className="mt-1 font-serif text-2xl font-bold">
                    {fullName}
                  </p>
                </div>

                <div className="relative mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
                      Membership ID
                    </p>

                    <p className="mt-1 font-mono text-xs font-bold tracking-[0.15em]">
                      {membership
                        ? membership.membershipId
                            .slice(0, 8)
                            .toUpperCase()
                        : "—"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
                      Valid Until
                    </p>

                    <p className="mt-1 text-xs font-bold">
                      {formatDate(
                        membership?.expiresAt ?? null
                      )}
                    </p>
                  </div>
                </div>

                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-black/15" />
              </div>
            ) : (
              <div className="flex min-h-[270px] flex-col items-center justify-center border border-dashed border-white/[0.08] bg-white/[0.015] px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center border border-[#C9A24B]/20 bg-[#C9A24B]/[0.04]">
                  <Crown
                    size={25}
                    className="text-[#C9A24B]/60"
                  />
                </div>

                <h3 className="mt-5 font-serif text-xl text-[#EDE6D9]">
                  No Active Membership
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">
                  Become a member to unlock exclusive events,
                  community access, and member benefits.
                </p>

                <button
                  onClick={() => router.push("/membership")}
                  className="mt-6 bg-[#C9A24B] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#090807] transition hover:bg-[#D9B662]"
                >
                  Become a Member
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom information */}
        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-700">
            Music · Culture · Community
          </span>

          <span className="text-xs text-stone-600">
            Your membership connects you to the Benaras Beats circle.
          </span>
        </div>
      </div>
    </main>
  );
}