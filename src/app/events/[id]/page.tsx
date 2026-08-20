"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  CheckCircle,
  Users,
  ChevronLeft,
  Star,
  Music,
  X,
  Clock,
  XCircle,
  Loader2,
  Upload,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import qrImg from "../../../assets/payment-qr.png";

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

const TICKET_RULES = [
  "Tickets are non-transferable and valid only for the registered attendee.",
  "Entry may be denied without a valid ticket / QR code shown at the venue.",
  "Tickets once booked are non-refundable, except in case of event cancellation.",
  "Attendees must arrive at least 30 minutes before the event start time.",
  "The organizers reserve the right to change the venue, date, or lineup if necessary.",
  "Any misconduct at the venue may result in removal without refund.",
];

const EVENT_PAYMENTS_LIVE = true;

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [showRulesModal, setShowRulesModal] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

  const [registrationRequestStatus, setRegistrationRequestStatus] =
    useState<"pending" | "verified" | "rejected" | null>(null);

  const [registrationRequestNote, setRegistrationRequestNote] =
    useState<string | null>(null);

  const [showQrModal, setShowQrModal] = useState(false);
  const [qrFullName, setQrFullName] = useState("");
  const [qrScreenshot, setQrScreenshot] = useState<File | null>(null);
  const [qrScreenshotPreview, setQrScreenshotPreview] = useState<string | null>(
    null
  );
  const [qrSubmitting, setQrSubmitting] = useState(false);

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
          throw new Error(
            "This specific event ID does not exist in the upcoming catalog."
          );
        }
      } else {
        throw new Error(
          "API response did not contain an 'events' array block."
        );
      }
    } catch (err: any) {
      console.error("❌ Parsing error encountered:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrationRequestStatus = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `/api/events/my-registration-status?userId=${user.id}&eventId=${id}`
      );

      const data = await res.json();

      if (res.ok && data.request) {
        setRegistrationRequestStatus(data.request.status);
        setRegistrationRequestNote(data.request.admin_note ?? null);
      } else {
        setRegistrationRequestStatus(null);
        setRegistrationRequestNote(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id, user]);

  useEffect(() => {
    if (id && user && !EVENT_PAYMENTS_LIVE) {
      fetchRegistrationRequestStatus();
    }
  }, [id, user]);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setQrFullName(user.user_metadata.full_name);
    }
  }, [user]);

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existing) {
        let count = 0;

        const interval = setInterval(() => {
          if ((window as any).Razorpay) {
            clearInterval(interval);
            resolve(true);
          }

          count++;

          if (count > 20) {
            clearInterval(interval);
            resolve(false);
          }
        }, 250);

        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("✅ Razorpay SDK dynamically loaded");
        resolve(true);
      };

      script.onerror = () => {
        console.error("❌ Razorpay SDK failed to load");
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handleTicketButtonClick = () => {
    if (!user) {
      router.push(`/signup?redirectTo=/events/${id}`);
      return;
    }

    setAgreedToRules(false);
    setShowRulesModal(true);
  };

  const handleConfirmRules = () => {
    if (!agreedToRules) return;

    setShowRulesModal(false);

    if (event?.isMember) {
      handleRegister();
      return;
    }

    if (EVENT_PAYMENTS_LIVE) {
      handleRegister();
    } else {
      setShowQrModal(true);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      router.push(`/signup?redirectTo=/events/${id}`);
      return;
    }

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

      const sdkLoaded = await loadRazorpay();

      if (!sdkLoaded) {
        alert(
          "Unable to load the Razorpay payment gateway. Please check your internet connection and try again."
        );
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
          color: "#c9a24b",
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

  const handleQrScreenshotChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setQrScreenshot(file);
    setQrScreenshotPreview(URL.createObjectURL(file));
  };

  const handleQrSubmit = async () => {
    if (!user || !event) return;

    if (!qrFullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!qrScreenshot) {
      alert("Please upload your payment screenshot.");
      return;
    }

    setQrSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("file", qrScreenshot);
      formData.append("userId", user.id);
      formData.append("eventId", event.id);
      formData.append("fullName", qrFullName.trim());
      formData.append("amount", String(event.ticket_price));

      const res = await fetch("/api/events/submit-registration-request", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit your request.");
      }

      setShowQrModal(false);
      setQrScreenshot(null);
      setQrScreenshotPreview(null);
      setRegistrationRequestStatus("pending");

      alert(
        "🎉 Your payment screenshot was submitted! We'll review and confirm your ticket shortly."
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setQrSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0908] text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#C9A24B]" />
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0908] text-red-400">
        Event could not be loaded.
      </div>
    );
  }

  const showingPendingRequest =
    !EVENT_PAYMENTS_LIVE &&
    !event.isMember &&
    registrationRequestStatus === "pending";

  const showingRejectedRequest =
    !EVENT_PAYMENTS_LIVE &&
    !event.isMember &&
    registrationRequestStatus === "rejected";

  const buttonDisabled =
    event.isUserRegistered ||
    event.isSoldOut ||
    !event.registration_open ||
    showingPendingRequest;

  const eventDate = new Date(event.event_date);

  return (
    <>
      <Script
        id="razorpay-sdk"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <main className="min-h-screen overflow-hidden bg-[#0A0908] text-white">

        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-[-200px] top-[20%] h-[500px] w-[500px] rounded-full bg-[#B8923F]/[0.035] blur-[150px]" />
          <div className="absolute bottom-[-150px] right-[-100px] h-[450px] w-[450px] rounded-full bg-violet-500/[0.025] blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 py-8 md:py-10">

          {/* Top navigation */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#C9A24B]"
            >
              <ChevronLeft
                size={15}
                className="transition-transform group-hover:-translate-x-1"
              />
              All Events
            </Link>

            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gray-700">
              TBB / Experience
            </span>
          </div>

          {/* Hero */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11100E]">

            <div className="relative h-[280px] sm:h-[360px] md:h-[440px]">

              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#211B0D] via-[#11100E] to-[#090908]">
                  <Music size={48} className="text-[#B8923F]/30" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-black/20 to-black/10" />

              <div className="absolute bottom-0 left-0 p-6 md:p-10">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C9A24B]">
                  Benaras Beats Presents
                </span>

                <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.05] tracking-wide text-[#F2EBDD] sm:text-5xl md:text-6xl">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Event metadata */}
            <div className="grid border-t border-white/[0.07] sm:grid-cols-3">

              <div className="border-b border-white/[0.07] p-5 sm:border-b-0 sm:border-r">
                <div className="flex items-center gap-2 text-[#B8923F]">
                  <Calendar size={14} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                    Date
                  </span>
                </div>

                <p className="mt-2 text-sm text-[#EDE6D9]">
                  {eventDate.toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })}
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  {eventDate.toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="border-b border-white/[0.07] p-5 sm:border-b-0 sm:border-r">
                <div className="flex items-center gap-2 text-[#B8923F]">
                  <MapPin size={14} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                    Venue
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-[#EDE6D9]">
                  {event.venue}
                </p>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-[#B8923F]">
                  <Users size={14} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                    Availability
                  </span>
                </div>

                <p
                  className={`mt-2 text-sm ${
                    event.isSoldOut
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {event.isSoldOut
                    ? "Fully booked"
                    : `${event.slotsLeft} of ${event.capacity} seats left`}
                </p>
              </div>
            </div>
          </section>

          {/* Main content */}
          <div className="grid gap-8 py-8 lg:grid-cols-[1fr_290px]">

            {/* Left */}
            <div>

              {/* About */}
              <section className="border-b border-white/[0.07] pb-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-7 bg-[#B8923F]" />

                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-600">
                    The Experience
                  </span>
                </div>

                <h2 className="font-serif text-2xl text-[#EDE6D9]">
                  About the evening
                </h2>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-500">
                  {event.description ||
                    "No description has been published for this experience."}
                </p>
              </section>

              {/* Lineup */}
              <section className="pt-8">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star
                      size={14}
                      className="fill-[#C9A24B] text-[#C9A24B]"
                    />

                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-600">
                      Performing Lineup
                    </span>
                  </div>
                </div>

                {event.artists && event.artists.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {event.artists.map((artist) => (
                      <div
                        key={artist.id}
                        className="group flex gap-4 rounded-xl border border-white/[0.07] bg-[#11100E] p-4 transition hover:border-[#B8923F]/25"
                      >
                        <img
                          src={
                            artist.profile_image_url ||
                            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60"
                          }
                          alt={artist.name}
                          className="h-14 w-14 shrink-0 rounded-full border border-[#B8923F]/20 object-cover"
                        />

                        <div className="min-w-0">
                          <h3 className="truncate font-serif text-lg text-[#EDE6D9]">
                            {artist.name}
                          </h3>

                          <p className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-[#B8923F]">
                            {artist.role || artist.genre}
                          </p>

                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">
                            {artist.bio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/[0.08] p-5 text-sm text-gray-600">
                    <Music size={15} className="mb-2 text-[#B8923F]/50" />
                    Performer lineup will be announced shortly.
                  </div>
                )}
              </section>
            </div>

            {/* Ticket panel */}
            <aside className="lg:sticky lg:top-6 lg:self-start">

              <div className="overflow-hidden rounded-2xl border border-[#B8923F]/20 bg-[#11100E]">

                <div className="border-b border-white/[0.07] p-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
                    Your Access
                  </span>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-600">
                        {event.isMember ? "Member price" : "Ticket price"}
                      </p>

                      <p className="mt-1 font-serif text-3xl text-[#EDE6D9]">
                        {event.isMember
                          ? "FREE"
                          : `₹${event.ticket_price}`}
                      </p>
                    </div>

                    {event.isMember && (
                      <span className="rounded-full border border-[#B8923F]/25 bg-[#B8923F]/[0.06] px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-[#C9A24B]">
                        Member
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                {showingPendingRequest && (
                  <div className="border-b border-amber-500/10 bg-amber-500/[0.04] p-4">
                    <div className="flex gap-3">
                      <Clock
                        size={16}
                        className="shrink-0 text-amber-400"
                      />

                      <p className="text-xs leading-5 text-amber-300">
                        Your payment screenshot is awaiting review.
                      </p>
                    </div>
                  </div>
                )}

                {showingRejectedRequest && (
                  <div className="border-b border-red-500/10 bg-red-500/[0.04] p-4">
                    <div className="flex gap-3">
                      <XCircle
                        size={16}
                        className="shrink-0 text-red-400"
                      />

                      <p className="text-xs leading-5 text-red-300">
                        Your previous payment could not be verified.
                        {registrationRequestNote
                          ? ` ${registrationRequestNote}`
                          : ""}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <button
                    disabled={buttonDisabled}
                    onClick={handleTicketButtonClick}
                    className={`group flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-xs font-semibold transition-all ${
                      event.isUserRegistered
                        ? "cursor-not-allowed border border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400"
                        : event.isSoldOut ||
                          !event.registration_open ||
                          showingPendingRequest
                        ? "cursor-not-allowed border border-white/[0.05] bg-white/[0.02] text-gray-700"
                        : "bg-[#C9A24B] text-[#0A0908] hover:bg-[#D9B662]"
                    }`}
                  >
                    {event.isUserRegistered ? (
                      <>
                        <CheckCircle size={15} />
                        Pass Claimed
                      </>
                    ) : event.isSoldOut ? (
                      "Sold Out"
                    ) : !event.registration_open ? (
                      "Registration Closed"
                    ) : showingPendingRequest ? (
                      "Request Pending"
                    ) : event.isMember ? (
                      <>
                        Claim Free Ticket
                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </>
                    ) : showingRejectedRequest ? (
                      `Resubmit — ₹${event.ticket_price}`
                    ) : (
                      <>
                        Buy Ticket — ₹{event.ticket_price}
                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-center text-[9px] leading-4 text-gray-700">
                    By continuing, you agree to the event rules and
                    regulations.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom */}
          <div className="flex justify-between border-t border-white/[0.06] py-6 text-[9px] uppercase tracking-[0.15em] text-gray-700">
            <span>Music · Culture · Community</span>
            <span>Varanasi · India</span>
          </div>
        </div>

        {/* RULES MODAL */}
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#B8923F]/20 bg-[#11100E] shadow-2xl">

              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#B8923F]">
                    Before you continue
                  </span>

                  <h2 className="mt-1 font-serif text-xl text-[#EDE6D9]">
                    Ticket Rules
                  </h2>
                </div>

                <button
                  onClick={() => setShowRulesModal(false)}
                  className="text-gray-600 transition hover:text-white"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto p-5">
                <ul className="space-y-3">
                  {TICKET_RULES.map((rule, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-xs leading-5 text-gray-500"
                    >
                      <span className="mt-0.5 text-[#C9A24B]">
                        0{i + 1}
                      </span>

                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>

                {!event.isMember && (
                  <div className="mt-5 rounded-xl border border-[#B8923F]/15 bg-[#B8923F]/[0.04] p-4">
                    <p className="text-[11px] leading-5 text-[#CDBF9D]">
                      <span className="font-semibold text-[#E0C56E]">
                        Secure payment:
                      </span>{" "}
                      Event payments are securely processed through Razorpay
                      by Changing Minds Counseling & Psychotherapy Centre.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-white/[0.07] p-5">
                <label className="flex cursor-pointer items-start gap-3 text-xs text-gray-400">
                  <input
                    type="checkbox"
                    checked={agreedToRules}
                    onChange={(e) => setAgreedToRules(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#C9A24B]"
                  />

                  <span>
                    I have read and agree to the ticket rules and
                    regulations.
                  </span>
                </label>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setShowRulesModal(false)}
                    className="flex-1 rounded-lg border border-white/[0.08] py-3 text-xs font-medium text-gray-500 transition hover:bg-white/[0.03] hover:text-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmRules}
                    disabled={!agreedToRules}
                    className="flex-1 rounded-lg bg-[#C9A24B] py-3 text-xs font-semibold text-[#0A0908] transition hover:bg-[#D9B662] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QR PAYMENT MODAL */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-md">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#B8923F]/20 bg-[#11100E] shadow-2xl">

              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#B8923F]">
                    Manual Payment
                  </span>

                  <h2 className="mt-1 font-serif text-xl text-[#EDE6D9]">
                    Pay via QR
                  </h2>
                </div>

                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-gray-600 transition hover:text-white"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5">
                <div className="mb-5 text-center">
                  <p className="text-xs text-gray-500">
                    Scan and pay
                  </p>

                  <p className="mt-1 font-serif text-2xl text-[#C9A24B]">
                    ₹{event.ticket_price}
                  </p>
                </div>

                <div className="mb-5 flex justify-center">
                  <div className="rounded-xl bg-white p-3">
                    <img
                      src={qrImg.src}
                      alt="Payment QR code"
                      className="h-48 w-48 object-contain"
                    />
                  </div>
                </div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-gray-600">
                  Full Name
                </label>

                <input
                  type="text"
                  value={qrFullName}
                  onChange={(e) => setQrFullName(e.target.value)}
                  placeholder="Your full name"
                  className="mb-4 w-full rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#B8923F]/50"
                />

                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-gray-600">
                  Payment Screenshot
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/[0.12] bg-white/[0.02] p-5 transition hover:border-[#B8923F]/40">
                  {qrScreenshotPreview ? (
                    <img
                      src={qrScreenshotPreview}
                      alt="Screenshot preview"
                      className="h-28 rounded-lg object-contain"
                    />
                  ) : (
                    <>
                      <Upload size={20} className="text-gray-600" />

                      <span className="text-xs text-gray-600">
                        Upload payment screenshot
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleQrScreenshotChange}
                    className="hidden"
                  />
                </label>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="flex-1 rounded-lg border border-white/[0.08] py-3 text-xs font-medium text-gray-500 transition hover:bg-white/[0.03]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleQrSubmit}
                    disabled={qrSubmitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#C9A24B] py-3 text-xs font-semibold text-[#0A0908] transition hover:bg-[#D9B662] disabled:opacity-40"
                  >
                    {qrSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Submit for Review"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}