// app/verify-ticket/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { CheckCircle, XCircle, Loader2, Calendar, MapPin, User, Crown } from "lucide-react";

interface VerifyResult {
  valid: boolean;
  event_title?: string;
  event_date?: string;
  venue?: string;
  holder_name?: string;
  is_member?: boolean;
  amount_paid?: number;
}

export default function VerifyTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`/api/tickets/verify/${id}`);
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error(err);
        setResult({ valid: false });
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mr-2" size={18} /> Verifying ticket...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0C10] flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1f232d]/60 p-8 text-center">
        {result?.valid ? (
          <>
            <CheckCircle className="mx-auto text-emerald-400" size={48} />
            <h1 className="mt-4 text-xl font-bold">Valid Ticket</h1>
            <div className="mt-6 space-y-3 text-left text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <User size={14} className="text-amber-400" /> {result.holder_name}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={14} className="text-amber-400" />
                {result.event_date &&
                  new Date(result.event_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={14} className="text-amber-400" /> {result.venue}
              </div>
              {result.is_member && (
                <div className="flex items-center gap-2 text-amber-400">
                  <Crown size={14} /> Member Ticket
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-red-400" size={48} />
            <h1 className="mt-4 text-xl font-bold">Invalid Ticket</h1>
            <p className="mt-2 text-sm text-gray-400">This ticket could not be verified.</p>
          </>
        )}
      </div>
    </main>
  );
}