"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: July 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-300 sm:text-base">
          <p>
            The Benaras Beats ("we," "us," "our") respects your privacy. This
            Privacy Policy explains what information we collect, how we use
            it, and the choices you have.
          </p>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
            <p>We collect the following information when you use our platform:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Name and email address (during signup)</li>
              <li>Contact number (when applying as a performer)</li>
              <li>Event tickets purchased and membership status</li>
              <li>Payment confirmation details (transaction IDs) — we do not store your card, UPI, or bank details; these are processed directly by Razorpay</li>
              <li>Basic usage data such as pages visited, for improving the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Create and manage your account</li>
              <li>Process ticket purchases and membership subscriptions</li>
              <li>Send confirmation emails, tickets, and membership certificates</li>
              <li>Review and respond to performer applications</li>
              <li>Communicate important updates about events you're registered for</li>
              <li>Improve our platform and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Third-Party Services</h2>
            <p>We use trusted third-party services to operate our platform:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li><span className="text-white font-medium">Supabase</span> — for account authentication and data storage</li>
              <li><span className="text-white font-medium">Razorpay</span> — for secure payment processing</li>
              <li><span className="text-white font-medium">Resend</span> — for sending transactional emails (confirmations, tickets, certificates)</li>
              <li><span className="text-white font-medium">Google</span> — for optional "Sign in with Google" authentication</li>
            </ul>
            <p className="mt-2">
              These providers only receive the information necessary to
              perform their specific function and are bound by their own
              privacy and security practices.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Data Security</h2>
            <p>
              We use industry-standard security practices to protect your
              information, including encrypted connections and secure
              authentication. However, no method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Data Sharing</h2>
            <p>
              We do not sell your personal information to third parties. We
              only share information with the service providers listed above
              as necessary to operate the platform, or where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Your Rights</h2>
            <p>
              You can update your account information at any time, and you
              may request deletion of your account and associated data by
              contacting us. Note that certain records (e.g. transaction
              history) may be retained as required for legal or accounting
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">7. Cookies</h2>
            <p>
              We use minimal cookies necessary for authentication and session
              management. We do not use third-party advertising or tracking
              cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">8. Children's Privacy</h2>
            <p>
              Our platform is not intended for individuals under the age of
              18. We do not knowingly collect personal information from
              minors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Continued use
              of the platform after changes are posted constitutes acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">10. Contact Us</h2>
            <p>
              For any privacy-related questions or requests, contact us at{" "}
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