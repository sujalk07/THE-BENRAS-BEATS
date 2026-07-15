"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { ArrowLeft, Loader2, Crown, User } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [notAMember, setNotAMember] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/dashboard/members");
      return;
    }

    async function fetchMembers() {
      if (!user) return;
      try {
        const res = await fetch(`/api/members/list?userId=${user.id}`);
        const data = await res.json();

        if (res.status === 403) {
          setNotAMember(true);
          return;
        }

        if (res.ok) {
          setFeatured(data.featured ?? []);
          setMembers(data.members ?? []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [authLoading, user, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mr-2" size={18} /> Loading...
      </div>
    );
  }

  if (notAMember) {
    return (
      <main className="min-h-screen bg-[#0B0C10] px-6 py-16 text-white">
        <div className="mx-auto max-w-md text-center">
          <Crown size={32} className="mx-auto text-gray-600" />
          <h1 className="mt-4 text-xl font-bold">Members Only</h1>
          <p className="mt-2 text-sm text-gray-400">
            This page is exclusive to active members of The Benaras Beats.
          </p>
          <button
            onClick={() => router.push("/membership")}
            className="mt-6 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400 transition"
          >
            Become a Member
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold">Our Members</h1>
        <p className="mt-2 text-gray-400">A community of {members.length} members and counting.</p>

        {featured.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-5 text-lg font-bold text-amber-400 flex items-center gap-2">
              <Crown size={18} /> Esteemed Members
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col items-center rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent p-6 text-center"
                >
                  {m.photo_url ? (
                    <img
                      src={m.photo_url}
                      alt={m.name}
                      className="h-20 w-20 rounded-full object-cover border-2 border-amber-500/30"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-amber-500/20 bg-amber-500/5 text-amber-500/40">
                      <User size={28} />
                    </div>
                  )}
                  <h3 className="mt-4 font-bold text-white">{m.name}</h3>
                  {m.profession && (
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-amber-400">
                      {m.profession}
                    </p>
                  )}
                  {m.details && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{m.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-white">All Members</h2>
          {members.length === 0 ? (
            <p className="text-sm text-gray-500">No members yet.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03] text-left text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium w-16">S.No.</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Membership ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((m) => (
                    <tr key={m.membership_id}>
                      <td className="px-4 py-3 text-gray-400">{m.serial}</td>
                      <td className="px-4 py-3 font-medium text-white">{m.name}</td>
                      <td className="px-4 py-3 font-mono text-amber-400">{m.membership_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}