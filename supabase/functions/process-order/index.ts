
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
        payment_method: orderData.payment_method || "upi",
        items: orderData.items,
        status: "pending", // Use correct status values matching the Order interface
        payment_status: orderData.payment_method === "upi" ? "pending" : "completed"
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Error creating order: ${orderError.message}`);
    }

    // Create or update user in users table
    if (orderData.user_email || orderData.user_phone) {
      const productIds = orderData.items.map(item => item.id);
      
      try {
        // Check if user exists
        let existingUser = null;
        if (orderData.user_email) {
          const { data } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", orderData.user_email)
            .single();
          existingUser = data;
        }
        
        if (!existingUser && orderData.user_phone) {
          const { data } = await supabaseClient
            .from("users")
            .select("*")
            .eq("phone", orderData.user_phone)
            .single();
          existingUser = data;
        }

        if (existingUser) {
          // Update existing user
          const currentOrders = existingUser.ordered_product_ids || [];
          await supabaseClient
            .from("users")
            .update({
              name: orderData.user_name || existingUser.name,
              email: orderData.user_email || existingUser.email,
              phone: orderData.user_phone || existingUser.phone,
              ordered_product_ids: [...currentOrders, ...productIds],
              updated_at: new Date().toISOString()
            })
            .eq("id", existingUser.id);
        } else {
          // Create new user
          await supabaseClient
            .from("users")
            .insert({
              name: orderData.user_name,
              email: orderData.user_email,
              phone: orderData.user_phone,
              ordered_product_ids: productIds
            });
        }
      } catch (userError) {
        console.error("Error creating/updating user:", userError);
        // Don't fail the order if user creation fails
      }
    }

    if (orderError) {
      throw new Error(`Error creating order: ${orderError.message}`);
    }

    // Store only order_id reference in notifications - details fetched on-demand
    await supabaseClient
      .from("notifications")
      .insert({
        order_id: order.id,
        type: "whatsapp",
        recipient: orderData.user_phone,
        status: "pending",
        message: null // Will be populated when notification is processed
      });

    await supabaseClient
      .from("notifications")
      .insert({
        order_id: order.id,
        type: "whatsapp",
        recipient: "9347445411",
        status: "pending",
        message: null // Will be populated when notification is processed
      });

    await supabaseClient
      .from("notifications")
      .insert({
        order_id: order.id,
        type: "sms",
        recipient: "9347445411",
        status: "pending",
        message: null // Will be populated when notification is processed
      });

    await supabaseClient
      .from("notifications")
      .insert({
        order_id: order.id,
        type: "email",
        recipient: "krishpafoods@gmail.com",
        status: "pending",
        message: null // Will be populated when notification is processed
      });

    // Process notifications immediately
    console.log(`Order created: ${order.id}`);
    console.log(`WhatsApp message queued for customer: ${orderData.user_phone}`);
    console.log(`WhatsApp message queued for store owner: 9347445411`);
    console.log(`Email notification queued for: krishpafoods@gmail.com`);

    // Trigger notification processing
    fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/process-notifications`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        "Content-Type": "application/json"
      }
    }).catch(error => console.error("Error triggering notifications:", error));

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
