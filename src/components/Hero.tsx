"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import heroImage from "../assets/hero.jpg";
import { Great_Vibes, Playfair_Display } from "next/font/google";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
  const [isActiveMember, setIsActiveMember] = useState(false);

  useEffect(() => {
    async function checkMembershipStatus() {
      if (!user) {
        setIsActiveMember(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("membership_status")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Supabase error fetching profile:", error.message);
          setIsActiveMember(false);
          return;
        }

        // Trim any hidden whitespace and force lowercase comparison safely
        const status = data?.membership_status?.trim().toLowerCase();

        if (status === "active") {
          setIsActiveMember(true);
        } else {
          setIsActiveMember(false);
        }
      } catch (err) {
        console.error("Error verifying profile membership state:", err);
        setIsActiveMember(false);
      }
    }

    checkMembershipStatus();
  }, [user]);

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
      // Scenario 1: Completely logged out -> Go to signup, then auto-forward to membership page
      router.push("/signup?redirectTo=/membership");
    } else if (!isActiveMember) {
      // Scenario 2: Logged in but not active yet -> Skip signup, go straight to membership page
      router.push("/membership");
    } else {
      // Scenario 3: Logged in and active premium member -> Go straight to the dashboard panel
      router.push("/dashboard");
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
            MUSIC • CULTURE • COMMUNITY
          </p>

          <p
            className="mb-1 text-3xl sm:text-4xl lg:text-5xl text-amber-400 font-normal tracking-wide"
            style={{ fontFamily: "var(--font-great-vibes), cursive" }}
          >
            Music for Mind & Soul
          </p>

          <h1
            className="text-4xl font-bold leading-[1.15] text-white sm:text-6xl lg:text-7xl tracking-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Where Music
            <span className="block text-amber-400 mt-1">
              Finds Its Soul
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300/90 sm:text-lg">
            A vibrant community celebrating music, culture, and hidden talent.
            Join performances, connect with artists, and become part of
            unforgettable musical experiences that inspire, uplift, and bring
            people together.
          </p>

          <div className="mt-10 flex flex-wrap gap-5 items-center">
            {/* Left Button: Explore Events */}
            <button
              onClick={handleScrollToEvents}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] active:scale-[0.98]"
            >
              <span className="relative z-10">Explore Events</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>

            {/* Right Button: Dynamic Membership check */}
            <button
              onClick={handleMembershipClick}
              className="rounded-xl border border-purple-500/40 bg-black/40 backdrop-blur-sm px-8 py-3.5 font-medium text-white shadow-[0_0_15px_rgba(168,85,247,0.05)] transition-all duration-300 hover:border-purple-400 hover:bg-purple-950/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.45)] active:scale-[0.98]"
            >
              {isActiveMember ? "Go to Dashboard" : "Become a Member"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}