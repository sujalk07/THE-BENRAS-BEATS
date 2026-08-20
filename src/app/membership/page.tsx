"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import qrimage from "../../assets/payment-qr.png";
import { useMembership } from "@/hooks/useMembership";
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
  Crown,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Toggle this to true once Razorpay live mode is approved and ready
const MEMBERSHIPS_ENABLED = true;

// Amount for manual QR-payment flow
const QR_MEMBERSHIP_AMOUNT = 4999;

const tiers = [
  {
    name: "Introductory Membership",
    id: "intro",
    price: "₹4,999",
    frequency: "6 months",
    description:
      "A special invitation for the first circle of Benaras Beats members.",
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
    description:
      "Full access to the Benaras Beats community, experiences, and privileges.",
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

type MyStatus =
  | { status: "loading" }
  | { status: "none" }
  | { status: "pending"; submittedAt?: string }
  | { status: "active"; startsAt?: string; expiresAt?: string }
  | { status: "rejected"; adminNote?: string | null };

export default function MembershipPage() {
  const { user } = useAuth();

  const {
    isMember,
    membership,
    loading: membershipLoading,
  } = useMembership();

  const router = useRouter();

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [subscribingPlan, setSubscribingPlan] = useState<
    "intro" | "regular" | null
  >(null);

  const [showRulesModal, setShowRulesModal] = useState(false);

  const [pendingPlan, setPendingPlan] = useState<
    "intro" | "regular" | null
  >(null);

  const [agreedToRules, setAgreedToRules] = useState(false);

  // QR payment flow
  const [myStatus, setMyStatus] = useState<MyStatus>({
    status: "loading",
  });

  const [fullName, setFullName] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );

  const [qrSubmitting, setQrSubmitting] = useState(false);
  const [qrFormError, setQrFormError] = useState<string | null>(null);

  // ------------------------------------------------------------
  // EXISTING LOGIC
  // ------------------------------------------------------------

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  useEffect(() => {
    setPageLoading(false);
  }, []);

  useEffect(() => {
    if (MEMBERSHIPS_ENABLED) return;

    if (!user) {
      setMyStatus({ status: "none" });
      return;
    }

    fetch(`/api/membership/my-status?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setMyStatus(data))
      .catch(() => setMyStatus({ status: "none" }));
  }, [user]);

  const handleScreenshotChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        throw new Error(
          "Failed to upload screenshot. Please try again."
        );
      }

      const res = await fetch("/api/membership/submit-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          fullName: fullName.trim(),
          screenshotPath: path,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to submit request."
        );
      }

      setMyStatus({
        status: "pending",
        submittedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setQrFormError(err.message);
    } finally {
      setQrSubmitting(false);
    }
  };

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          dateStyle: "long",
        })
      : "—";

  const handleSubscribeClick = (
    plan: "intro" | "regular"
  ) => {
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

  const handleSubscribe = async (
    plan: "intro" | "regular"
  ) => {
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
        throw new Error(
          data.error || "Failed to create order"
        );
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "The Benaras Beats",
        description:
          plan === "intro"
            ? "Introductory Membership"
            : "Regular Membership",
        order_id: data.orderId,

        handler: async function (rzpResponse: any) {
          try {
            const verifyRes = await fetch(
              "/api/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id:
                    rzpResponse.razorpay_order_id,
                  razorpay_payment_id:
                    rzpResponse.razorpay_payment_id,
                  razorpay_signature:
                    rzpResponse.razorpay_signature,
                  userId: user.id,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(
                verifyData.error ||
                  "Payment verification failed."
              );
            }

            alert(
              "Congratulations! Your membership has been activated successfully!"
            );

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
          color: "#C9A24B",
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

  // ------------------------------------------------------------
  // LOADING
  // ------------------------------------------------------------

  if (pageLoading || membershipLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090807]">
        <div className="flex flex-col items-center gap-4 text-[#C9A24B]">
          <Loader2 className="h-8 w-8 animate-spin" />

          <span className="font-serif text-lg">
            Preparing your invitation...
          </span>
        </div>
      </div>
    );
  }

  // ============================================================
  // MANUAL QR PAYMENT FLOW
  // ============================================================

  if (!MEMBERSHIPS_ENABLED) {
    return (
      <div className="min-h-screen bg-[#090807] text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-[-150px] top-[15%] h-[450px] w-[450px] rounded-full bg-[#C9A24B]/[0.05] blur-[120px]" />
          <div className="absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-[#8D4E5D]/[0.08] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 py-8 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-12 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-[#C9A24B]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-[#C9A24B]" />

                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24B]">
                  Membership
                </span>
              </div>

              <h1
                className={`${cormorant.className} text-5xl leading-[0.95] text-[#EDE6D9] sm:text-6xl`}
              >
                Come closer
                <br />
                to the music.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-stone-400">
                Join a community built around music, culture,
                conversation, and experiences that stay with you.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-3">
                <div className="border border-white/[0.08] bg-white/[0.025] p-4">
                  <p className="font-serif text-2xl text-[#C9A24B]">
                    6
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">
                    Months
                  </p>
                </div>

                <div className="border border-white/[0.08] bg-white/[0.025] p-4">
                  <p className="font-serif text-2xl text-[#C9A24B]">
                    ₹4,999
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">
                    Membership
                  </p>
                </div>
              </div>
            </div>

            <div>
              {!user && myStatus.status === "none" && (
                <div className="border border-white/[0.08] bg-[#11100E] p-7 sm:p-9">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[#C9A24B]/20 bg-[#C9A24B]/[0.06]">
                    <LogIn
                      size={21}
                      className="text-[#C9A24B]"
                    />
                  </div>

                  <h2
                    className={`${cormorant.className} text-3xl text-[#EDE6D9]`}
                  >
                    Sign in to continue
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-stone-500">
                    Please sign in before submitting your
                    membership payment.
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        "/login?redirect=/membership"
                      )
                    }
                    className="mt-7 w-full bg-[#C9A24B] px-6 py-3.5 text-sm font-semibold text-[#090807] transition hover:bg-[#D9B662]"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {myStatus.status === "loading" && (
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Checking your membership status...
                </div>
              )}

              {user && isMember && membership && (
                <div className="border border-emerald-400/20 bg-emerald-400/[0.05] p-8">
                  <CheckCircle2
                    className="text-emerald-400"
                    size={28}
                  />

                  <h2
                    className={`${cormorant.className} mt-5 text-3xl text-[#EDE6D9]`}
                  >
                    You're part of the circle.
                  </h2>

                  <p className="mt-3 text-sm text-stone-400">
                    Your membership is valid until{" "}
                    <span className="text-emerald-400">
                      {formatDate(
                        membership.expires_at
                      )}
                    </span>
                  </p>
                </div>
              )}

              {user && myStatus.status === "pending" && (
                <div className="border border-[#C9A24B]/20 bg-[#C9A24B]/[0.05] p-8">
                  <Clock
                    className="text-[#C9A24B]"
                    size={28}
                  />

                  <h2
                    className={`${cormorant.className} mt-5 text-3xl text-[#EDE6D9]`}
                  >
                    Payment received.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-stone-400">
                    Your payment submission is under review.
                    We'll verify it shortly and notify you once
                    your membership is confirmed.
                  </p>
                </div>
              )}

              {user && myStatus.status === "rejected" && (
                <div className="mb-5 flex items-start gap-3 border border-red-400/20 bg-red-400/[0.05] p-4 text-sm text-red-300">
                  <XCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    We couldn't verify your previous submission
                    {myStatus.adminNote
                      ? `: ${myStatus.adminNote}`
                      : "."}{" "}
                    Please submit again.
                  </span>
                </div>
              )}

              {user &&
                !isMember &&
                (myStatus.status === "none" ||
                  myStatus.status === "rejected") && (
                  <div className="border border-white/[0.08] bg-[#11100E] p-6 sm:p-8">
                    <div className="mb-8">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A24B]">
                        Step 01
                      </p>

                      <h2
                        className={`${cormorant.className} mt-2 text-3xl text-[#EDE6D9]`}
                      >
                        Make your contribution
                      </h2>
                    </div>

                    <div className="flex flex-col items-center border-b border-white/[0.07] pb-8">
                      <div className="bg-white p-3">
                        <Image
                          src={qrimage}
                          alt="Payment QR Code"
                          width={210}
                          height={210}
                          className="h-[210px] w-[210px] object-contain"
                        />
                      </div>

                      <p className="mt-4 text-sm text-stone-400">
                        Scan and pay{" "}
                        <span className="font-semibold text-[#C9A24B]">
                          ₹{QR_MEMBERSHIP_AMOUNT}
                        </span>
                      </p>
                    </div>

                    <div className="pt-8">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#C9A24B]">
                        Step 02
                      </p>

                      <h2
                        className={`${cormorant.className} mt-2 text-3xl text-[#EDE6D9]`}
                      >
                        Tell us who you are
                      </h2>

                      <div className="mt-6">
                        <label className="mb-2 block text-xs uppercase tracking-wider text-stone-500">
                          Full Name
                        </label>

                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) =>
                            setFullName(e.target.value)
                          }
                          placeholder="Your full name"
                          className="w-full border border-white/10 bg-[#090807] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C9A24B]/50"
                        />
                      </div>

                      <div className="mt-5">
                        <label className="mb-2 block text-xs uppercase tracking-wider text-stone-500">
                          Payment Screenshot
                        </label>

                        <label
                          htmlFor="screenshot-upload"
                          className="flex min-h-32 cursor-pointer flex-col items-center justify-center border border-dashed border-white/10 bg-[#090807] p-5 text-sm text-stone-500 transition hover:border-[#C9A24B]/40 hover:text-stone-300"
                        >
                          {screenshotPreview ? (
                            <img
                              src={screenshotPreview}
                              alt="Payment screenshot preview"
                              className="max-h-48 rounded object-contain"
                            />
                          ) : (
                            <>
                              <UploadCloud
                                size={23}
                                className="mb-2 text-[#C9A24B]"
                              />
                              Click to upload payment proof
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
                      </div>

                      {qrFormError && (
                        <p className="mt-4 text-sm text-red-400">
                          {qrFormError}
                        </p>
                      )}

                      <button
                        onClick={handleQrSubmit}
                        disabled={qrSubmitting}
                        className="mt-6 flex w-full items-center justify-center gap-2 bg-[#C9A24B] py-3.5 text-sm font-semibold text-[#090807] transition hover:bg-[#D9B662] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {qrSubmitting ? (
                          <>
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                            Submitting...
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
        </div>
      </div>
    );
  }

  // ============================================================
  // RAZORPAY MEMBERSHIP FLOW
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

      <main className="min-h-screen bg-[#090807] text-white">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-[-180px] top-[10%] h-[500px] w-[500px] rounded-full bg-[#C9A24B]/[0.035] blur-[130px]" />

          <div className="absolute bottom-[-200px] right-[-100px] h-[500px] w-[500px] rounded-full bg-[#8D4E5D]/[0.06] blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8">
          {/* Navigation */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-14 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-[#C9A24B]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          {/* Hero */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#B8923F]" />

              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C9A24B]">
                Membership
              </span>

              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#B8923F]" />
            </div>

            <h1
              className={`${cormorant.className} text-5xl leading-none text-[#EDE6D9] sm:text-7xl`}
            >
              A little closer
              <br />
              to the music.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">
              Membership is more than a seat at an event.
              It is an invitation into the people, stories,
              performances, and experiences that make Benaras
              Beats what it is.
            </p>
          </div>

          {/* Small editorial strip */}
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-white/[0.07] py-4 text-[10px] uppercase tracking-[0.25em] text-stone-600">
            <span>Music</span>
            <span className="text-[#C9A24B]">•</span>
            <span>Culture</span>
            <span className="text-[#C9A24B]">•</span>
            <span>Community</span>
            <span className="text-[#C9A24B]">•</span>
            <span>Wellbeing</span>
          </div>

          {/* Membership cards */}
          <div className="mx-auto mt-12 grid max-w-5xl gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] lg:grid-cols-2">
            {tiers.map((tier) => {
              const IconComponent = tier.icon;
              const isIntroCard = tier.id === "intro";
              const isBusy =
                subscribingPlan === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`group relative flex min-h-[570px] flex-col justify-between bg-[#11100E] p-7 transition-colors duration-500 sm:p-10 ${
                    tier.mostPopular
                      ? "hover:bg-[#15130F]"
                      : "hover:bg-[#12110F]"
                  }`}
                >
                  {/* Card top */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-stone-600">
                          MEMBERSHIP /{" "}
                          {isIntroCard ? "01" : "02"}
                        </span>

                        <h2
                          className={`${cormorant.className} mt-4 text-3xl text-[#EDE6D9] sm:text-4xl`}
                        >
                          {tier.name}
                        </h2>
                      </div>

                      <div
                        className={`flex h-11 w-11 items-center justify-center border ${
                          tier.mostPopular
                            ? "border-[#C9A24B]/30 bg-[#C9A24B]/[0.06]"
                            : "border-white/[0.08] bg-white/[0.025]"
                        }`}
                      >
                        <IconComponent
                          size={20}
                          className={
                            tier.mostPopular
                              ? "text-[#C9A24B]"
                              : "text-stone-500"
                          }
                        />
                      </div>
                    </div>

                    {tier.mostPopular && (
                      <div className="mt-6 inline-flex items-center gap-2 border border-[#C9A24B]/20 bg-[#C9A24B]/[0.06] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
                        <Sparkles size={11} />
                        Limited Introduction
                      </div>
                    )}

                    <p className="mt-6 max-w-md text-sm leading-6 text-stone-500">
                      {tier.description}
                    </p>

                    <div className="mt-8 border-y border-white/[0.07] py-6">
                      <div className="flex items-end gap-2">
                        <span
                          className={`${cormorant.className} text-5xl text-[#EDE6D9]`}
                        >
                          {tier.price}
                        </span>

                        <span className="mb-2 text-xs uppercase tracking-wider text-stone-600">
                          / {tier.frequency}
                        </span>
                      </div>
                    </div>

                    {isIntroCard && (
                      <div className="mt-6 border-l-2 border-[#C9A24B]/50 pl-4">
                        <p className="text-xs leading-5 text-stone-400">
                          Join during our introductory period
                          and become part of the early circle
                          shaping the Benaras Beats community.
                        </p>
                      </div>
                    )}

                    {!isIntroCard && (
                      <div className="mt-6 border-l-2 border-white/10 pl-4">
                        <p className="text-xs leading-5 text-stone-500">
                          Continue enjoying full membership
                          privileges at our regular membership
                          price.
                        </p>
                      </div>
                    )}

                    {/* Features */}
                    <ul className="mt-8 space-y-4">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-stone-400"
                        >
                          <Check
                            size={16}
                            className="mt-0.5 shrink-0 text-[#C9A24B]"
                          />

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom */}
                  <div className="mt-10">
                    <button
                      disabled={isBusy || isMember}
                      onClick={() => {
                        if (isMember) return;

                        handleSubscribeClick(
                          tier.id as "intro" | "regular"
                        );
                      }}
                      className={`group/button flex w-full items-center justify-between border px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                        isBusy || isMember
                          ? "cursor-not-allowed border-white/[0.06] bg-white/[0.03] text-stone-600"
                          : tier.mostPopular
                          ? "border-[#C9A24B] bg-[#C9A24B] text-[#090807] hover:bg-[#D9B662]"
                          : "border-white/10 bg-white/[0.04] text-stone-200 hover:border-[#C9A24B]/40 hover:text-[#C9A24B]"
                      }`}
                    >
                      <span>
                        {isBusy ? (
                          <span className="flex items-center gap-2">
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                            Processing...
                          </span>
                        ) : isMember ? (
                          `Member until ${formatDate(
                            membership?.expires_at
                          )}`
                        ) : user ? (
                          tier.id === "intro" ? (
                            "Claim Introductory Offer"
                          ) : (
                            "Become a Member"
                          )
                        ) : (
                          "Login to Continue"
                        )}
                      </span>

                      {!isBusy && !isMember && (
                        <ArrowUpRight
                          size={17}
                          className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                        />
                      )}
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.18em] text-stone-600">
                      <ShieldCheck size={12} />
                      Secure payment via Razorpay
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom statement */}
          <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-3 border-t border-white/[0.06] pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
              The Benaras Beats
            </span>

            <span className="text-xs text-stone-600">
              Your membership helps keep the circle moving.
            </span>
          </div>
        </div>
      </main>

      {/* ========================================================
          MEMBERSHIP RULES MODAL
      ======================================================== */}

      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-lg border border-white/[0.1] bg-[#11100E] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between border-b border-white/[0.07] pb-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#C9A24B]">
                  Before you continue
                </p>

                <h2
                  className={`${cormorant.className} mt-2 text-3xl text-[#EDE6D9]`}
                >
                  Membership Rules
                </h2>
              </div>

              <button
                onClick={() => setShowRulesModal(false)}
                className="text-stone-600 transition hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="mt-6 max-h-64 space-y-4 overflow-y-auto pr-2 text-sm leading-6 text-stone-400">
              {MEMBERSHIP_RULES.map((rule, i) => (
                <li
                  key={i}
                  className="flex gap-3"
                >
                  <span className="font-mono text-xs text-[#C9A24B]">
                    0{i + 1}
                  </span>

                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-white/[0.07] pt-5 text-sm text-stone-400">
              <input
                type="checkbox"
                checked={agreedToRules}
                onChange={(e) =>
                  setAgreedToRules(e.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#C9A24B]"
              />

              <span>
                I have read and agree to the membership
                rules above.
              </span>
            </label>

            <div className="mt-5 border border-[#C9A24B]/15 bg-[#C9A24B]/[0.04] p-4">
              <p className="text-xs leading-5 text-stone-400">
                <span className="font-semibold text-[#C9A24B]">
                  Secure Payment:
                </span>{" "}
                Payments for The Benaras Beats are securely
                processed through Razorpay by{" "}
                <span className="font-semibold text-stone-300">
                  Changing Minds Counseling & Psychotherapy
                  Centre
                </span>
                , our parent organization. You may see this
                name as the merchant during checkout or on your
                bank statement.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowRulesModal(false)}
                className="border border-white/[0.08] py-3 text-sm font-semibold text-stone-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmRules}
                disabled={!agreedToRules}
                className="bg-[#C9A24B] py-3 text-sm font-semibold text-[#090807] transition hover:bg-[#D9B662] disabled:cursor-not-allowed disabled:opacity-30"
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