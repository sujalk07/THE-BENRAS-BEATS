"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Script from "next/script";
import { useAuth } from "@/components/providers/AuthProvider";
import { Check, Music, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

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

export default function MembershipPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [soldOut, setSoldOut] = useState(false);
  const [slotsLeft, setSlotsLeft] = useState(50);
  const [pageLoading, setPageLoading] = useState(true);
  const [subscribingPlan, setSubscribingPlan] = useState<"intro" | "regular" | null>(null);

  useEffect(() => {
    fetch("/api/membership-status")
      .then((res) => res.json())
      .then((data) => {
        setSoldOut(data.isIntroSoldOut);
        setSlotsLeft(data.slotsRemaining);
      })
      .catch((err) => console.error("Error fetching system availability configuration states:", err))
      .finally(() => setPageLoading(false));
  }, []);

  const handleSubscribe = async (plan: "intro" | "regular") => {
    if (plan === "intro" && soldOut) {
      alert("This offer has expired!");
      return;
    }

    if (!user) {
      router.push(`/login?redirect=/membership&plan=${plan}`);
      return;
    }

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

      console.log("razorpayLoaded =", razorpayLoaded);
console.log("window.Razorpay =", (window as any).Razorpay);

      if (!(window as any).Razorpay) {
  alert("Razorpay SDK not found.");
  return;
}

console.log("Opening Razorpay...");

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

  return (
    <>
      <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="afterInteractive"
  onLoad={() => {
    console.log("✅ Razorpay SDK Loaded");
    // console.log((window as any).Razorpay);
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
                    onClick={() => handleSubscribe(tier.id as "intro" | "regular")}
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
    </>
  );
}