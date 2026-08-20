"use client";
import Image from "next/image";
import heroImage from "../assets/hero.jpg";
import { Playfair_Display, Inter } from "next/font/google";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMembership } from "@/hooks/useMembership";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

export default function Hero() {
  const { user } = useAuth();
  const router = useRouter();

  // Track actual membership verification status separately from basic login
  const { isMember, loading } = useMembership();
  const [showClaimTicket, setShowClaimTicket] = useState(false);
  const [claimEventId, setClaimEventId] = useState<string | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);

  // Action 1: Smooth scroll to events listing
  const handleScrollToEvents = () => {
    const eventsElement = document.getElementById("events-section");
    if (eventsElement) {
      eventsElement.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#events-section");
    }
  };

  // Action 2: Premium Member redirection loop
  const handleMembershipClick = () => {
    if (!user) {
      router.push("/signup?redirectTo=/membership");
      return;
    }

    if (loading) return;

    if (isMember) {
      router.push("/dashboard");
    } else {
      router.push("/membership");
    }
  };

  useEffect(() => {
    if (loading) return;

    async function checkNextEvent() {
      if (!user || !isMember) {
        setShowClaimTicket(false);
        setClaimEventId(null);
        return;
      }

      try {
        const res = await fetch(`/api/events/list?userId=${user.id}`);
        const data = await res.json();

        // Find the first upcoming event that can still be claimed
        const nextEvent = data.events?.find(
          (event: any) => !event.isUserRegistered && !event.isSoldOut
        );

        if (!nextEvent) {
          setShowClaimTicket(false);
          setClaimEventId(null);
          return;
        }

        setShowClaimTicket(true);
        setClaimEventId(nextEvent.id);
      } catch (err) {
        console.error(err);
        setShowClaimTicket(false);
        setClaimEventId(null);
      }
    }

    checkNextEvent();
  }, [user, isMember, loading]);

  const handleClaimTicket = async () => {
    if (!claimEventId || !user) return;

    setClaimLoading(true);

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: claimEventId,
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to claim ticket.");
      }

      alert("🎉 " + data.message);

      setShowClaimTicket(false);
      setClaimEventId(null);

      // Refresh so the Hero and event sections reflect the new state.
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <section
      className={`relative min-h-[90vh] w-full overflow-hidden bg-[#0A0908] flex items-center ${playfair.variable} ${inter.variable}`}
    >
      {/* Background Layer: Image + Gradient Overlay (single direction, no color blobs) */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src={heroImage}
          alt="Live Performance Background"
          fill
          priority
          className="object-cover object-center opacity-50 md:opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908] via-[#0A0908]/92 to-[#0A0908]/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-transparent z-10" />
      </div>

      {/* Content Container */}
      <div
        className="relative mx-auto max-w-7xl w-full px-6 sm:px-8 py-24 z-20"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <div className="max-w-3xl flex flex-col justify-center">
          {/* Eyebrow + signature waveform, replacing the old script line + blur blob */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-end gap-[3px] h-4" aria-hidden="true">
              {[6, 12, 8, 16, 10, 14, 7].map((h, i) => (
                <span
                  key={i}
                  className="w-[2.5px] rounded-full bg-[#B8923F]"
                  style={{
                    height: `${h}px`,
                    animation: `wf-pulse 1.6s ease-in-out ${i * 0.12}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#B8923F]/90">
              Music &middot; Wellness &middot; Community
            </p>
          </div>

          <p
            className="mb-3 text-lg sm:text-xl italic text-[#D9CBA0]"
            style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 500 }}
          >
            Music for mind &amp; soul
          </p>

          <h1
            className="text-4xl font-bold leading-[1.12] text-[#EDE6D9] sm:text-6xl lg:text-7xl tracking-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Where music
            <span className="block text-[#C9A24B] mt-1">
              heals, connects &amp; inspires
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#A39A8C] sm:text-lg">
            Where music becomes a journey of connection, wellbeing, and
            culture. The Benaras Beats brings people together through soulful
            performances that inspire, uplift, and celebrate the timeless
            spirit of Banaras.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 items-center">
            {/* Primary: Explore Events / Claim Ticket */}
            <button
              onClick={showClaimTicket ? handleClaimTicket : handleScrollToEvents}
              disabled={claimLoading}
              className="rounded-lg bg-[#C9A24B] px-8 py-3.5 font-semibold text-[#0A0908] shadow-[0_0_18px_rgba(201,162,75,0.22)] transition-all duration-200 hover:bg-[#D9B662] hover:shadow-[0_0_26px_rgba(201,162,75,0.4)] active:scale-[0.98] disabled:opacity-60"
            >
              {claimLoading
                ? "Claiming..."
                : showClaimTicket
                ? "Claim your free ticket"
                : "Explore events"}
            </button>

            {/* Secondary: Membership — oxblood, not purple */}
            <button
              onClick={handleMembershipClick}
              className="rounded-lg border border-[#7A2331]/60 bg-transparent px-8 py-3.5 font-medium text-[#EDE6D9] transition-all duration-200 hover:border-[#A3384A] hover:bg-[#7A2331]/15 active:scale-[0.98]"
            >
              {loading ? "Loading..." : isMember ? "Go to dashboard" : "Become a member"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wf-pulse {
          0%,
          100% {
            transform: scaleY(0.55);
            opacity: 0.65;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="wf-pulse"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}