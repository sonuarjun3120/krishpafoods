
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId, paymentStatus, firebaseWebhookUrl } = await req.json();
    
    if (!orderId || !paymentStatus || !firebaseWebhookUrl) {
      throw new Error("Missing required webhook information: orderId, paymentStatus, or firebaseWebhookUrl");
    }

    // Initialize Supabase client to verify the order and get necessary details
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verify the order exists and get its details
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Error fetching order: ${orderError?.message || "Order not found"}`);
    }

    // Send webhook to Firebase
    const response = await fetch(firebaseWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderId: order.id,
        paymentStatus,
        orderDetails: {
          total_amount: order.total_amount,
          user_name: order.user_name,
          user_phone: order.user_phone,
          user_email: order.user_email,
          shipping_address: order.shipping_address,
          items: order.items
        },
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send webhook to Firebase: ${response.status} ${errorText}`);
    }

    const webhookResponse = await response.json();

    // Update order status in Supabase to reflect successful payment if needed
    if (paymentStatus === "success") {
      const { error: updateError } = await supabaseClient
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);

      if (updateError) {
        console.error("Failed to update order status:", updateError);
        // Continue execution since webhook was sent successfully
      }
    }

    console.log(`Webhook sent successfully to Firebase for order ${orderId}`);
    console.log(`Payment status updated to ${paymentStatus}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook sent to Firebase successfully",
        webhookResponse,
        order: { id: order.id, status: paymentStatus }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending webhook to Firebase:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
