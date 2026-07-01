// app/dashboard/tickets/[id]/page.tsx
"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft, Download, Loader2, Music } from "lucide-react";
import html2canvas from "html2canvas";

interface TicketDetail {
  id: string;
  holder_name: string;
  event_title: string;
  event_date: string;
  venue: string;
  is_member: boolean;
  amount_paid: number;
  issued_at: string;
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/dashboard/tickets/${id}`);
      return;
    }

    async function fetchTicket() {
      if (!user) return;
      try {
        const res = await fetch(`/api/tickets/${id}?userId=${user.id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load ticket");
          return;
        }
        setTicket(data.ticket);
      } catch (err) {
        console.error(err);
        setError("Something went wrong loading this ticket.");
      } finally {
        setDataLoading(false);
      }
    }

    fetchTicket();
  }, [loading, user, id, router]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `ticket-${ticket?.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Could not generate the ticket image. Check the console for details.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mr-2" size={18} /> Loading ticket...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center text-gray-400 gap-4">
        <p>{error || "Ticket not found."}</p>
        <button
          onClick={() => router.push("/dashboard/tickets")}
          className="text-amber-400 text-sm hover:text-amber-300"
        >
          Back to My Tickets
        </button>
      </div>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", { dateStyle: "long" });

  // QR now encodes a verification URL, not raw JSON — makes it scannable/tappable
  const verifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify-ticket/${ticket.id}`
      : `/verify-ticket/${ticket.id}`;

  return (
    <main className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard/tickets")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
        >
          <ArrowLeft size={16} />
          Back to My Tickets
        </button>

        {/* The actual white printable ticket — all colors are explicit hex/rgb via inline styles, no Tailwind color classes, so html2canvas can render it reliably */}
        <div
          ref={ticketRef}
          style={{ backgroundColor: "#ffffff", color: "#000000" }}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <div
            style={{ backgroundColor: "#f59e0b" }}
            className="px-6 py-4 flex items-center gap-3"
          >
            <Music size={22} style={{ color: "#000000" }} />
            <span style={{ color: "#000000" }} className="font-extrabold tracking-wide">
              THE BENARAS BEATS
            </span>
          </div>

          <div className="p-6">
            <h1 style={{ color: "#000000" }} className="text-2xl font-extrabold">
              {ticket.event_title}
            </h1>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p style={{ color: "#6b7280" }} className="uppercase text-[10px] tracking-wider font-semibold">
                  Date
                </p>
                <p style={{ color: "#000000" }} className="font-semibold mt-0.5">
                  {formatDate(ticket.event_date)}
                </p>
              </div>
              <div>
                <p style={{ color: "#6b7280" }} className="uppercase text-[10px] tracking-wider font-semibold">
                  Venue
                </p>
                <p style={{ color: "#000000" }} className="font-semibold mt-0.5">
                  {ticket.venue}
                </p>
              </div>
              <div>
                <p style={{ color: "#6b7280" }} className="uppercase text-[10px] tracking-wider font-semibold">
                  Attendee
                </p>
                <p style={{ color: "#000000" }} className="font-semibold mt-0.5">
                  {ticket.holder_name}
                </p>
              </div>
              <div>
                <p style={{ color: "#6b7280" }} className="uppercase text-[10px] tracking-wider font-semibold">
                  Ticket ID
                </p>
                <p style={{ color: "#000000" }} className="font-mono text-xs mt-0.5">
                  {ticket.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            <div
              style={{ borderTop: "1px dashed #d1d5db" }}
              className="mt-5 pt-5 flex items-center justify-between"
            >
              <div>
                <p style={{ color: "#6b7280" }} className="uppercase text-[10px] tracking-wider font-semibold">
                  Member
                </p>
                <p style={{ color: "#000000" }} className="font-bold mt-0.5">
                  {ticket.is_member ? "Yes" : "No"}
                </p>

                <p
                  style={{ color: "#6b7280" }}
                  className="uppercase text-[10px] tracking-wider font-semibold mt-3"
                >
                  Paid
                </p>
                <p style={{ color: "#000000" }} className="font-bold mt-0.5">
                  {ticket.amount_paid > 0 ? `₹${ticket.amount_paid}` : "₹0"}
                </p>
              </div>

              <div style={{ border: "1px solid #e5e7eb" }} className="rounded-lg p-2">
                <QRCodeCanvas value={verifyUrl} size={110} level="M" />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold tracking-wide text-black hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Preparing...
            </>
          ) : (
            <>
              <Download size={16} /> Download Ticket
            </>
          )}
        </button>
      </div>
    </main>
  );
}