
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
        key: "rzp_test_YOUR_TEST_KEY", // Replace with your actual test key
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
      <p className="text-xs text-center text-gray-500">
        Secured by Razorpay. Pay using Credit/Debit card, UPI, Net Banking, and more.
      </p>
    </div>
  );
};

export default RazorpayCheckout;
