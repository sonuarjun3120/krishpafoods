
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates the payment status of an order and sends a webhook to Firebase
 * @param orderId The ID of the order to update
 * @param status The new payment status ("success" or "failed")
 * @param firebaseWebhookUrl The URL of your Firebase webhook endpoint
 */
export const updatePaymentStatus = async (
  orderId: string,
  status: "success" | "failed",
  firebaseWebhookUrl: string
) => {
  try {
    // Call the Supabase edge function to send the webhook and update status
    const { data, error } = await supabase.functions.invoke("send-firebase-webhook", {
      body: {
        orderId,
        paymentStatus: status,
        firebaseWebhookUrl,
      },
    });

    if (error) {
      console.error("Error updating payment status:", error);
      throw new Error(`Failed to update payment status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    throw error;
  }
};

/**
 * Fetches an order by ID
 * @param orderId The ID of the order to fetch
 */
export const getOrderById = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in getOrderById:", error);
    throw error;
  }
};
