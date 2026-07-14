import { supabaseAdmin } from "@/lib/supabase-admin";

interface RegisterParams {
  eventId: string;
  userId: string;
  orderId: string | null;
  paymentId: string | null;
  amountPaid: number;
  claimedByMember: boolean;
}

export async function registerUserForEvent({
  eventId,
  userId,
  orderId,
  paymentId,
  amountPaid,
  claimedByMember,
}: RegisterParams) {
  const { error } = await supabaseAdmin.rpc("register_user_for_event", {
    p_event_id: eventId,
    p_user_id: userId,
    p_order_id: orderId,
    p_payment_id: paymentId,
    p_amount_paid: amountPaid,
    p_claimed_by_member: claimedByMember,
  });

  if (error) {
    throw new Error(error.message);
  }

  let ticketId: string | null = null;

  if (paymentId) {
    const { data: ticket, error: ticketFetchError } = await supabaseAdmin
      .from("tickets")
      .select("id")
      .eq("payment_id", paymentId)
      .maybeSingle();

    if (ticketFetchError) {
      console.error("Could not fetch back created ticket id:", ticketFetchError);
    } else {
      ticketId = ticket?.id ?? null;
    }
  }

  if (!ticketId) {
    const { data: fallbackTicket, error: fallbackError } = await supabaseAdmin
      .from("tickets")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fallbackError) {
      console.error("Could not fetch fallback ticket id:", fallbackError);
    } else {
      ticketId = fallbackTicket?.id ?? null;
    }
  }

  return {
    success: true,
    ticketId,
  };
}