"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
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

        <h1 className="text-3xl font-bold sm:text-4xl">Refund & Cancellation Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: July 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-300 sm:text-base">
          <p>
            This policy explains when refunds are applicable for tickets and
            memberships purchased through The Benaras Beats.
          </p>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Event Tickets</h2>
            <p>
              All ticket purchases are <span className="text-white font-medium">final and non-refundable</span>,
              except in the following case:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>
                <span className="text-white font-medium">Event Cancellation by Organizers</span> — If we
                cancel an event, all ticket holders for that event will
                receive a full refund to their original payment method.
                Refunds in this case will be processed automatically within
                7–10 business days.
              </li>
            </ul>
            <p className="mt-2">
              We do not offer refunds for personal reasons such as inability
              to attend, change of plans, or if you simply change your mind
              after purchase. We also do not offer refunds due to venue
              changes, date/time changes, or lineup changes, unless the event
              is fully cancelled as described above.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Memberships</h2>
            <p>
              Membership fees are <span className="text-white font-medium">non-refundable</span> once
              payment is completed and the membership is activated, regardless
              of usage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Duplicate or Failed Payments</h2>
            <p>
              If you are charged more than once for the same ticket or
              membership due to a technical error, or if a payment was
              deducted from your account but the ticket/membership was not
              activated, please contact us with your payment details and we
              will investigate and issue a refund for the erroneous charge.
            </p>
          </section>

          <section>
  <h2 className="text-lg font-bold text-white mb-2">4. Refund Processing</h2>
  <p>
    Approved refunds are processed back to the original payment
    method used at checkout — whether via our payment gateway or a
    manual bank/UPI transfer. Depending on your bank or payment
    provider, it may take 5–10 business days for the refund to
    reflect in your account after we initiate it.
  </p>
</section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. How to Request a Refund</h2>
            <p>
              If you believe you're eligible for a refund under this policy,
              email us at{" "}
              <a
                href="mailto:thebenarasbeats@gmail.com"
                className="text-amber-400 underline hover:text-amber-300"
              >
                thebenarasbeats@gmail.com
              </a>{" "}
              with your registered email address, the event or membership
              plan purchased, and the payment/transaction ID. We aim to
              respond to all refund requests within 5 business days.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}