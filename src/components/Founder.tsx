"use client";

import Image from "next/image";
import { Quote, Sparkles } from "lucide-react";
import founderImg from "../assets/founder.png";

export default function Founder() {
  return (
    <section className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      {/* Background ambient lighting overlay */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[400px] h-[400px] bg-purple-950/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-amber-950/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-12 items-center md:grid-cols-12">
          {/* Left Column: Founder photo */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-amber-500/20 to-purple-600/20 blur opacity-75 group-hover:opacity-100 transition duration-300" />

              <div className="relative w-64 h-80 md:w-72 md:h-[26rem] rounded-2xl border border-gray-800/80 overflow-hidden">
                <Image
                  src={founderImg}
                  alt="Dr. Laxman Yadav — Founder, The Benaras Beats"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
              </div>
            </div>

            <div className="mt-5 text-center">
              <h3 className="text-lg font-semibold text-gray-100 tracking-wide">
                Dr. Laxman Yadav
              </h3>
              <p className="text-xs text-amber-500/80 tracking-wider uppercase mt-1">
                Founder & Clinical Psychologist
              </p>
            </div>
          </div>

          {/* Right Column: Founder's Vision Statement */}
          <div className="md:col-span-8 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              The Vision
            </div>

            <h2 className="mb-6 text-4xl font-serif tracking-wide text-gray-100">
              About The Founder
            </h2>

            <div className="space-y-4 text-sm md:text-base leading-relaxed text-gray-400">
              <p>
                Dr. Laxman Yadav is a Clinical Psychologist, mental health
                advocate, and Founder of The Banaras Beats. With over 10
                years of experience and having supported the mental
                well-being of{" "}
                <span className="text-amber-400 font-medium">
                  50,000+ individuals
                </span>
                , he is dedicated to making emotional wellness more
                accessible through science, culture, and community.
              </p>

              <p>
                He holds a Ph.D. in Clinical Psychology from IMS, Banaras
                Hindu University and currently serves as a Counselling
                Psychologist at IIT (BHU), Varanasi. He is also the Founder of{" "}
                <span className="text-gray-200 font-medium">
                  Changing Minds Mental Health Care{" "}
                </span>
                and{" "}
                <span className="text-gray-200 font-medium">
                  THE BENARAS BEATS
                </span>
                .
              </p>

              <p>
                Driven by the belief that music is a powerful tool for
                healing and human connection, Dr. Yadav founded The Banaras
                Beats to bring people together through meaningful musical
                experiences. The initiative celebrates diverse musical
                traditions while fostering emotional well-being, reducing
                stress, and strengthening community bonds.
              </p>
            </div>

            {/* Quote Block */}
            <div className="relative pl-6 mt-8 border-l-2 border-amber-500/40">
              <Quote className="absolute -top-3 -left-2 w-8 h-8 text-gray-800/40 transform -scale-x-100 pointer-events-none" />
              <p className="relative z-10 text-lg leading-relaxed text-gray-300 font-light italic">
                "Music has the power to heal, unite, and transform lives."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}