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

  return {
    success: true,
  };
}