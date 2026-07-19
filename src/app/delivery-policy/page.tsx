"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function DeliveryPolicyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0B0C10] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <h1 className="text-3xl font-bold sm:text-4xl">Delivery Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Effective Date: July 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-300 sm:text-base">
          <p>
            At The Benaras Beats, we offer digital memberships and event registrations. As our services do not involve the shipment of physical goods, all purchases are delivered electronically.
          </p>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">Membership Delivery</h2>
            <ul className="list-inside list-disc space-y-1.5">
              <li>Once your payment is successfully processed, your membership is activated and linked to your registered account.</li>
              <li>A confirmation email and/or dashboard notification will be sent to your registered email address.</li>
              <li>Membership benefits become available immediately or within 24 hours of successful payment, depending on the verification process.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">Event Registrations &amp; Tickets</h2>
            <ul className="list-inside list-disc space-y-1.5">
              <li>Event registrations and digital tickets are delivered electronically through your account and/or via email after successful payment.</li>
              <li>Members claiming complimentary tickets will receive confirmation once their registration is verified.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">Delivery Timeline</h2>
            <ul className="list-inside list-disc space-y-1.5">
              <li>Most digital services are delivered instantly after successful payment.</li>
              <li>In certain cases requiring manual verification, delivery may take up to 24 hours.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">Non-Delivery</h2>
            <p>
              If you do not receive your membership confirmation or event registration within the stated delivery time, please contact us using the details below. We will verify your payment and ensure your purchase is activated promptly.
            </p>

            <p className="mt-3">
              <span className="text-gray-500">Email:</span>{" "}
              <a
                href="mailto:thebenarasbeats@gmail.com"
                className="text-amber-400 underline hover:text-amber-300"
              >
                thebenarasbeats@gmail.com
              </a>
            </p>

            <p className="mt-1">
              <span className="text-gray-500">Website:</span>{" "}
              <a
                href="https://thebenarasbeats.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline hover:text-amber-300"
              >
                thebenarasbeats.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">Parent Organization</h2>
            <p>
              The Benaras Beats is a community music and wellness initiative by{" "}
              <span className="font-medium text-white">
                Changing Minds Counseling &amp; Psychotherapy Centre
              </span>
              , Varanasi. Payments are securely processed by Changing Minds Counseling &amp; Psychotherapy Centre on behalf of The Benaras Beats.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}