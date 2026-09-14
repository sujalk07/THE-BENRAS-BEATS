"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

interface Glimpse {
  id: string;
  media_type: "image" | "video";
  media_url: string;
  caption: string | null;
}

export default function EventGlimpses() {
  const [glimpses, setGlimpses] = useState<Glimpse[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  useEffect(() => {
    fetch("/api/event-glimpses/list")
      .then((res) => res.json())
      .then((data) => setGlimpses(data.glimpses ?? []))
      .catch((err) => console.error(err));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.clientX - startX.current;
    scrollRef.current.scrollLeft = scrollLeftStart.current - dx;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (glimpses.length === 0) return null;

  return (
    <section className="relative px-6 py-20 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs tracking-wider uppercase mb-3 font-medium">
              <Camera className="w-3.5 h-3.5" />
              Memories
            </div>
            <h2 className="text-3xl md:text-4xl font-serif tracking-wide text-gray-100">
              Glimpses of Our Events
            </h2>
          </div>

          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollByAmount(-320)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 hover:border-amber-500/40 hover:text-amber-400 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollByAmount(320)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 hover:border-amber-500/40 hover:text-amber-400 transition"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-4 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {glimpses.map((g) => (
            <div
              key={g.id}
              className="relative shrink-0 w-72 sm:w-80 h-96 rounded-2xl overflow-hidden border border-white/10 bg-[#1f232d]/60"
            >
              {g.media_type === "image" ? (
                <img
                  src={g.media_url}
                  alt={g.caption ?? "Event glimpse"}
                  draggable={false}
                  className="h-full w-full object-cover pointer-events-none"
                />
              ) : (
                <video
                  src={g.media_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover pointer-events-none"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {g.caption && (
                <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white">
                  {g.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}