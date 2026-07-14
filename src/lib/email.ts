// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface TicketEmailParams {
  to: string;
  holderName: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  isMember: boolean;
  amountPaid: number;
  ticketId: string;
}

export async function sendTicketConfirmationEmail({
  to,
  holderName,
  eventTitle,
  eventDate,
  venue,
  isMember,
  amountPaid,
  ticketId,
}: TicketEmailParams) {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
    dateStyle: "long",
  });

  const formattedTime = new Date(eventDate).toLocaleTimeString("en-IN", {
    timeStyle: "short",
  });

  try {
    const { error } = await resend.emails.send({
      from: "The Benaras Beats <tickets@thebenarasbeats.com>",
      to,
      subject: `🎟️ Your ticket for ${eventTitle} is confirmed!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0B0C10; color: #ffffff; padding: 32px; border-radius: 16px;">
          <div style="background: #f59e0b; padding: 16px 24px; border-radius: 12px 12px 0 0; margin: -32px -32px 24px -32px;">
            <h2 style="margin: 0; color: #000000; font-size: 18px;">THE BENARAS BEATS</h2>
          </div>

          <h1 style="font-size: 22px; margin-bottom: 8px;">You're in, ${holderName}! 🎉</h1>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px;">
            Your ticket for <strong style="color: #f59e0b;">${eventTitle}</strong> has been confirmed.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase;">Date</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase;">Time</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase;">Venue</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${venue}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase;">Member</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${isMember ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase;">Paid</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${amountPaid > 0 ? `₹${amountPaid}` : "₹0"}</td>
            </tr>
          </table>

          <div style="border-top: 1px dashed #374151; padding-top: 16px; text-align: center;">
            <p style="color: #6b7280; font-size: 11px; margin: 0;">Ticket ID</p>
            <p style="color: #f59e0b; font-size: 14px; font-weight: bold; letter-spacing: 1px; margin: 4px 0 0 0;">
              ${ticketId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
    }
  } catch (err) {
    console.error("Failed to send ticket email:", err);
  }
}

export async function sendMembershipOpenAnnouncement(to: string) {
  try {
    const { error } = await resend.emails.send({
      from: "The Benaras Beats <tickets@thebenarasbeats.com>",
      to,
      subject: "🎉 Memberships are now open at The Benaras Beats!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0B0C10; color: #ffffff; padding: 32px; border-radius: 16px;">
          <div style="background: #f59e0b; padding: 16px 24px; border-radius: 12px 12px 0 0; margin: -32px -32px 24px -32px;">
            <h2 style="margin: 0; color: #000000; font-size: 18px;">THE BENARAS BEATS</h2>
          </div>

          <h1 style="font-size: 22px; margin-bottom: 8px;">Memberships are here! 🎉</h1>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px; line-height: 1.6;">
            You asked us to let you know — memberships are now open at The Benaras Beats.
            Get priority access to events, join our exclusive community, and unlock member-only experiences.
          </p>

          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/membership" style="display: block; text-align: center; background: #f59e0b; color: #000000; font-weight: bold; padding: 14px; border-radius: 10px; text-decoration: none; font-size: 14px;">
            View Membership Plans
          </a>

          <p style="color: #6b7280; font-size: 11px; margin-top: 24px; text-align: center;">
            You're receiving this because you asked to be notified.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend membership announcement error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("Failed to send membership announcement:", err);
    return { success: false, error: err.message };
  }
}
export async function sendMembershipCertificateEmail(
  to: string,
  memberName: string,
  certificateBuffer: Buffer
) {
  try {
    const { error } = await resend.emails.send({
      from: "The Benaras Beats <tickets@thebenarasbeats.com>",
      to,
      subject: "🎓 Your Official Membership Certificate — The Benaras Beats",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0B0C10; color: #ffffff; padding: 32px; border-radius: 16px;">
          <div style="background: #f59e0b; padding: 16px 24px; border-radius: 12px 12px 0 0; margin: -32px -32px 24px -32px;">
            <h2 style="margin: 0; color: #000000; font-size: 18px;">THE BENARAS BEATS</h2>
          </div>

          <h1 style="font-size: 22px; margin-bottom: 8px;">Congratulations, ${memberName}! 🎉</h1>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px; line-height: 1.6;">
            You are now an official member of The Benaras Beats. Your
            personalized membership certificate is attached to this email —
            keep it as a token of your journey with us.
          </p>

          <p style="color: #6b7280; font-size: 11px; margin-top: 24px; text-align: center;">
            Music for Mind & Soul
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${memberName.replace(/\s+/g, "_")}_Membership_Certificate.pdf`,
          content: certificateBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend certificate email error:", error);
    }
  } catch (err) {
    console.error("Failed to send certificate email:", err);
  }
}

// ============================================================
// ADD THESE TWO FUNCTIONS TO YOUR EXISTING lib/email.ts
// (uses the same `resend` instance already defined at the top of that file)
// ============================================================

export async function sendMembershipVerifiedEmail(
  to: string,
  memberName: string,
  startDate: string,
  expiryDate: string
) {
  const formattedStart = new Date(startDate).toLocaleDateString("en-IN", { dateStyle: "long" });
  const formattedExpiry = new Date(expiryDate).toLocaleDateString("en-IN", { dateStyle: "long" });

  try {
    const { error } = await resend.emails.send({
      from: "The Benaras Beats <tickets@thebenarasbeats.com>",
      to,
      subject: "✅ Your membership is confirmed — The Benaras Beats",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0B0C10; color: #ffffff; padding: 32px; border-radius: 16px;">
          <div style="background: #f59e0b; padding: 16px 24px; border-radius: 12px 12px 0 0; margin: -32px -32px 24px -32px;">
            <h2 style="margin: 0; color: #000000; font-size: 18px;">THE BENARAS BEATS</h2>
          </div>

          <h1 style="font-size: 22px; margin-bottom: 8px;">You're a member now, ${memberName}! 🎉</h1>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px; line-height: 1.6;">
            We've verified your payment and activated your membership. Welcome to the community!
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase;">Valid From</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formattedStart}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase;">Valid Until</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formattedExpiry}</td>
            </tr>
          </table>

          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: block; text-align: center; background: #f59e0b; color: #000000; font-weight: bold; padding: 14px; border-radius: 10px; text-decoration: none; font-size: 14px;">
            View Your Dashboard
          </a>

          <p style="color: #6b7280; font-size: 11px; margin-top: 24px; text-align: center;">
            Music for Mind & Soul
          </p>
        </div>
      `,
    });

    if (error) console.error("Resend membership-verified email error:", error);
  } catch (err) {
    console.error("Failed to send membership-verified email:", err);
  }
}

export async function sendMembershipRejectedEmail(
  to: string,
  memberName: string,
  reason?: string
) {
  try {
    const { error } = await resend.emails.send({
      from: "The Benaras Beats <tickets@thebenarasbeats.com>",
      to,
      subject: "Regarding your membership request — The Benaras Beats",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0B0C10; color: #ffffff; padding: 32px; border-radius: 16px;">
          <div style="background: #f59e0b; padding: 16px 24px; border-radius: 12px 12px 0 0; margin: -32px -32px 24px -32px;">
            <h2 style="margin: 0; color: #000000; font-size: 18px;">THE BENARAS BEATS</h2>
          </div>

          <h1 style="font-size: 20px; margin-bottom: 8px;">Hi ${memberName},</h1>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 16px; line-height: 1.6;">
            We weren't able to verify your recent membership payment submission.
            ${reason ? `Reason: <span style="color:#f59e0b;">${reason}</span>` : ""}
          </p>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px; line-height: 1.6;">
            Please double-check your payment and resubmit the form with a clear
            screenshot, or reach out to us directly if you believe this is a mistake.
          </p>

          <a href="mailto:tickets@thebenarasbeats.com" style="display: block; text-align: center; background: #f59e0b; color: #000000; font-weight: bold; padding: 14px; border-radius: 10px; text-decoration: none; font-size: 14px;">
            Contact Support
          </a>
        </div>
      `,
    });

    if (error) console.error("Resend membership-rejected email error:", error);
  } catch (err) {
    console.error("Failed to send membership-rejected email:", err);
  }
}

export async function sendEventRegistrationRejectedEmail(
  to: string,
  holderName: string,
  note?: string | null
) {
  try {
    const { error } = await resend.emails.send({
      from: "The Benaras Beats <tickets@thebenarasbeats.com>",
      to,
      subject: "Update on your event registration request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0B0C10; color: #ffffff; padding: 32px; border-radius: 16px;">
          <div style="background: #f59e0b; padding: 16px 24px; border-radius: 12px 12px 0 0; margin: -32px -32px 24px -32px;">
            <h2 style="margin: 0; color: #000000; font-size: 18px;">THE BENARAS BEATS</h2>
          </div>

          <h1 style="font-size: 20px; margin-bottom: 8px;">Hi ${holderName},</h1>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 16px; line-height: 1.6;">
            We were unable to verify your recent event registration request.
            ${note ? `<br/><br/><strong style="color:#f59e0b;">Note from our team:</strong> ${note}` : ""}
          </p>
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
            If you believe this was a mistake, or if you'd like to resubmit
            with a clearer payment screenshot, please reach out to us at
            thebenarasbeats@gmail.com.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend event rejection email error:", error);
    }
  } catch (err) {
    console.error("Failed to send event rejection email:", err);
  }
}