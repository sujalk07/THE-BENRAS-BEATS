import React from 'react';
import { Quote, Sparkles } from 'lucide-react';

export default function Founder() {
  return (
    <section className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      {/* Background ambient lighting overlay */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[400px] h-[400px] bg-purple-950/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-amber-950/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-12 items-center md:grid-cols-12">
          
          {/* Left Column: Stylized Image / Avatar Placeholder Container */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative group">
              {/* Outer glowing frame border */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-amber-500/20 to-purple-600/20 blur opacity-75 group-hover:opacity-100 transition duration-300" />
              
              {/* The Image Container */}
              <div className="relative w-64 h-80 md:w-full md:h-96 rounded-2xl bg-gradient-to-b from-[#12131a] to-[#0b0c10] border border-gray-800/80 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                {/* Profile placeholder layout - Replace this div block with an actual <img src="..." alt="Founder" /> */}
                <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 shadow-inner">
                  <span className="text-2xl text-amber-500/70">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-200 tracking-wide">Founder Name</h3>
                <p className="text-xs text-amber-500/80 tracking-wider uppercase mt-1">Visionary & Producer</p>
                
                {/* Aesthetic decorative pattern background */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Column: Founder's Vision Statement */}
          <div className="md:col-span-8 flex flex-col items-start text-left">
            
            {/* Context Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              The Vision
            </div>

            <h2 className="mb-6 text-4xl font-serif tracking-wide text-gray-100">
              About The Founder
            </h2>

            {/* Quote Block Container */}
            <div className="relative pl-6 border-l-2 border-amber-500/40">
              {/* Decorative floating quotation icon */}
              <Quote className="absolute -top-3 -left-2 w-8 h-8 text-gray-800/40 transform -scale-x-100 pointer-events-none" />
              
              <p className="relative z-10 text-lg leading-relaxed text-gray-300 font-light italic">
                "The Benaras Beats was founded with a vision to create meaningful musical experiences, nurture emerging talent, and build a vibrant community where culture, creativity, and connection thrive together."
              </p>
            </div>

            {/* Optional Small Signature/Subtext Detail */}
            <p className="mt-6 text-sm text-gray-500 tracking-wide font-sans">
              Cultivating the sonic ecosystem of Banaras for a global digital stage.
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}