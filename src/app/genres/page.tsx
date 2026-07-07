"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Pause, Music, Loader2, Sparkles } from "lucide-react";

interface Genre {
  id: string;
  genre_name: string;
  description: string | null;
  image_url: string | null;
  audio_url: string | null;
}

export default function GenresExplorePage() {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch("/api/genres/list");
        const data = await res.json();
        if (res.ok) setGenres(data.genres ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGenres();

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handleTogglePlay = (genre: Genre) => {
    if (!genre.audio_url) return;

    if (playingId === genre.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(genre.audio_url);
    audio.play();
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(genre.id);
  };

  return (
    <main className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">
            Every Sound, One Stage
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Explore <span className="text-amber-400">Genres</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm text-gray-400 sm:text-base">
            From ancient classical ragas to modern fusion beats - listen to a
            sample of every musical tradition we celebrate at The Benaras
            Beats.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-16">
            <Loader2 size={16} className="animate-spin" /> Loading genres...
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {genres.map((genre) => {
              const isPlaying = playingId === genre.id;
              return (
                <div
                  key={genre.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1f232d]/60"
                >
                  <div className="relative h-48 w-full">
                    {genre.image_url ? (
                      <img
                        src={genre.image_url}
                        alt={genre.genre_name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-950/30 to-gray-950">
                        <Music size={32} className="text-amber-500/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {genre.audio_url && (
                      <button
                        onClick={() => handleTogglePlay(genre)}
                        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                          isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-xl">
                          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-white">{genre.genre_name}</h3>
                    {genre.description && (
                      <p className="mt-1 text-xs text-gray-400 line-clamp-2">{genre.description}</p>
                    )}
                    {!genre.audio_url && (
                      <p className="mt-2 text-[10px] uppercase tracking-wide text-gray-600">
                        Sample coming soon
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* "Many more genres" card — always the last item in the grid */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-500/25 bg-amber-500/[0.03] p-6 text-center min-h-[280px]">
              <Sparkles size={26} className="text-amber-400 mb-3" />
              <p className="text-sm font-semibold text-white">
                ...and many more
              </p>
              <p className="mt-1 text-xs text-gray-400">
                New genres and sounds added regularly.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}