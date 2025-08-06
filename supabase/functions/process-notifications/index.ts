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

    // Get pending notifications
    const { data: notifications, error } = await supabaseClient
      .from("notifications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Error fetching notifications: ${error.message}`);
    }

    console.log(`Processing ${notifications?.length || 0} pending notifications`);

    for (const notification of notifications || []) {
      try {
        if (notification.type === "email") {
          // Send email notification
          await sendEmailNotification(notification);
        } else if (notification.type === "whatsapp" || notification.type === "sms") {
          // Log SMS/WhatsApp (you can integrate with SMS provider later)
          await logSMSNotification(notification);
        }

        // Update notification status to sent
        await supabaseClient
          .from("notifications")
          .update({ 
            status: "sent",
            updated_at: new Date().toISOString()
          })
          .eq("id", notification.id);

        console.log(`Processed notification ${notification.id} (${notification.type})`);
      } catch (notificationError) {
        console.error(`Error processing notification ${notification.id}:`, notificationError);
        
        // Update notification status to failed
        await supabaseClient
          .from("notifications")
          .update({ 
            status: "failed",
            updated_at: new Date().toISOString()
          })
          .eq("id", notification.id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: notifications?.length || 0,
        message: "Notifications processed successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

async function sendEmailNotification(notification: any) {
  const emailSubject = notification.order_id 
    ? `Order Update - #${notification.order_id.substring(0, 8)}`
    : "Krishpa Foods Notification";

  // Format the message as HTML
  const htmlMessage = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c5530;">Krishpa Foods</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${notification.message}</pre>
          </div>
          <p style="margin-top: 20px; color: #666;">
            Thank you for choosing Krishpa Foods!
          </p>
        </div>
      </body>
    </html>
  `;

  // Call the send-email function
  const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
    },
    body: JSON.stringify({
      to: notification.recipient,
      subject: emailSubject,
      html: htmlMessage,
      orderId: notification.order_id
    }),
  });

  if (!emailResponse.ok) {
    throw new Error(`Email sending failed: ${await emailResponse.text()}`);
  }

  console.log(`Email sent to ${notification.recipient}`);
}

async function logSMSNotification(notification: any) {
  // For now, we'll just log SMS/WhatsApp notifications
  // In a real implementation, you would integrate with SMS/WhatsApp providers
  console.log(`SMS/WhatsApp notification for ${notification.recipient}:`);
  console.log(notification.message);
  
  // You can integrate with services like:
  // - Twilio for SMS
  // - WhatsApp Business API
  // - TextLocal, MSG91, etc.
  
  // For demonstration, we'll mark it as sent
  return true;
}