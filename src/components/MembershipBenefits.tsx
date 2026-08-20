import React from "react";
import {
  Sparkles,
  Ticket,
  Users2,
  Percent,
  ArrowUpRight,
} from "lucide-react";

export default function MembershipBenefits() {
  const benefits = [
    {
      icon: Ticket,
      number: "01",
      title: "Priority Access",
      description:
        "Get early access to registrations, front-row seats, and limited special events.",
    },
    {
      icon: Percent,
      number: "02",
      title: "Member Privileges",
      description:
        "Enjoy exclusive discounts on selected events, experiences, and curated merchandise.",
    },
    {
      icon: Users2,
      number: "03",
      title: "A Shared Circle",
      description:
        "Meet local artists, performers, music lovers, and people who share a passion for culture.",
    },
    {
      icon: Sparkles,
      number: "04",
      title: "Beyond the Stage",
      description:
        "Experience intimate acoustic gatherings, masterclasses, and member-only moments.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#0A0908] px-6 py-24 text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#B8923F]/[0.04] blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">

          {/* LEFT — Membership statement */}
          <div className="flex flex-col justify-between lg:min-h-[600px]">
            <div>
              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-10 bg-[#B8923F]" />

                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8923F]">
                  Membership
                </span>
              </div>

              <h2 className="font-serif text-5xl leading-[1.05] tracking-wide text-[#EDE6D9] md:text-6xl">
                Come for
                <br />
                the music.
                <br />
                <span className="italic text-[#C9A24B]">
                  Stay for the people.
                </span>
              </h2>

              <p className="mt-8 max-w-md text-sm leading-7 text-gray-400 md:text-base">
                Membership opens the door to a closer experience of The
                Benaras Beats — from intimate gatherings to the people and
                artists who give them meaning.
              </p>
            </div>

            {/* Membership mark */}
            <div className="mt-14 hidden lg:block">
              <div className="relative h-36 w-52 border border-[#B8923F]/25 bg-[#11100E] p-5">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-gray-600">
                    TBB / MEMBER
                  </span>

                  <Sparkles className="h-4 w-4 text-[#B8923F]" />
                </div>

                <div className="absolute bottom-5 left-5">
                  <span className="block font-serif text-xl text-[#EDE6D9]">
                    Benaras Beats
                  </span>

                  <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-gray-600">
                    Music · Culture · Community
                  </span>
                </div>

                {/* Decorative lines */}
                <div className="absolute bottom-0 right-0 h-8 w-8 border-l border-t border-[#B8923F]/20" />
              </div>
            </div>
          </div>

          {/* RIGHT — Benefits list */}
          <div className="border-t border-white/[0.08]">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.number}
                  className="group relative border-b border-white/[0.08] py-7 transition-all duration-300 hover:px-4"
                >
                  <div className="flex gap-5 md:gap-7">

                    {/* Number */}
                    <div className="w-8 shrink-0 pt-1">
                      <span className="font-mono text-[10px] tracking-[0.15em] text-gray-600">
                        {benefit.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/[0.08] bg-white/[0.02] transition-all duration-300 group-hover:border-[#B8923F]/40 group-hover:bg-[#B8923F]/[0.06]">
                      <Icon className="h-5 w-5 text-[#B8923F]" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-serif text-2xl tracking-wide text-[#EDE6D9] transition-colors duration-300 group-hover:text-[#C9A24B]">
                          {benefit.title}
                        </h3>

                        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-gray-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#B8923F]" />
                      </div>

                      <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-[#B8923F] transition-all duration-500 group-hover:w-20" />
                </div>
              );
            })}

            {/* Bottom note */}
            <div className="flex items-center justify-between pt-7">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
                Your membership
              </span>

              <span className="text-xs text-gray-500">
                Opens a wider circle.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}