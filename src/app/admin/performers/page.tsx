"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Loader2,
  Music,
  ExternalLink,
  Phone,
  Mail,
  Search,
  ChevronDown,
  Trash2,
  X,
  BadgeInfo,
} from "lucide-react";

interface PerformerRequest {
  id: string;
  artist_name: string;
  genre: string;
  bio: string | null;
  social_link: string | null;
  sample_track_url: string | null;
  contact_number: string | null;
  email: string | null;
  submitted_at: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminPerformersPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<PerformerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      if (!user) return;

      try {
        const res = await fetch(`/api/admin/performer-requests?userId=${user.id}`);
        const data = await res.json();
        if (res.ok) setApplications(data.applications ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [user]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return applications;

    return applications.filter(
      (a) =>
        a.artist_name.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q) ||
        (a.email ?? "").toLowerCase().includes(q)
    );
  }, [applications, search]);

  const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Delete this application? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/performer-requests/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete application");
        return;
      }

      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err: any) {
      alert(err?.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-[28px] border border-white/10 bg-[#11141b] px-6 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] sm:px-8 sm:py-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Performer applications
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                  {applications.length} artist
                  {applications.length !== 1 ? "s" : ""} applied to perform
                </p>
              </div>

              <div className="self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300 shadow-sm">
                Live list
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <div className="relative w-full">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
  type="text"
  placeholder="Search by name, genre, or email"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="h-12 w-full rounded-xl border border-white/10 bg-[#0d1016] pl-12 pr-10 text-sm text-white placeholder-gray-500 outline-none transition focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10"
/>
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 flex items-center gap-2 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-[#11141b] py-14 text-center">
            <Music size={28} className="mx-auto text-gray-600" />
            <p className="mt-3 text-sm text-gray-400">
              {applications.length === 0
                ? "No performer applications yet."
                : "No applications match your search."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((app) => {
              const isExpanded = expandedId === app.id;

              return (
                <div
                  key={app.id}
                  className="overflow-hidden rounded-[24px] border border-white/10 bg-[#11141b] shadow-sm transition hover:border-white/15"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(app.id)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition hover:bg-white/[0.02] sm:px-7"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
  <span className="truncate text-base font-semibold text-white sm:text-lg">
    {app.artist_name}
  </span>

  <span className="text-sm font-medium text-amber-400">
    {app.genre}
  </span>
</div>

                      <div className="mt-2 text-sm text-gray-400">
                        Submitted {formatDateTime(app.submitted_at)}
                      </div>
                    </div>

                    <ChevronDown
                      size={18}
                      className={cn(
                        "shrink-0 text-gray-500 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-white/10 bg-[#0d1016] px-6 py-6 sm:px-7">
                      <div className="mx-auto max-w-5xl">
                        <div className="grid gap-5 lg:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                              Contact details
                            </div>

                            <div className="space-y-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Phone size={14} className="shrink-0 text-gray-500" />
                                <span className="break-all">
                                  {app.contact_number || "Not provided"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-300">
                                <Mail size={14} className="shrink-0 text-gray-500" />
                                <a
                                  href={app.email ? `mailto:${app.email}` : undefined}
                                  className={cn(
                                    "truncate",
                                    app.email
                                      ? "hover:text-amber-400"
                                      : "pointer-events-none text-gray-500"
                                  )}
                                >
                                  {app.email || "Not provided"}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                              Submission info
                            </div>

                            <div className="space-y-5 text-sm text-gray-300">
                              <div>
                                <div className="text-gray-500">Bio</div>
                                <p className="mt-2 leading-relaxed text-gray-300">
                                  {app.bio || "No bio provided."}
                                </p>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <div className="text-gray-500">Social link</div>
                                  {app.social_link ? (
                                    <a
                                      href={app.social_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300"
                                    >
                                      Open link <ExternalLink size={12} />
                                    </a>
                                  ) : (
                                    <div className="mt-2 text-gray-400">Not provided</div>
                                  )}
                                </div>

                                <div>
                                  <div className="text-gray-500">Sample track</div>
                                  {app.sample_track_url ? (
                                    <a
                                      href={app.sample_track_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300"
                                    >
                                      Open track <ExternalLink size={12} />
                                    </a>
                                  ) : (
                                    <div className="mt-2 text-gray-400">Not provided</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-white/10 pt-5">
                          <button
                            type="button"
                            onClick={() => handleDelete(app.id)}
                            disabled={deletingId === app.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === app.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete application
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}