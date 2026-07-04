"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, CheckCircle, Users, ChevronLeft, Star, Music } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  profile_image_url?: string;
  role?: string; // e.g., Headliner, Opening Act
}

interface EventDetails {
  id: string;
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image_url: string;
  capacity: number;
  ticket_price: number;
  slotsLeft: number;
  isSoldOut: boolean;
  isUserRegistered: boolean;
  isMember: boolean;
  registration_open: boolean;
  artists?: Artist[];
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEventDetails = async () => {
    try {
      // 🎯 Hit your list API, passing the userId if they are authenticated
      const url = user 
        ? `/api/events/list?userId=${user.id}` 
        : `/api/events/list`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server returned status ${res.status}: ${errText}`);
      }

      const data = await res.json();
      console.log("Targeted API data matching check:", data);

      // Extract the matching item from the array returned by your API
      if (data && Array.isArray(data.events)) {
        const matchingEvent = data.events.find((e: any) => e.id === id);
        
        if (matchingEvent) {
          setEvent(matchingEvent);
        } else {
          throw new Error("This specific event ID does not exist in the upcoming catalog.");
        }
      } else {
        throw new Error("API response did not contain an 'events' array block.");
      }

    } catch (err: any) {
      console.error("❌ Parsing error encountered:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id, user]);

  const handleRegister = async () => {
  if (!user) {
    router.push(`/signup?redirectTo=/events/${id}`);
    return;
  }

  // ===========================
  // MEMBER → FREE TICKET
  // ===========================
  if (event?.isMember) {
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: id,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert("🎉 Ticket claimed successfully!");

      fetchEventDetails();
    } catch (err: any) {
      alert(err.message);
    }

    return;
  }

  // ===========================
  // NON MEMBER → PAYMENT
  // ===========================

  try {
    const response = await fetch("/api/events/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: id,
        userId: user.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    if (!(window as any).Razorpay) {
      alert("Payment gateway is still loading. Please wait a moment and try again.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: data.amount,

      currency: data.currency,

      name: "The Benaras Beats",

      description: data.eventTitle,

      order_id: data.orderId,

      prefill: {
        email: user.email,
      },

      theme: {
        color: "#f59e0b",
      },

      handler: async function (response: any) {
        try {
          const verify = await fetch("/api/events/verify-payment", {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              eventId: id,
            }),
          });

          const verifyData = await verify.json();

          if (!verify.ok) {
            throw new Error(verifyData.error);
          }

          alert("🎉 Ticket booked successfully!");

          fetchEventDetails();
        } catch (err: any) {
          alert(err.message);
        }
      },
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.open();
  } catch (err: any) {
    alert(err.message);
  }
};

  if (loading) return <div className="text-center text-amber-500 mt-20 animate-pulse font-medium tracking-wide">Loading showcase information...</div>;
  if (!event) return <div className="text-center text-red-400 mt-20 font-medium">Showcase timeline could not be parsed.</div>;

  const buttonDisabled =
  event.isUserRegistered || event.isSoldOut || !event.registration_open;

  return (
    <>
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="beforeInteractive"
    />
    <div className="max-w-4xl mx-auto px-4 py-12 selection:bg-amber-500 selection:text-black">
      {/* Back navigation */}
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors mb-6 text-sm font-medium">
        <ChevronLeft size={16} /> Back to showcase stream
      </Link>

      <div className="bg-[#1f232d]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
        {event.image_url ? (
          <div className="relative h-64 md:h-96 w-full border-b border-white/10">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-purple-950/20 via-gray-950 to-amber-950/20 border-b border-white/10 flex items-center justify-center">
            <Music size={40} className="text-amber-500/20" />
          </div>
        )}

        <div className="p-6 md:p-8 relative">
          <span className="text-amber-500 text-xs uppercase tracking-widest font-bold block mb-2">Benaras Beats Present</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">{event.title}</h1>

          {/* Event Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0B0C10]/60 border border-white/5 p-4 rounded-xl flex items-center gap-3">
              <Calendar className="text-amber-500 shrink-0" size={18} />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Date & Time</p>
                <p className="text-xs font-bold text-gray-200 mt-0.5">
                  {new Date(event.event_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </p>
              </div>
            </div>

            <div className="bg-[#0B0C10]/60 border border-white/5 p-4 rounded-xl flex items-center gap-3">
              <MapPin className="text-amber-500 shrink-0" size={18} />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Venue</p>
                <p className="text-xs font-bold text-gray-200 mt-0.5 line-clamp-1">{event.venue}</p>
              </div>
            </div>

            <div className="bg-[#0B0C10]/60 border border-white/5 p-4 rounded-xl flex items-center gap-3">
              <Users className="text-amber-500 shrink-0" size={18} />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Availability</p>
                <p className={`text-xs font-bold mt-0.5 ${event.isSoldOut ? "text-red-400" : "text-emerald-400"}`}>
                  {event.isSoldOut ? "Fully Booked" : `${event.slotsLeft} / ${event.capacity} Slots Left`}
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-3">About the Experience</h2>
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{event.description || "No description published for this showcase."}</p>
          </div>

          {/* New Artists & Lineup Grid */}
          <div className="border-t border-white/5 pt-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Star size={18} className="text-amber-500 fill-amber-500" /> Performing Lineup
            </h2>
            
            {event.artists && event.artists.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {event.artists.map((artist) => (
                  <div key={artist.id} className="flex gap-4 p-4 rounded-xl bg-[#0B0C10]/40 border border-white/5 items-center">
                    <img 
                      src={artist.profile_image_url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60"} 
                      alt={artist.name} 
                      className="w-14 h-14 rounded-full object-cover border border-amber-500/20 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{artist.name}</h4>
                      <p className="text-[10px] text-amber-500 uppercase tracking-wider font-medium mt-0.5">{artist.role || artist.genre}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{artist.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#0B0C10]/20 border border-dashed border-white/5 text-xs text-gray-500 flex items-center gap-2">
                <Music size={14} /> Showcase performer lineups will be announced shortly. Stay locked in!
              </div>
            )}
          </div>

          {/* Registration Trigger */}
          <div className="border-t border-white/10 pt-6 flex justify-end">
            <button
              disabled={buttonDisabled}
              onClick={handleRegister}
              className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all text-sm tracking-wide ${
                event.isUserRegistered
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
                  : event.isSoldOut || !event.registration_open
                  ? "bg-gray-900 text-gray-600 border border-white/5 cursor-not-allowed"
                  : "bg-amber-500 text-black hover:bg-amber-400 shadow-xl shadow-amber-500/10 active:scale-[0.99]"
              }`}
            >
              {event.isUserRegistered ? (
  <>
    <CheckCircle size={16} /> Pass Claimed Successfully
  </>
) : event.isSoldOut ? (
  "Sold Out"
) : !event.registration_open ? (
  "Registration Closed"
) : event.isMember ? (
  "Claim Free Ticket"
) : (
  `Buy Ticket ₹${event.ticket_price}`
)}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}