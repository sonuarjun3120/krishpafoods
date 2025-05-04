
import React, { useEffect, useState } from "react";
import { QrCode, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface UpiQrCodeProps {
  amount: number;
  upiId: string;
  merchantName?: string;
  onPaymentComplete?: (paymentStatus: string) => void;
  orderId?: string;
  firebaseWebhookUrl?: string;
}

const UpiQrCode = ({ 
  amount, 
  upiId, 
  merchantName = "Krishpa Homemade Pickles",
  onPaymentComplete,
  orderId,
  firebaseWebhookUrl
}: UpiQrCodeProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        setIsLoading(true);
        // Format the UPI URL with transaction details
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for Krishpa Pickles order`)}`;
        
        // Import QRCode.js only on client-side
        const QRCodeLib = await import("qrcode");
        
        // Generate QR code as data URL
        const url = await QRCodeLib.toDataURL(upiUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF"
          }
        });
        
        setQrCodeUrl(url);
        setError(null);
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code");
      } finally {
        setIsLoading(false);
      }
    };

    generateQrCode();
  }, [amount, upiId, merchantName]);

  const handlePaymentSuccess = async () => {
    setPaymentStatus("success");
    
    // If we have a Firebase webhook URL and order ID, send the webhook
    if (firebaseWebhookUrl && orderId) {
      try {
        const { data, error } = await supabase.functions.invoke('send-firebase-webhook', {
          body: {
            orderId,
            paymentStatus: "success",
            firebaseWebhookUrl
          }
        });

        if (error) {
          console.error("Failed to send webhook to Firebase:", error);
          setError("Failed to notify your Firebase backend. Please check logs.");
        } else {
          console.log("Webhook sent successfully:", data);
        }
      } catch (err) {
        console.error("Error sending webhook:", err);
        setError("Failed to notify your Firebase backend. Please check logs.");
      }
    }

    // Call the onPaymentComplete callback if provided
    if (onPaymentComplete) {
      onPaymentComplete("success");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-md shadow-sm border">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px] w-[200px] bg-gray-100">
            <QrCode size={72} className="text-gray-400 animate-pulse" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[200px] w-[200px] bg-gray-100">
            <AlertCircle size={72} className="text-red-400 mb-2" />
            <p className="text-xs text-red-500">{error}</p>
          </div>
        ) : (
          <div className="flex justify-center">
            {qrCodeUrl && (
              <img 
                src={qrCodeUrl} 
                alt="UPI QR Code" 
                className="h-[200px] w-[200px]" 
              />
            )}
          </div>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium">Scan to pay ₹{amount.toFixed(2)}</p>
        <p className="text-xs text-gray-500">UPI ID: {upiId}</p>
        <p className="text-xs text-gray-500 mt-1">Or use UPI app to pay</p>
      </div>
      
      {/* Payment completed button - for testing or customer confirmation */}
      {paymentStatus === "pending" && (
        <Button 
          onClick={handlePaymentSuccess} 
          variant="outline" 
          className="mt-4 w-full"
        >
          I've Completed the Payment
        </Button>
      )}
      
      {paymentStatus === "success" && (
        <div className="flex items-center text-green-600 font-medium mt-2">
          <Check className="mr-1" size={16} />
          Payment completed successfully
        </div>
      )}
    </div>
  );
};

export default UpiQrCode;
