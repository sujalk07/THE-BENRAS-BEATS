"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import qrimage from "../../assets/payment-qr.png";

import Script from "next/script";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  Check,
  Music,
  Sparkles,
  ArrowLeft,
  Loader2,
  X,
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  LogIn,
} from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Toggle this to true once Razorpay live mode is approved and ready
const MEMBERSHIPS_ENABLED = false;

// Amount for the manual QR-payment flow (shown while MEMBERSHIPS_ENABLED is false)
const QR_MEMBERSHIP_AMOUNT = 4999;

const tiers = [
  {
    name: "Introductory Membership",
    id: "intro",
    price: "₹4,999",
    frequency: "6 months",
    description: "Special introductory offer for the first 50 members only.",
    features: [
      "6 Months Membership",
      "Priority access to all Benaras Beats events",
      "Exclusive member community",
      "Special member-only experiences",
      "Discounts on selected events",
    ],
    icon: Sparkles,
    mostPopular: true,
  },
  {
    name: "Regular Membership",
    id: "regular",
    price: "₹6,000",
    frequency: "6 months",
    description: "Regular membership with all premium benefits. Available anytime.",
    features: [
      "6 Months Membership",
      "Priority access to all Benaras Beats events",
      "Exclusive member community",
      "Special member-only experiences",
      "Discounts on selected events",
    ],
    icon: Music,
    mostPopular: false,
  },
];

const MEMBERSHIP_RULES = [
  "Membership is valid for the stated duration only and is non-transferable.",
  "Membership fees are non-refundable once payment is completed.",
  "Access to member-only events is subject to availability and capacity limits.",
  "The Benaras Beats reserves the right to modify membership benefits at any time.",
  "Misuse of membership privileges may result in cancellation without refund.",
  "Members must carry valid ID matching their registered account when attending events.",
];

// Status of the current user's manual QR-payment submission / membership
type MyStatus =
  | { status: "loading" }
  | { status: "none" }
  | { status: "pending"; submittedAt?: string }
  | { status: "active"; startsAt?: string; expiresAt?: string }
  | { status: "rejected"; adminNote?: string | null };

export default function MembershipPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [soldOut, setSoldOut] = useState(false);
  const [slotsLeft, setSlotsLeft] = useState(50);
  const [pageLoading, setPageLoading] = useState(true);
  const [subscribingPlan, setSubscribingPlan] = useState<"intro" | "regular" | null>(null);

  const [showRulesModal, setShowRulesModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<"intro" | "regular" | null>(null);
  const [agreedToRules, setAgreedToRules] = useState(false);

  // ---- QR-payment manual flow state (replaces the old waitlist state) ----
  const [myStatus, setMyStatus] = useState<MyStatus>({ status: "loading" });
  const [fullName, setFullName] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [qrSubmitting, setQrSubmitting] = useState(false);
  const [qrFormError, setQrFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  useEffect(() => {
    if (!MEMBERSHIPS_ENABLED) {
      setPageLoading(false);
      return;
    }
    fetch("/api/membership-status")
      .then((res) => res.json())
      .then((data) => {
        setSoldOut(data.isIntroSoldOut);
        setSlotsLeft(data.slotsRemaining);
      })
      .catch((err) => console.error("Error fetching system availability configuration states:", err))
      .finally(() => setPageLoading(false));
  }, []);

  // Fetch the current user's QR-payment request / membership status
  useEffect(() => {
    if (MEMBERSHIPS_ENABLED) return; // only needed while the manual flow is active
    if (!user) {
      setMyStatus({ status: "none" });
      return;
    }
    fetch(`/api/membership/my-status?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setMyStatus(data))
      .catch(() => setMyStatus({ status: "none" }));
  }, [user]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleQrSubmit = async () => {
    if (!user) return;
    setQrFormError(null);

    if (!fullName.trim()) {
      setQrFormError("Please enter your full name.");
      return;
    }
    if (!screenshotFile) {
      setQrFormError("Please upload a screenshot of your payment.");
      return;
    }

    setQrSubmitting(true);
    try {
      const fileExt = screenshotFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(path, screenshotFile);

      if (uploadError) {
        throw new Error("Failed to upload screenshot. Please try again.");
      }

      const res = await fetch("/api/membership/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          fullName: fullName.trim(),
          screenshotPath: path,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request.");

      setMyStatus({ status: "pending", submittedAt: new Date().toISOString() });
    } catch (err: any) {
      setQrFormError(err.message);
    } finally {
      setQrSubmitting(false);
    }
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "long" }) : "—";

  const handleSubscribeClick = (plan: "intro" | "regular") => {
    if (plan === "intro" && soldOut) {
      alert("This offer has expired!");
      return;
    }

    if (!user) {
      router.push(`/login?redirect=/membership&plan=${plan}`);
      return;
    }

    setPendingPlan(plan);
    setAgreedToRules(false);
    setShowRulesModal(true);
  };

  const handleConfirmRules = () => {
    if (!agreedToRules || !pendingPlan) return;
    setShowRulesModal(false);
    handleSubscribe(pendingPlan);
  };

  const handleSubscribe = async (plan: "intro" | "regular") => {
    if (!user) return;

    setSubscribingPlan(plan);

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "The Benaras Beats",
        description: plan === "intro" ? "Introductory Membership" : "Regular Membership",
        order_id: data.orderId,
        handler: async function (rzpResponse: any) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature,
                userId: user.id,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            alert("Congratulations! Your membership has been activated successfully!");
            router.push("/");
            router.refresh();
          } catch (err: any) {
            console.error(err);
            alert(err.message);
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#f59e0b",
        },
      };

      if (!(window as any).Razorpay) {
        alert("Razorpay SDK not found.");
        return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setSubscribingPlan(null);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-amber-500 font-medium tracking-wide">
          <Loader2 className="h-8 w-8 animate-spin" />
          Loading membership options...
        </div>
      </div>
    );
  }

  // ============================================================
  // MEMBERSHIPS DISABLED — show QR-code + payment-proof form instead
  // (this replaces the old "notify me" waitlist)
  // ============================================================
  if (!MEMBERSHIPS_ENABLED) {
    return (
      <div className="min-h-screen bg-[#0B0C10] px-4 py-6">
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <h1 className={`${cormorant.className} text-3xl sm:text-4xl font-bold text-white mb-2`}>
            Become a Member
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            ₹{QR_MEMBERSHIP_AMOUNT.toLocaleString("en-IN")} for 6 months of priority access, member
            community, and exclusive experiences.
          </p>

          {/* Signed out */}
          {!user && myStatus.status === "none" && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
              <LogIn className="mx-auto mb-4 text-amber-400" size={28} />
              <p className="text-gray-300 mb-5">Please sign in to apply for membership.</p>
              <button
                onClick={() => router.push("/login?redirect=/membership")}
                className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400 transition"
              >
                Sign In
              </button>
            </div>
          )}

          {myStatus.status === "loading" && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={16} className="animate-spin" /> Checking your status...
            </div>
          )}

          {/* Active member */}
          {user && myStatus.status === "active" && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 text-emerald-400" size={28} />
              <p className="text-lg font-semibold text-white mb-1">You're a member!</p>
              <p className="text-sm text-gray-300">
                Valid until <span className="text-emerald-400 font-medium">{formatDate(myStatus.expiresAt)}</span>
              </p>
            </div>
          )}

          {/* Pending review */}
          {user && myStatus.status === "pending" && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-8 text-center">
              <Clock className="mx-auto mb-4 text-amber-400" size={28} />
              <p className="text-lg font-semibold text-white mb-1">Under review</p>
              <p className="text-sm text-gray-300">
                We've received your payment submission and will verify it shortly. You'll get an
                email once it's confirmed.
              </p>
            </div>
          )}

          {/* Rejected — show reason, form reappears below to resubmit */}
          {user && myStatus.status === "rejected" && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 flex items-start gap-2">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                We couldn't verify your previous submission
                {myStatus.adminNote ? `: ${myStatus.adminNote}` : "."} Please try again below.
              </span>
            </div>
          )}

          {/* Form — shown when signed in and not active/pending */}
          {user && (myStatus.status === "none" || myStatus.status === "rejected") && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="text-center mb-6">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                  Step 1 — Scan &amp; Pay
                </p>
                <div className="mx-auto w-48 h-48 rounded-xl overflow-hidden border border-white/10 bg-white p-2">
                  {/* Replace /assets/payment-qr.png with your actual QR code image */}
                  <Image
                    src={qrimage}
                    alt="Payment QR Code"
                    width={192}
                    height={192}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-400">
                  Scan and pay{" "}
                  <span className="text-amber-400 font-semibold">₹{QR_MEMBERSHIP_AMOUNT}</span>
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
                  Step 2 — Submit Your Details
                </p>

                <label className="block text-sm text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                />

                <label className="block text-sm text-gray-300 mb-1.5">Payment Screenshot</label>
                <label
                  htmlFor="screenshot-upload"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-sm text-gray-400 cursor-pointer hover:border-amber-500/50 transition"
                >
                  {screenshotPreview ? (
                    <img
                      src={screenshotPreview}
                      alt="Payment screenshot preview"
                      className="max-h-48 rounded-lg object-contain"
                    />
                  ) : (
                    <>
                      <UploadCloud size={22} className="text-gray-500" />
                      Tap to upload screenshot
                    </>
                  )}
                </label>
                <input
                  id="screenshot-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  className="hidden"
                />

                {qrFormError && <p className="mt-3 text-sm text-red-400">{qrFormError}</p>}

                <button
                  onClick={handleQrSubmit}
                  disabled={qrSubmitting}
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {qrSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // MEMBERSHIPS ENABLED — normal Razorpay purchase flow (unchanged)
  // ============================================================
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("✅ Razorpay SDK Loaded");
          setRazorpayLoaded(true);
        }}
        onError={() => {
          console.log("❌ Razorpay SDK Failed");
        }}
      />

      <div className="min-h-screen bg-[#0B0C10] px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
            aria-label="Back to home"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <div className="mx-auto grid max-w-lg grid-cols-1 gap-y-6 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
            {tiers.map((tier) => {
              const IconComponent = tier.icon;
              const isIntroCard = tier.id === "intro";
              const isCardDisabled = isIntroCard && soldOut;
              const isBusy = subscribingPlan === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col justify-between rounded-3xl p-8 ring-1 transition-all duration-300 ${
                    isCardDisabled
                      ? "opacity-40 pointer-events-none ring-white/5 bg-gray-900/20"
                      : tier.mostPopular
                      ? "bg-gradient-to-b from-amber-500/10 to-transparent ring-amber-500/50 hover:scale-[1.02]"
                      : "bg-white/[0.02] ring-white/10 hover:ring-white/20 hover:scale-[1.02]"
                  }`}
                >
                  {tier.mostPopular && !isCardDisabled && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold tracking-wider text-black uppercase">
                      Intro Offer
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3
                        className={`${cormorant.className} text-2xl font-bold text-white ${
                          isCardDisabled ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {tier.name}
                      </h3>

                      <IconComponent
                        className={tier.mostPopular && !isCardDisabled ? "text-amber-400" : "text-gray-400"}
                        size={24}
                      />
                    </div>

                    <p className="mt-4 text-sm text-gray-400">{tier.description}</p>

                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className={`text-5xl font-bold text-white ${isCardDisabled ? "text-gray-500" : ""}`}>
                        {tier.price}
                      </span>
                      <span className="text-sm text-gray-400">/{tier.frequency}</span>
                    </p>

                    {isIntroCard && (
                      <div
                        className={`mt-3 rounded-lg border p-3 ${
                          isCardDisabled ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/30"
                        }`}
                      >
                        <p className={`text-sm font-medium ${isCardDisabled ? "text-red-400" : "text-amber-300"}`}>
                          {isCardDisabled
                            ? "❌ All 50 early bird slots have been claimed."
                            : `🔥 Only ${slotsLeft} introductory slots remaining!`}
                        </p>
                      </div>
                    )}

                    {tier.id === "regular" && (
                      <div className="mt-3 rounded-lg bg-white/5 border border-white/10 p-3">
                        <p className="text-sm font-medium text-gray-300">Available all year round.</p>
                      </div>
                    )}

                    <ul className="mt-8 space-y-3 text-sm text-gray-300">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-x-3">
                          <Check className={`h-5 w-5 flex-none ${isCardDisabled ? "text-gray-600" : "text-amber-400"}`} />
                          <span className={isCardDisabled ? "text-gray-500" : ""}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={isCardDisabled || isBusy}
                    onClick={() => handleSubscribeClick(tier.id as "intro" | "regular")}
                    className={`mt-8 rounded-xl px-4 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      isCardDisabled || isBusy
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : tier.mostPopular
                        ? "bg-amber-500 text-black hover:bg-amber-400"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {isBusy ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : isCardDisabled ? (
                      "Sold Out"
                    ) : user ? (
                      "Become a Member"
                    ) : (
                      "Login to Continue"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Membership Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1f232d] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Membership Rules</h2>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-gray-500 hover:text-white transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="space-y-2.5 text-sm text-gray-300 max-h-64 overflow-y-auto pr-1">
              {MEMBERSHIP_RULES.map((rule, i) => (
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
              <span>I have read and agree to the membership rules above.</span>
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
    </>
  );
}