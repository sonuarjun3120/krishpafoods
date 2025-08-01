
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { verifyRazorpayPayment } from '@/utils/paymentUtils';
import { CreditCard, Wallet, Smartphone } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  orderData: {
    id: string;
    amount: number;
    name: string;
    email: string | undefined;
    phone: string;
    razorpayOrderId?: string;
  };
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({ 
  orderData, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const { toast } = useToast();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!orderData.razorpayOrderId) {
      onPaymentError("Razorpay order ID not found");
      return;
    }

    try {
      const options = {
        key: "rzp_live_QNd5fsFcCIFHmr", // Live Razorpay key
        amount: orderData.amount * 100, // Amount in paise
        currency: "INR",
        name: "Krishpa Homemade Pickles",
        description: "Purchase from Krishpa Homemade Pickles",
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Verify payment with backend
            await verifyRazorpayPayment({
              orderId: orderData.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              razorpayOrderId: response.razorpay_order_id,
            });
            
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully.",
              variant: "default",
            });
            
            onPaymentSuccess();
          } catch (error: any) {
            toast({
              title: "Payment Verification Failed",
              description: error.message || "There was an error verifying your payment.",
              variant: "destructive",
            });
            
            onPaymentError(error.message || "Payment verification failed");
          }
        },
        prefill: {
          name: orderData.name,
          email: orderData.email || "",
          contact: orderData.phone,
        },
        theme: {
          color: "#C27803", // Match with your primary color
        },
        modal: {
          ondismiss: function() {
            toast({
              title: "Payment Cancelled",
              description: "You have cancelled the payment process.",
              variant: "default",
            });
          }
        }
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "There was an error initializing the payment.",
        variant: "destructive",
      });
      
      onPaymentError(error.message || "Payment initialization failed");
    }
  };

  const handleWhatsAppChat = () => {
    // Replace with your actual WhatsApp number
    window.open("https://wa.me/919347445411?text=Hi,%20I%20have%20a%20question%20about%20my%20payment%20for%20Krishpa%20Homemade%20Pickles", "_blank");
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handlePayment}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        Pay Now
      </Button>
      
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="flex flex-col items-center justify-center p-2 border rounded-md">
          <CreditCard className="h-5 w-5 text-gray-700 mb-1" />
          <span className="text-xs">Credit Card</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 border rounded-md">
          <Wallet className="h-5 w-5 text-gray-700 mb-1" />
          <span className="text-xs">UPI</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 border rounded-md">
          <Smartphone className="h-5 w-5 text-gray-700 mb-1" />
          <span className="text-xs">Wallets</span>
        </div>
      </div>
      
      <Button
        onClick={handleWhatsAppChat}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.916 1.416 7.5 3.776 10.28L1.304 32l5.892-2.44c2.636 1.92 5.876 3.044 9.372 3.044 8.824 0 15.996-7.176 15.996-16s-7.172-16-15.996-16zM25.252 22.508c-.388 1.096-1.924 2.008-3.148 2.272-.836.172-1.928.308-5.604-1.204-4.708-1.932-7.732-6.676-7.964-6.984-.224-.308-1.84-2.456-1.84-4.684 0-2.228 1.144-3.32 1.576-3.784.344-.368.756-.532 1.012-.532.252 0 .5.004.716.016.624.32.944.064 1.368 1.064.52 1.228 1.28 3.124 1.392 3.352.112.228.188.5.036.796-.14.288-.264.412-.48.652-.22.24-.42.424-.64.684-.196.228-.42.472-.172.9.252.424.112.776 1.676 3.388 1.68 2.156 3.052 2.848 3.496 3.164.444.32.708.268.972.16.26-.1.576-.404 1.092-.824.344-.288.78-.424 1.24-.272.464.14 2.92 1.376 3.42 1.628.5.248.836.38.956.584.12.212.12 1.208-.268 2.372z"/>
        </svg>
        Chat on WhatsApp for payment queries
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        Secured by Razorpay. Pay using Credit/Debit card, UPI, Net Banking, and more.
      </p>
    </div>
  );
};

export default RazorpayCheckout;
