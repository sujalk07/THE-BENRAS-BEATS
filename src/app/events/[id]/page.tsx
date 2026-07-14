"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, CheckCircle, Users, ChevronLeft, Star, Music, X, Clock3, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import paymentQr from "@/assets/payment-qr.png";

interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  profile_image_url?: string;
  role?: string;
}

interface EventDetails {
  id: string;
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image_url: string;
  capacity: number;
  ticket_price: number;
  slotsLeft: number;
  isSoldOut: boolean;
  isUserRegistered: boolean;
  isMember: boolean;
  registration_open: boolean;
  artists?: Artist[];
}

interface RegistrationRequestStatus {
  id: string;
  status: "pending" | "verified" | "rejected";
  admin_note: string | null;
  created_at: string;
}

const TICKET_RULES = [
  "Tickets are non-transferable and valid only for the registered attendee.",
  "Entry may be denied without a valid ticket / QR code shown at the venue.",
  "Tickets once booked are non-refundable, except in case of event cancellation.",
  "Attendees must arrive at least 30 minutes before the event start time.",
  "The organizers reserve the right to change the venue, date, or lineup if necessary.",
  "Any misconduct at the venue may result in removal without refund.",
];

// Flip this to true once Razorpay is re-approved and ready to use again for events
const RAZORPAY_ENABLED_FOR_EVENTS = false;

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [showRulesModal, setShowRulesModal] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Manual QR verification flow state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [manualName, setManualName] = useState(user?.user_metadata?.full_name ?? "");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [registrationRequest, setRegistrationRequest] = useState<RegistrationRequestStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const fetchEventDetails = async () => {
    try {
      const url = user
        ? `/api/events/list?userId=${user.id}`
        : `/api/events/list`;

      const res = await fetch(url);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server returned status ${res.status}: ${errText}`);
      }

      const data = await res.json();

      if (data && Array.isArray(data.events)) {
        const matchingEvent = data.events.find((e: any) => e.id === id);

        if (matchingEvent) {
          setEvent(matchingEvent);
        } else {
          throw new Error("This specific event ID does not exist in the upcoming catalog.");
        }
      } else {
        throw new Error("API response did not contain an 'events' array block.");
      }
    } catch (err: any) {
      console.error("❌ Parsing error encountered:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrationStatus = async () => {
    if (!user) {
      setStatusLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/events/my-registration-status?userId=${user.id}&eventId=${id}`);
      const data = await res.json();
      if (res.ok) setRegistrationRequest(data.request ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventDetails();
      fetchRegistrationStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  // Step 1: user clicks the ticket button — show rules modal first
  const handleTicketButtonClick = () => {
    if (!user) {
      router.push(`/signup?redirectTo=/events/${id}`);
      return;
    }
    setAgreedToRules(false);
    setShowRulesModal(true);
  };

  // Step 2: user confirms agreement — proceed with free claim or open the payment modal
  const handleConfirmRules = () => {
    if (!agreedToRules) return;
    setShowRulesModal(false);

    if (event?.isMember) {
      handleRegister();
    } else if (RAZORPAY_ENABLED_FOR_EVENTS) {
      handleRegister();
    } else {
      setManualName(user?.user_metadata?.full_name ?? "");
      setScreenshotFile(null);
      setScreenshotPreview(null);
      setShowPaymentModal(true);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmitPaymentProof = async () => {
    if (!user || !event) return;

    if (!manualName.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!screenshotFile) {
      alert("Please upload your payment screenshot.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", screenshotFile);
      formData.append("userId", user.id);
      formData.append("eventId", id);
      formData.append("fullName", manualName.trim());
      formData.append("amount", String(event.ticket_price));

      const res = await fetch("/api/events/submit-registration-request", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit your request.");
      }

      setShowPaymentModal(false);
      alert("✅ Your payment proof has been submitted! We'll verify it and email your ticket shortly.");
      fetchRegistrationStatus();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ===========================
  // Original Razorpay flow — kept intact, currently unused while RAZORPAY_ENABLED_FOR_EVENTS is false
  // ===========================
  const handleRegister = async () => {
    if (!user) {
      router.push(`/signup?redirectTo=/events/${id}`);
      return;
    }

    // ===========================
    // MEMBER → FREE TICKET
    // ===========================
    if (event?.isMember) {
      try {
        const response = await fetch("/api/events/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: id,
            userId: user.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        alert("🎉 Ticket claimed successfully!");

        fetchEventDetails();
      } catch (err: any) {
        alert(err.message);
      }

      return;
    }

    // ===========================
    // NON MEMBER → PAYMENT (Razorpay)
    // ===========================

    try {
      const response = await fetch("/api/events/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: id,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      if (!(window as any).Razorpay) {
        alert("Payment gateway is still loading. Please wait a moment and try again.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: data.amount,

        currency: data.currency,

        name: "The Benaras Beats",

        description: data.eventTitle,

        order_id: data.orderId,

        prefill: {
          email: user.email,
        },

        theme: {
          color: "#f59e0b",
        },

        handler: async function (response: any) {
          try {
            const verify = await fetch("/api/events/verify-payment", {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
                eventId: id,
              }),
            });

            const verifyData = await verify.json();

            if (!verify.ok) {
              throw new Error(verifyData.error);
            }

            alert("🎉 Ticket booked successfully!");

            fetchEventDetails();
          } catch (err: any) {
            alert(err.message);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.open();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center text-amber-500 mt-20 animate-pulse font-medium tracking-wide">Loading showcase information...</div>;
  if (!event) return <div className="text-center text-red-400 mt-20 font-medium">Showcase timeline could not be parsed.</div>;

  const hasPendingRequest = registrationRequest?.status === "pending";
  const wasRejected = registrationRequest?.status === "rejected";

  const buttonDisabled =
    event.isUserRegistered || event.isSoldOut || !event.registration_open || hasPendingRequest || statusLoading;

  return (
    <>
      {RAZORPAY_ENABLED_FOR_EVENTS && (
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      )}
      <div className="max-w-4xl mx-auto px-4 py-12 selection:bg-amber-500 selection:text-black">
        {/* Back navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors mb-6 text-sm font-medium">
          <ChevronLeft size={16} /> Back to showcase stream
        </Link>

        <div className="bg-[#1f232d]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          {event.image_url ? (
            <div className="relative h-64 md:h-96 w-full border-b border-white/10">
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/30 to-transparent" />
            </div>
          ) : (
            <div className="h-48 w-full bg-gradient-to-br from-purple-950/20 via-gray-950 to-amber-950/20 border-b border-white/10 flex items-center justify-center">
              <Music size={40} className="text-amber-500/20" />
            </div>
          )}

          <div className="p-6 md:p-8 relative">
            <span className="text-amber-500 text-xs uppercase tracking-widest font-bold block mb-2">Benaras Beats Present</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">{event.title}</h1>

            {/* Event Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#0B0C10]/60 border border-white/5 p-4 rounded-xl flex items-center gap-3">
                <Calendar className="text-amber-500 shrink-0" size={18} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Date & Time</p>
                  <p className="text-xs font-bold text-gray-200 mt-0.5">
                    {new Date(event.event_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </p>
                </div>
              </div>

              <div className="bg-[#0B0C10]/60 border border-white/5 p-4 rounded-xl flex items-center gap-3">
                <MapPin className="text-amber-500 shrink-0" size={18} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Venue</p>
                  <p className="text-xs font-bold text-gray-200 mt-0.5 line-clamp-1">{event.venue}</p>
                </div>
              </div>

              <div className="bg-[#0B0C10]/60 border border-white/5 p-4 rounded-xl flex items-center gap-3">
                <Users className="text-amber-500 shrink-0" size={18} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Availability</p>
                  <p className={`text-xs font-bold mt-0.5 ${event.isSoldOut ? "text-red-400" : "text-emerald-400"}`}>
                    {event.isSoldOut ? "Fully Booked" : `${event.slotsLeft} / ${event.capacity} Slots Left`}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-3">About the Experience</h2>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{event.description || "No description published for this showcase."}</p>
            </div>

            {/* New Artists & Lineup Grid */}
            <div className="border-t border-white/5 pt-6 mb-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Star size={18} className="text-amber-500 fill-amber-500" /> Performing Lineup
              </h2>

              {event.artists && event.artists.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {event.artists.map((artist) => (
                    <div key={artist.id} className="flex gap-4 p-4 rounded-xl bg-[#0B0C10]/40 border border-white/5 items-center">
                      <img
                        src={artist.profile_image_url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60"}
                        alt={artist.name}
                        className="w-14 h-14 rounded-full object-cover border border-amber-500/20 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{artist.name}</h4>
                        <p className="text-[10px] text-amber-500 uppercase tracking-wider font-medium mt-0.5">{artist.role || artist.genre}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{artist.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0B0C10]/20 border border-dashed border-white/5 text-xs text-gray-500 flex items-center gap-2">
                  <Music size={14} /> Showcase performer lineups will be announced shortly. Stay locked in!
                </div>
              )}
            </div>

            {/* Pending / rejected banner */}
            {hasPendingRequest && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                <Clock3 size={16} className="shrink-0" />
                Your payment proof is under review. We'll email you once your ticket is confirmed.
              </div>
            )}
            {wasRejected && !hasPendingRequest && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                Your previous request couldn't be verified
                {registrationRequest?.admin_note ? `: ${registrationRequest.admin_note}` : "."} You can try
                submitting again below.
              </div>
            )}

            {/* Registration Trigger */}
            <div className="border-t border-white/10 pt-6 flex justify-end">
              <button
                disabled={buttonDisabled}
                onClick={handleTicketButtonClick}
                className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all text-sm tracking-wide ${
                  event.isUserRegistered
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
                    : hasPendingRequest
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 cursor-not-allowed"
                    : event.isSoldOut || !event.registration_open
                    ? "bg-gray-900 text-gray-600 border border-white/5 cursor-not-allowed"
                    : "bg-amber-500 text-black hover:bg-amber-400 shadow-xl shadow-amber-500/10 active:scale-[0.99]"
                }`}
              >
                {event.isUserRegistered ? (
                  <>
                    <CheckCircle size={16} /> Pass Claimed Successfully
                  </>
                ) : hasPendingRequest ? (
                  <>
                    <Clock3 size={16} /> Pending Review
                  </>
                ) : event.isSoldOut ? (
                  "Sold Out"
                ) : !event.registration_open ? (
                  "Registration Closed"
                ) : event.isMember ? (
                  "Claim Free Ticket"
                ) : wasRejected ? (
                  "Resubmit Payment Proof"
                ) : (
                  `Buy Ticket ₹${event.ticket_price}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1f232d] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Ticket Rules & Regulations</h2>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-gray-500 hover:text-white transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="space-y-2.5 text-sm text-gray-300 max-h-64 overflow-y-auto pr-1">
              {TICKET_RULES.map((rule, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <label className="mt-5 flex items-start gap-2.5 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-amber-500"
              />
              <span>I have read and agree to the ticket rules & regulations above.</span>
            </label>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowRulesModal(false)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-gray-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRules}
                disabled={!agreedToRules}
                className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual QR Payment Modal */}
      {showPaymentModal && event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1f232d] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Complete Your Payment</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-white transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Scan the QR code below and pay{" "}
              <span className="text-amber-400 font-bold">₹{event.ticket_price}</span> for{" "}
              <span className="text-white font-medium">{event.title}</span>. Then upload a
              screenshot of your payment confirmation — we'll verify it and email your ticket.
            </p>

            <div className="mx-auto mb-5 flex justify-center">
              <div className="rounded-xl border border-white/10 bg-white p-3">
                <Image src={paymentQr} alt="Payment QR Code" width={200} height={200} />
              </div>
            </div>

            <label className="block text-sm text-gray-300 mb-1.5">Your Full Name</label>
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="As it should appear on your ticket"
              className="w-full mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />

            <label className="block text-sm text-gray-300 mb-1.5">Payment Screenshot</label>
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-5 cursor-pointer hover:border-amber-500/40 transition">
              {screenshotPreview ? (
                <img src={screenshotPreview} alt="Screenshot preview" className="max-h-40 rounded-lg object-contain" />
              ) : (
                <>
                  <Upload size={22} className="text-gray-500" />
                  <span className="text-xs text-gray-500">Tap to upload screenshot (JPG, PNG)</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleScreenshotChange}
                className="hidden"
              />
            </label>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-gray-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPaymentProof}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : "Submit for Verification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}