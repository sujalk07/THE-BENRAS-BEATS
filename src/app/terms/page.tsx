"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold sm:text-4xl">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: July 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-300 sm:text-base">
          <p>
            Welcome to The Benaras Beats ("we," "us," "our"). By accessing or
            using our website, purchasing event tickets, or subscribing to a
            membership, you agree to be bound by these Terms & Conditions.
            Please read them carefully.
          </p>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. About Us</h2>
            <p>
              The Benaras Beats is a community platform organizing live
              musical events, performances, and membership-based experiences
              rooted in the culture of Varanasi.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Account Registration</h2>
            <p>
              To purchase tickets, apply as a performer, or become a member,
              you must create an account with accurate and complete
              information. You are responsible for maintaining the
              confidentiality of your login credentials and for all activity
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Tickets & Event Access</h2>
            <p>
              Tickets purchased through our platform are valid only for the
              specific event and date stated, and are non-transferable unless
              explicitly permitted. Entry to an event may be denied without a
              valid ticket or QR code presented at the venue. We reserve the
              right to modify event details, including venue, date, time, or
              lineup, and will make reasonable efforts to notify ticket
              holders of significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Membership</h2>
            <p>
              Membership plans grant access to specific benefits as described
              at the time of purchase, valid for the stated duration.
              Membership is non-transferable and tied to the registered
              account. We reserve the right to modify membership benefits,
              pricing, or availability for future subscribers at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Payments</h2>
            <p>
              All payments made on our platform are processed securely
              through Razorpay, a third-party payment gateway. We do not
              store your card, UPI, or bank account details on our servers.
              By making a purchase, you also agree to Razorpay's applicable
              terms of use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Refunds & Cancellations</h2>
            <p>
              Please refer to our{" "}
              <a href="/refund-policy" className="text-amber-400 underline hover:text-amber-300">
                Refund & Cancellation Policy
              </a>{" "}
              for full details on when refunds are applicable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">7. Performer Applications</h2>
            <p>
              Submitting a performer application does not guarantee selection
              or a performance slot. We review applications at our
              discretion and will contact selected applicants using the
              contact details provided.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">8. User Conduct</h2>
            <p>
              You agree not to misuse the platform, including but not
              limited to attempting unauthorized access to accounts or
              systems, submitting false information, or engaging in conduct
              that disrupts events or harms other attendees, performers, or
              staff.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">9. Intellectual Property</h2>
            <p>
              All content on this website, including our name, logo, and
              design, is the property of The Benaras Beats and may not be
              reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">10. Limitation of Liability</h2>
            <p>
              We strive to ensure accurate event information and a smooth
              platform experience, but we are not liable for indirect,
              incidental, or consequential damages arising from your use of
              the platform or attendance at our events.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">11. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of
              the platform after changes are posted constitutes acceptance
              of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">12. Contact Us</h2>
            <p>
              For any questions about these Terms, reach out to us at{" "}
              <a
                href="mailto:thebenarasbeats@gmail.com"
                className="text-amber-400 underline hover:text-amber-300"
              >
                thebenarasbeats@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}