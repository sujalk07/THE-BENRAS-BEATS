"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Image as ImageIcon,
  Sparkles,
  ChevronLeft,
  IndianRupee,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    venue: "",
    image_url: "",
    capacity: "100",
    ticket_price: "0",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      alert("🎉 " + data.message);

      router.push("/events");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0A0908] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-180px] top-[15%] h-[500px] w-[500px] rounded-full bg-[#B8923F]/[0.035] blur-[150px]" />

        <div className="absolute bottom-[-180px] right-[-120px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.025] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 py-8 md:py-12">

        {/* Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#C9A24B]"
          >
            <ChevronLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back to Events
          </Link>

          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-700">
            TBB / Admin
          </span>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#C9A24B]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#B8923F]">
              Event Management
            </span>
          </div>

          <h1 className="font-serif text-4xl tracking-wide text-[#F2EBDD] md:text-5xl">
            Create an Experience
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600">
            Publish a new Benaras Beats experience with the details your
            community needs to know before they arrive.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11100E]">

            {/* Section: Identity */}
            <section className="p-6 md:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#B8923F]/20 bg-[#B8923F]/[0.05]">
                  <Sparkles
                    size={14}
                    className="text-[#C9A24B]"
                  />
                </div>

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-600">
                    01
                  </p>

                  <h2 className="mt-0.5 font-serif text-lg text-[#EDE6D9]">
                    Experience Identity
                  </h2>
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500"
                >
                  Event Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. An Evening by the Ganges"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0A0908] px-4 py-3.5 font-serif text-lg text-[#EDE6D9] outline-none transition placeholder:text-gray-700 focus:border-[#B8923F]/50"
                />
              </div>

              {/* Description */}
              <div className="mt-6">
                <label
                  htmlFor="description"
                  className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500"
                >
                  About the Experience
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell people what this evening will feel like..."
                  className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0A0908] px-4 py-3.5 text-sm leading-6 text-[#EDE6D9] outline-none transition placeholder:text-gray-700 focus:border-[#B8923F]/50"
                />
              </div>
            </section>

            <div className="h-px bg-white/[0.06]" />

            {/* Section: Logistics */}
            <section className="p-6 md:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#B8923F]/20 bg-[#B8923F]/[0.05]">
                  <Calendar
                    size={14}
                    className="text-[#C9A24B]"
                  />
                </div>

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-600">
                    02
                  </p>

                  <h2 className="mt-0.5 font-serif text-lg text-[#EDE6D9]">
                    Date & Logistics
                  </h2>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Date */}
                <div>
                  <label
                    htmlFor="event_date"
                    className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500"
                  >
                    Date & Time
                  </label>

                  <div className="relative">
                    <Calendar
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                    />

                    <input
                      id="event_date"
                      type="datetime-local"
                      name="event_date"
                      required
                      value={formData.event_date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/[0.08] bg-[#0A0908] py-3.5 pl-11 pr-4 text-sm text-[#EDE6D9] outline-none transition [color-scheme:dark] focus:border-[#B8923F]/50"
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label
                    htmlFor="capacity"
                    className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500"
                  >
                    Available Capacity
                  </label>

                  <div className="relative">
                    <Users
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                    />

                    <input
                      id="capacity"
                      type="number"
                      name="capacity"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/[0.08] bg-[#0A0908] py-3.5 pl-11 pr-4 text-sm text-[#EDE6D9] outline-none transition focus:border-[#B8923F]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="mt-5">
                <label
                  htmlFor="venue"
                  className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500"
                >
                  Venue
                </label>

                <div className="relative">
                  <MapPin
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    id="venue"
                    type="text"
                    name="venue"
                    required
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="e.g. Assi Ghat, Varanasi"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#0A0908] py-3.5 pl-11 pr-4 text-sm text-[#EDE6D9] outline-none transition placeholder:text-gray-700 focus:border-[#B8923F]/50"
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-white/[0.06]" />

            {/* Section: Ticket */}
            <section className="p-6 md:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#B8923F]/20 bg-[#B8923F]/[0.05]">
                  <IndianRupee
                    size={14}
                    className="text-[#C9A24B]"
                  />
                </div>

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-600">
                    03
                  </p>

                  <h2 className="mt-0.5 font-serif text-lg text-[#EDE6D9]">
                    Ticketing
                  </h2>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Price */}
                <div>
                  <label
                    htmlFor="ticket_price"
                    className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500"
                  >
                    Ticket Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-lg text-[#B8923F]">
                      ₹
                    </span>

                    <input
                      id="ticket_price"
                      type="number"
                      name="ticket_price"
                      required
                      min="0"
                      value={formData.ticket_price}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/[0.08] bg-[#0A0908] py-3.5 pl-10 pr-4 text-sm text-[#EDE6D9] outline-none transition focus:border-[#B8923F]/50"
                    />
                  </div>

                  <p className="mt-2 text-[10px] leading-4 text-gray-700">
                    Enter ₹0 if non-members can attend this event for free.
                  </p>
                </div>

                {/* Ticket preview */}
                <div className="rounded-xl border border-[#B8923F]/10 bg-[#B8923F]/[0.025] p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-600">
                    Ticket Preview
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-gray-600">
                        General Admission
                      </p>

                      <p className="mt-1 font-serif text-2xl text-[#EDE6D9]">
                        {formData.ticket_price === "0"
                          ? "FREE"
                          : `₹${formData.ticket_price}`}
                      </p>
                    </div>

                    <span className="text-[9px] uppercase tracking-[0.15em] text-[#B8923F]">
                      TBB
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-white/[0.06]" />

            {/* Section: Visual */}
            <section className="p-6 md:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#B8923F]/20 bg-[#B8923F]/[0.05]">
                  <ImageIcon
                    size={14}
                    className="text-[#C9A24B]"
                  />
                </div>

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-600">
                    04
                  </p>

                  <h2 className="mt-0.5 font-serif text-lg text-[#EDE6D9]">
                    Visual Identity
                  </h2>
                </div>
              </div>

              <label
                htmlFor="image_url"
                className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500"
              >
                Cover Image URL
              </label>

              <div className="relative">
                <ImageIcon
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  id="image_url"
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0A0908] py-3.5 pl-11 pr-4 text-sm text-[#EDE6D9] outline-none transition placeholder:text-gray-700 focus:border-[#B8923F]/50"
                />
              </div>

              <p className="mt-2 text-[10px] text-gray-700">
                Use a high-quality landscape image. This will become the main
                visual on the event page.
              </p>

              {/* Image preview */}
              {formData.image_url && (
                <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.07]">
                  <div className="relative h-48">
                    <img
                      src={formData.image_url}
                      alt="Event preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#C9A24B]">
                        Preview
                      </p>

                      <p className="mt-1 font-serif text-xl text-white">
                        {formData.title || "Your Event"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Publish */}
            <div className="border-t border-white/[0.07] bg-[#0D0C0A] p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs text-gray-500">
                    Ready to publish?
                  </p>

                  <p className="mt-1 text-[10px] text-gray-700">
                    The event will become visible in the events catalogue.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A24B] px-7 py-3.5 text-xs font-semibold text-[#0A0908] transition hover:bg-[#D9B662] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    "Publishing..."
                  ) : (
                    <>
                      Publish Experience

                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between py-6 text-[9px] uppercase tracking-[0.15em] text-gray-700">
            <span>Music · Culture · Community</span>
            <span>Benaras Beats</span>
          </div>
        </form>
      </div>
    </main>
  );
}