"use client";
import Image from "next/image";
import heroImage from "../assets/hero.jpg";
import { Great_Vibes, Playfair_Display } from "next/font/google";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMembership } from "@/hooks/useMembership";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
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
        (event: any) =>
          !event.isUserRegistered && !event.isSoldOut
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
      className={`relative min-h-[90vh] w-full overflow-hidden bg-[#050505] flex items-center ${greatVibes.variable} ${playfair.variable}`}
    >
      {/* Background Layer: Image + Gradient Overlays */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src={heroImage}
          alt="Live Performance Background"
          fill
          priority
          className="object-cover object-center opacity-60 md:opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
        <div className="absolute right-0 bottom-0 h-96 w-96 bg-purple-600/10 blur-[150px] pointer-events-none z-10" />
      </div>


      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl w-full px-6 sm:px-8 py-24 z-20">
        <div className="max-w-3xl flex flex-col justify-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80 md:text-sm">
            MUSIC • WELLNESS • COMMUNITY
          </p>

          <p
            className="mb-1 text-3xl sm:text-4xl lg:text-5xl text-amber-400 font-normal tracking-wide"
            style={{ fontFamily: "var(--font-great-vibes), cursive" }}
          >
            Music for Mind & Soul
          </p>

          <h1
            className="text-4xl mt-2 font-bold leading-[1.15] text-white sm:text-6xl lg:text-7xl tracking-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Where Music
            <span className="block text-amber-400 mt-1">
              Heals, Connects & Inspires
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300/90 sm:text-lg">
            Where music becomes a journey of connection, wellbeing, and culture. The Benaras Beats brings people together through soulful performances 
            that inspire, uplift, and celebrate the timeless spirit of Banaras.
          </p>

          <div className="mt-10 flex flex-wrap gap-5 items-center">
            {/* Left Button: Explore Events */}
<button
  onClick={
    showClaimTicket
      ? handleClaimTicket
      : handleScrollToEvents
  }
  disabled={claimLoading}
  className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] active:scale-[0.98]"
>
  <span className="relative z-10">
    {claimLoading
      ? "Claiming..."
      : showClaimTicket
      ? "Claim Your Free Ticket"
      : "Explore Events"}
  </span>

  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
</button>

            {/* Right Button: Dynamic Membership check */}
            <button
              onClick={handleMembershipClick}
              className="rounded-xl border border-purple-500/40 bg-black/40 backdrop-blur-sm px-8 py-3.5 font-medium text-white shadow-[0_0_15px_rgba(168,85,247,0.05)] transition-all duration-300 hover:border-purple-400 hover:bg-purple-950/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.45)] active:scale-[0.98]"
            >
              {loading
  ? "Loading..."
  : isMember
  ? "Go to Dashboard"
  : "Become a Member"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}