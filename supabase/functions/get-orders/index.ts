
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
    
    const { phone, otp } = await req.json();
    
    if (!phone) {
      throw new Error("Phone number is required");
    }

    if (!otp) {
      throw new Error("OTP verification is required to access orders");
    }

    // Verify OTP before returning orders
    const { data: otpData, error: otpError } = await supabaseClient
      .from("otp_verifications")
      .select("*")
      .eq("email", phone) // Using email field for phone
      .eq("otp_code", otp)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (otpError || !otpData) {
      throw new Error("Invalid or expired OTP");
    }

    // Mark OTP as verified
    await supabaseClient
      .from("otp_verifications")
      .update({ verified: true })
      .eq("id", otpData.id);

    // Query orders for the provided phone number
    const { data: orders, error } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("user_phone", phone)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orders: orders || []
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
