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