"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Crown,
  User,
  Users,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";

interface FeaturedMember {
  id: string;
  name: string;
  profession: string | null;
  photo_url: string | null;
  details: string | null;
}

interface MemberRow {
  serial: number;
  name: string;
  membership_id: string;
}

export default function DashboardMembersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [featured, setFeatured] = useState<FeaturedMember[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/dashboard/members");
      return;
    }

    async function fetchMembers() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/members/list?userId=${user.id}`);
        const data = await res.json();

        if (res.ok) {
          setFeatured(data.featured ?? []);
          setMembers(data.members ?? []);
          setTotalCount(data.totalCount ?? 0);
          setIsMember(!!data.isMember);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0908] text-gray-500">
        <Loader2 className="mr-2 animate-spin text-[#B8923F]" size={17} />
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0908] px-5 py-8 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#C9A24B]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            Dashboard
          </button>

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-700">
            TBB / Community
          </span>
        </div>

        {/* Intro */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8923F]">
              The Community
            </span>

            <h1 className="mt-2 font-serif text-4xl text-[#EDE6D9]">
              Our Members
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              A growing circle of {totalCount}+ people connected through music.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-gray-600">
            <Users size={13} />
            {totalCount} Members
          </div>
        </div>

        {/* Featured Members */}
        {featured.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <Crown size={15} className="text-[#C9A24B]" />

              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Esteemed Members
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((m) => (
                <div
                  key={m.id}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#11100E] p-4 transition-all duration-300 hover:border-[#B8923F]/30"
                >
                  <div className="flex items-center gap-4">
                    {m.photo_url ? (
                      <img
                        src={m.photo_url}
                        alt={m.name}
                        className="h-14 w-14 shrink-0 rounded-full border border-[#B8923F]/30 object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-600">
                        <User size={20} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate font-serif text-lg text-[#EDE6D9]">
                        {m.name}
                      </h3>

                      {m.profession && (
                        <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.12em] text-[#B8923F]">
                          {m.profession}
                        </p>
                      )}
                    </div>
                  </div>

                  {m.details && (
                    <p className="mt-4 line-clamp-2 text-xs leading-5 text-gray-500">
                      {m.details}
                    </p>
                  )}

                  <div className="absolute bottom-0 left-0 h-px w-0 bg-[#B8923F] transition-all duration-500 group-hover:w-full" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Community Directory */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Community Directory
            </h2>

            <span className="text-[9px] text-gray-700">
              {members.length} listed
            </span>
          </div>

          {members.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.1] py-10 text-center text-sm text-gray-600">
              No members yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#11100E]">

              {/* Desktop header */}
              <div className="hidden grid-cols-[70px_1fr_180px] border-b border-white/[0.06] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-700 sm:grid">
                <span>#</span>
                <span>Name</span>
                <span>Membership ID</span>
              </div>

              {members.map((m) => (
                <div
                  key={m.membership_id}
                  className="grid grid-cols-[35px_1fr_auto] items-center border-b border-white/[0.05] px-4 py-3 last:border-b-0 transition hover:bg-white/[0.02] sm:grid-cols-[70px_1fr_180px]"
                >
                  <span className="font-mono text-[10px] text-gray-700">
                    {String(m.serial).padStart(2, "0")}
                  </span>

                  <span className="truncate text-sm text-gray-300">
                    {m.name}
                  </span>

                  <span className="font-mono text-[10px] text-[#B8923F]">
                    {m.membership_id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Membership CTA */}
        {!isMember && (
          <div className="mt-8 flex flex-col gap-5 rounded-xl border border-[#B8923F]/20 bg-[#B8923F]/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Crown size={15} className="text-[#C9A24B]" />

                <h3 className="font-serif text-lg text-[#EDE6D9]">
                  Become part of the circle
                </h3>
              </div>

              <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500">
                Unlock esteemed members, priority event access, and exclusive
                community experiences.
              </p>
            </div>

            <button
              onClick={() => router.push("/membership")}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#C9A24B] px-5 py-2.5 text-xs font-semibold text-[#0A0908] transition hover:bg-[#D9B662]"
            >
              Become a Member
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-7 flex justify-between border-t border-white/[0.06] pt-5 text-[9px] uppercase tracking-[0.15em] text-gray-700">
          <span>Music · Culture · Community</span>
          <span>Varanasi</span>
        </div>
      </div>
    </main>
  );
}