
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
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const { orderData } = await req.json();
    
    if (!orderData || !orderData.user_phone || !orderData.shipping_address || !orderData.items || !orderData.total_amount) {
      throw new Error("Missing required order information");
    }

    // Insert order into the database
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        user_phone: orderData.user_phone,
        user_email: orderData.user_email || null,
        user_name: orderData.user_name,
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        items: orderData.items,
        status: "confirmed"
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Error creating order: ${orderError.message}`);
    }

    // Create WhatsApp notification record
    const whatsappMessage = `Thank you for your order, ${orderData.user_name}! Your order #${order.id.substring(0, 8)} for ₹${orderData.total_amount} has been confirmed. We will update you when it ships.`;
    
    await supabaseClient
      .from("notifications")
      .insert({
        order_id: order.id,
        type: "whatsapp",
        status: "pending", 
        message: whatsappMessage
      });

    // Create email notification record
    const emailSubject = `New Order #${order.id.substring(0, 8)} Received`;
    const emailBody = `
      New order received:
      
      Order ID: ${order.id}
      Customer: ${orderData.user_name}
      Phone: ${orderData.user_phone}
      Email: ${orderData.user_email || 'Not provided'}
      Amount: ₹${orderData.total_amount}
      
      Shipping Address:
      ${JSON.stringify(orderData.shipping_address, null, 2)}
      
      Items:
      ${JSON.stringify(orderData.items, null, 2)}
    `;
    
    await supabaseClient
      .from("notifications")
      .insert({
        order_id: order.id,
        type: "email",
        status: "pending", 
        message: emailBody
      });

    // In a production environment, you would call WhatsApp and Email APIs here
    // For now, we just simulate success
    console.log(`Order created: ${order.id}`);
    console.log(`WhatsApp message queued for ${orderData.user_phone}`);
    console.log(`Email notification queued for store owner`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order processed successfully",
        order: { id: order.id, status: order.status }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
