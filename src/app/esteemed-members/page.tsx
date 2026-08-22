"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Member = {
  name: string;
  photo_url: string;
};

export default function EsteemedMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from("featured_members")
          .select("name, photo_url");

        if (error) {
          throw error;
        }

        setMembers(data ?? []);
      } catch (error) {
        console.error("Failed to fetch esteemed members:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080706] text-[#C9A24B]">
        <p className="text-sm uppercase tracking-[0.3em]">
          Loading members...
        </p>
      </main>
    );
  }

  if (members.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080706] text-white">
        <p>No members found.</p>
      </main>
    );
  }

  // Divide members between the two rows
  const midpoint = Math.ceil(members.length / 2);

  const firstRow = members.slice(0, midpoint);
  const secondRow = members.slice(midpoint);

  // Duplicate each row so the marquee loops continuously
  const firstRowLoop = [...firstRow, ...firstRow];
  const secondRowLoop = [...secondRow, ...secondRow];

  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#080706] text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8923F]/[0.04] blur-[150px]" />

      {/* Header */}
      <div className="relative z-10 mb-14 text-center">

        <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-[#B8923F]">
          The Benaras Beats
        </p>

        <h1
          className="text-4xl font-semibold tracking-wide text-[#EDE6D9] md:text-6xl"
          style={{
            fontFamily: "var(--font-playfair), serif",
          }}
        >
          Our Esteemed Members
        </h1>

        <div className="mx-auto mt-6 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B8923F]/60" />

          <span className="h-1.5 w-1.5 rotate-45 bg-[#B8923F]" />

          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B8923F]/60" />
        </div>

      </div>

      {/* ROW 1 */}
      <div className="relative z-10 mb-8 overflow-hidden">

        <div className="marquee-left flex w-max gap-8">

          {firstRowLoop.map((member, index) => (
            <MemberCard
              key={`first-${index}`}
              member={member}
            />
          ))}

        </div>

      </div>

      {/* ROW 2 */}
      {secondRow.length > 0 && (
        <div className="relative z-10 overflow-hidden">

          <div className="marquee-right flex w-max gap-8">

            {secondRowLoop.map((member, index) => (
              <MemberCard
                key={`second-${index}`}
                member={member}
              />
            ))}

          </div>

        </div>
      )}

      {/* Bottom text */}
      <div className="relative z-10 mt-14 text-center">

        <p className="text-[9px] uppercase tracking-[0.4em] text-[#766E61]">
          Music · Culture · Community
        </p>

      </div>

      {/* Side fades */}
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-32 bg-gradient-to-r from-[#080706] to-transparent md:w-52" />

      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-32 bg-gradient-to-l from-[#080706] to-transparent md:w-52" />

      {/* Animation */}
      <style jsx>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(calc(-50% - 1rem));
          }
        }

        @keyframes marquee-right {
          from {
            transform: translateX(calc(-50% - 1rem));
          }

          to {
            transform: translateX(0);
          }
        }

        .marquee-left {
          animation: marquee-left 35s linear infinite;
        }

        .marquee-right {
          animation: marquee-right 35s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-left,
          .marquee-right {
            animation-play-state: paused;
          }
        }
      `}</style>

    </main>
  );
}

function MemberCard({
  member,
}: {
  member: Member;
}) {
  return (
    <div className="group flex w-[220px] flex-shrink-0 flex-col items-center md:w-[260px]">

      {/* Photo */}
      <div className="relative h-[170px] w-[170px] overflow-hidden rounded-full border border-[#B8923F]/30 bg-[#15120E] p-[4px] md:h-[200px] md:w-[200px]">

        <div className="relative h-full w-full overflow-hidden rounded-full">

          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            sizes="200px"
            className="object-cover"
          />

        </div>

      </div>

      {/* Name */}
      <div className="mt-5 text-center">

        <h2
          className="text-xl tracking-wide text-[#EDE6D9] md:text-2xl"
          style={{
            fontFamily: "var(--font-playfair), serif",
          }}
        >
          {member.name}
        </h2>

        <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-[#B8923F]">
          Esteemed Member
        </p>

      </div>

    </div>
  );
}