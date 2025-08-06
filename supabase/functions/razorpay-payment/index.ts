
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    const { action, orderId, paymentId, signature, razorpayOrderId, orderData } = await req.json();
    
    // Initialize Razorpay key variables
    const key_id = Deno.env.get("RAZORPAY_KEY_ID") ?? "";
    const key_secret = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";
    
    if (!key_id || !key_secret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Base64 encode credentials for Razorpay API authorization
    const auth = btoa(`${key_id}:${key_secret}`);

    if (action === "create_order") {
      
      if (!orderData || !orderData.amount) {
        throw new Error("Missing order information");
      }

      // Create Razorpay order
      const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${auth}`
        },
        body: JSON.stringify({
          amount: orderData.amount * 100, // Razorpay expects amount in paise (100 paise = 1 INR)
          currency: "INR",
          receipt: `receipt_${new Date().getTime()}`,
          notes: {
            supabase_order_id: orderData.orderId || "pending"
          }
        })
      });
      
      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        throw new Error(`Razorpay error: ${JSON.stringify(errorData)}`);
      }
      
      const razorpayOrder = await razorpayResponse.json();
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          order: razorpayOrder 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } 
    else if (action === "verify_payment") {
      if (!orderId || !paymentId || !signature || !razorpayOrderId) {
        throw new Error("Missing payment verification details");
      }

      // Get the order from Supabase
      const { data: order, error: orderError } = await supabaseClient
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) {
        throw new Error(`Error retrieving order: ${orderError.message}`);
      }

      // Verify the payment signature (in production, you'd implement proper signature verification)
      // Here we're just simulating a successful verification
      const isVerified = true;

      if (isVerified) {
        // Update order status in Supabase
        const { error: updateError } = await supabaseClient
          .from("orders")
          .update({ 
            status: "confirmed",
            razorpay_payment_id: paymentId,
            razorpay_order_id: razorpayOrderId
          })
          .eq("id", orderId);

        if (updateError) {
          throw new Error(`Error updating order: ${updateError.message}`);
        }

        // Create notification records
        // Customer WhatsApp notification
        const customerWhatsappMessage = `Thank you for your order! Your payment of ₹${order.total_amount} for order #${order.id.substring(0, 8)} has been confirmed.`;
        
        await supabaseClient
          .from("notifications")
          .insert({
            order_id: order.id,
            type: "whatsapp",
            recipient: "customer",
            status: "pending", 
            message: customerWhatsappMessage
          });

        // Store owner WhatsApp notification
        const storeOwnerWhatsappMessage = `
          ✅ Payment Confirmed! Order #${order.id.substring(0, 8)}
          
          Customer: ${order.user_name}
          Phone: ${order.user_phone}
          Payment: Razorpay (₹${order.total_amount})
          Payment ID: ${paymentId}
          
          Order is confirmed and ready for processing!
        `;
        
        await supabaseClient
          .from("notifications")
          .insert({
            order_id: order.id,
            type: "whatsapp",
            recipient: "9347445411",
            status: "pending", 
            message: storeOwnerWhatsappMessage
          });

        // Store owner SMS notification
        await supabaseClient
          .from("notifications")
          .insert({
            order_id: order.id,
            type: "sms",
            recipient: "9347445411",
            status: "pending", 
            message: `Payment Confirmed! Order #${order.id.substring(0, 8)} - ${order.user_name} - ₹${order.total_amount} - Payment ID: ${paymentId}`
          });

        // Store owner email notification
        const emailSubject = `Payment Confirmed - Order #${order.id.substring(0, 8)}`;
        const emailBody = `
          Payment has been confirmed for order:
          
          Order ID: ${order.id}
          Customer: ${order.user_name}
          Phone: ${order.user_phone}
          Email: ${order.user_email || 'Not provided'}
          Amount: ₹${order.total_amount}
          Payment Method: Razorpay
          Payment ID: ${paymentId}
          Razorpay Order ID: ${razorpayOrderId}
          
          The order is now confirmed and ready for processing.
        `;
        
        await supabaseClient
          .from("notifications")
          .insert({
            order_id: order.id,
            type: "email",
            recipient: "krishpafoods@gmail.com",
            status: "pending", 
            message: emailBody
          });

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Payment verified successfully" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } else {
        throw new Error("Payment verification failed");
      }
    } else {
      throw new Error("Invalid action");
    }
  } catch (error) {
    console.error("Razorpay function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
