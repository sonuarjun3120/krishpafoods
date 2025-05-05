import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, QrCode, CreditCard, Search, Package, CheckCircle, PhoneCall, Banknote } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { DeliveryDetailsForm } from "@/components/DeliveryDetailsForm";
import { toast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { DomesticDeliveryForm } from "@/components/DomesticDeliveryForm";
import UpiQrCode from "@/components/UpiQrCode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import OrderHistory from "@/components/OrderHistory";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createRazorpayOrder } from "@/utils/paymentUtils";
import RazorpayCheckout from "@/components/RazorpayCheckout";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = React.useState<"domestic" | "international">("domestic");
  const [showQrCode, setShowQrCode] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<any>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("cart");
  const [paymentTimeout, setPaymentTimeout] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"upi" | "bank" | "razorpay" | null>("upi");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [razorpayOrderData, setRazorpayOrderData] = useState<any>(null);
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const baseShipping = cartItems.length > 0 ? 50 : 0;
    const itemCharge = cartItems.reduce((total, item) => total + (item.quantity * 10), 0);
    return baseShipping + itemCharge;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleDomesticDeliverySubmit = (values: any) => {
    setDeliveryDetails(values);
    toast({
      title: "Delivery Details Saved",
      description: "Your domestic delivery information has been saved successfully.",
      variant: "default"
    });
    console.log("Domestic delivery details:", values);
  };

  const handleInternationalDeliverySubmit = (values: any) => {
    setDeliveryDetails(values);
    toast({
      title: "Delivery Details Saved",
      description: "Your delivery information has been saved successfully.",
      variant: "default"
    });
    console.log("International delivery details:", values);
  };

  const validateDeliveryDetails = () => {
    if (!deliveryDetails) {
      toast({
        title: "Delivery Details Required",
        description: "Please fill in your delivery information first.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!deliveryDetails.mobileNumber) {
      toast({
        title: "Mobile Number Required",
        description: "Please provide a valid mobile number for order updates.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handlePayWithUpi = () => {
    if (!validateDeliveryDetails()) return;
    
    setSelectedPaymentMethod("upi");
    setShowQrCode(true);
    setPaymentError(null);
    
    // Set a timer to automatically detect "payment" after 10 seconds for demonstration
    const timeout = window.setTimeout(() => {
      handlePaymentSuccess();
    }, 10000);
    
    setPaymentTimeout(timeout);
  };
  
  const handleBankTransfer = () => {
    if (!validateDeliveryDetails()) return;
    
    setSelectedPaymentMethod("bank");
    setShowQrCode(true);
    setPaymentError(null);
    
    // Set a timer for demonstration
    const timeout = window.setTimeout(() => {
      handlePaymentSuccess();
    }, 10000);
    
    setPaymentTimeout(timeout);
  };

  const handleRazorpayPayment = async () => {
    if (!validateDeliveryDetails()) return;
    
    try {
      setPaymentProcessing(true);
      setSelectedPaymentMethod("razorpay");
      setPaymentError(null);
      
      // First create an order in Supabase
      const orderData = {
        user_name: deliveryDetails.name || deliveryDetails.recipientName,
        user_phone: deliveryDetails.mobileNumber,
        user_email: deliveryDetails.email || "",
        total_amount: calculateTotal(),
        shipping_address: deliveryDetails,
        payment_method: "razorpay",
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          weight: item.weight,
          quantity: item.quantity,
          image: item.image
        }))
      };

      const response = await supabase.functions.invoke('process-order', {
        body: { orderData }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to process order");
      }

      const order = response.data.order;
      
      // Now create a Razorpay order
      const razorpayResponse = await createRazorpayOrder({
        orderId: order.id,
        amount: calculateTotal()
      });
      
      if (!razorpayResponse || !razorpayResponse.order) {
        throw new Error("Failed to create Razorpay order");
      }
      
      // Save the Razorpay order data
      setRazorpayOrderData({
        id: order.id,
        amount: calculateTotal(),
        name: deliveryDetails.name || deliveryDetails.recipientName,
        email: deliveryDetails.email || undefined,
        phone: deliveryDetails.mobileNumber,
        razorpayOrderId: razorpayResponse.order.id
      });
      
      setShowQrCode(true);

    } catch (error: any) {
      console.error("Error initiating Razorpay payment:", error);
      setPaymentError(error.message || "There was a problem processing your order.");
      
      toast({
        title: "Order Processing Error",
        description: error.message || "There was a problem processing your order.",
        variant: "destructive"
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const processOrder = async (paymentMethod: string) => {
    try {
      setPaymentProcessing(true);
      setPaymentError(null);
      
      // Skip for Razorpay as the order is already created
      if (paymentMethod === "razorpay" && razorpayOrderData) {
        return;
      }
      
      const orderData = {
        user_name: deliveryDetails.name || deliveryDetails.recipientName,
        user_phone: deliveryDetails.mobileNumber,
        user_email: deliveryDetails.email || "",
        total_amount: calculateTotal(),
        shipping_address: deliveryDetails,
        payment_method: paymentMethod,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          weight: item.weight,
          quantity: item.quantity,
          image: item.image
        }))
      };

      const response = await supabase.functions.invoke('process-order', {
        body: { orderData }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to process payment");
      }

      setPaymentSuccess(true);
      
      toast({
        title: "Order Confirmed",
        description: "Your order has been confirmed! We've sent order details to your WhatsApp number. You'll receive updates about your order soon.",
        variant: "default"
      });
      
      clearCart();
      
      // Only for UPI and Bank Transfer, we're showing the dialog
      if (selectedPaymentMethod === "upi" || selectedPaymentMethod === "bank") {
        // Keep the dialog open to show success message, but will close after 5 seconds
        setTimeout(() => {
          setShowQrCode(false);
          setPaymentSuccess(false);
          setSelectedPaymentMethod(null);
          setActiveTab("orders"); // Automatically switch to orders tab
        }, 5000);
      } else {
        // For other methods, redirect to orders tab immediately
        setActiveTab("orders");
      }
      
    } catch (error: any) {
      console.error("Error processing order:", error);
      setPaymentError(error.message || "There was a problem processing your order. Please try again.");
      setPaymentSuccess(false);
      
      toast({
        title: "Order Processing Error",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Clear the timeout if it exists
    if (paymentTimeout) {
      clearTimeout(paymentTimeout);
      setPaymentTimeout(null);
    }
    
    // Process the order based on selected payment method
    processOrder(selectedPaymentMethod || "upi");
  };

  const handleRazorpaySuccess = () => {
    setPaymentSuccess(true);
    
    toast({
      title: "Payment Successful",
      description: "Your payment with Razorpay has been completed successfully!",
      variant: "default"
    });
    
    clearCart();
    
    // Close dialog and switch to orders tab
    setTimeout(() => {
      setShowQrCode(false);
      setPaymentSuccess(false);
      setSelectedPaymentMethod(null);
      setActiveTab("orders"); // Automatically switch to orders tab
    }, 3000);
  };

  const handleRazorpayError = (error: string) => {
    setPaymentError(error || "Payment failed");
    
    toast({
      title: "Payment Failed",
      description: error || "There was an issue with your payment. Please try again.",
      variant: "destructive"
    });
  };

  // Generate dialog title based on payment method
  const getPaymentDialogTitle = () => {
    if (paymentSuccess) return "Payment Complete";
    
    if (selectedPaymentMethod === "upi") return "Scan & Pay with UPI";
    if (selectedPaymentMethod === "bank") return "Bank Transfer Details";
    if (selectedPaymentMethod === "razorpay") return "Razorpay Payment";
    
    return "Payment";
  };
  
  // Generate payment dialog content based on payment method
  const renderPaymentDialogContent = () => {
    if (paymentSuccess) {
      return (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Payment Successful!</AlertTitle>
            <AlertDescription>
              Your order has been confirmed. A confirmation has been sent to your WhatsApp number.
            </AlertDescription>
          </Alert>
          <p className="text-sm text-gray-600">
            Thank you for shopping with Krishpa Homemade Pickles!
          </p>
        </div>
      );
    }
    
    if (paymentProcessing) {
      return (
        <div className="text-center py-6">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      );
    }
    
    if (paymentError) {
      return (
        <div className="text-center py-4">
          <Alert variant="destructive">
            <AlertTitle>Payment Failed</AlertTitle>
            <AlertDescription>
              {paymentError}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setShowQrCode(false)}
          >
            Try Again
          </Button>
        </div>
      );
    }
    
    if (selectedPaymentMethod === "upi") {
      return (
        <>
          <UpiQrCode 
            amount={calculateTotal()} 
            upiId="9963763160@ptsbi" 
          />
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>After payment, you'll receive a confirmation on WhatsApp.</p>
            <p className="text-xs text-gray-400 mt-1">(Payment will be auto-detected in a few seconds for demo purposes)</p>
          </div>
        </>
      );
    }
    
    if (selectedPaymentMethod === "bank") {
      return (
        <div className="text-center space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <h3 className="font-medium text-lg mb-3">Bank Transfer Details</h3>
            <div className="text-left space-y-2">
              <p><span className="font-medium">Account Name:</span> Krishpa Homemade Pickles</p>
              <p><span className="font-medium">Account Number:</span> 123456789012</p>
              <p><span className="font-medium">IFSC Code:</span> SBIN0001234</p>
              <p><span className="font-medium">Bank Name:</span> State Bank of India</p>
              <p><span className="font-medium">Amount:</span> ₹{calculateTotal().toFixed(2)}</p>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>Please use your name as reference in the transaction.</p>
            <p>After payment, you'll receive a confirmation on WhatsApp.</p>
            <p className="text-xs text-gray-400 mt-1">(Payment will be auto-detected in a few seconds for demo purposes)</p>
          </div>
        </div>
      );
    }
    
    if (selectedPaymentMethod === "razorpay" && razorpayOrderData) {
      return (
        <div className="text-center space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <h3 className="font-medium text-lg mb-3">Razorpay Payment</h3>
            <p className="mb-4">Click the button below to complete your payment with Razorpay.</p>
            <p className="text-lg font-bold mb-4">₹{calculateTotal().toFixed(2)}</p>
            
            <RazorpayCheckout 
              orderData={razorpayOrderData}
              onPaymentSuccess={handleRazorpaySuccess}
              onPaymentError={handleRazorpayError}
            />
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-playfair text-4xl font-bold text-primary mb-8 text-center">
          Your Cart
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cart">
            {cartItems.length > 0 ? (
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                  {/* Cart items table */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-16 w-16 flex-shrink-0">
                                  <img className="h-16 w-16 rounded object-cover" src={item.image} alt={item.name} />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-500">{item.weight}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">₹{item.price.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button 
                                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <span className="px-3 py-1">{item.quantity}</span>
                                <button 
                                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Link to="/shop">
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                        Continue Shopping
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>

                <div className="lg:w-1/3 space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col gap-4 mb-4">
                      <div className="flex gap-2">
                        <Button
                          variant={deliveryType === "domestic" ? "default" : "outline"}
                          className={`w-1/2 ${deliveryType === "domestic" ? "" : "border-primary text-primary hover:bg-primary/10"}`}
                          onClick={() => setDeliveryType("domestic")}
                        >
                          Domestic Delivery
                        </Button>
                        <Button
                          variant={deliveryType === "international" ? "default" : "outline"}
                          className={`w-1/2 ${deliveryType === "international" ? "" : "border-primary text-primary hover:bg-primary/10"}`}
                          onClick={() => setDeliveryType("international")}
                        >
                          International Delivery
                        </Button>
                      </div>
                    </div>
                    {deliveryType === "domestic" ? (
                      <DomesticDeliveryForm onSubmit={handleDomesticDeliverySubmit} />
                    ) : (
                      <DeliveryDetailsForm onSubmit={handleInternationalDeliverySubmit} />
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-playfair text-xl font-bold text-primary mb-4">
                      Order Summary
                    </h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">₹{calculateShipping().toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-800 font-medium">Total</span>
                          <span className="font-bold text-primary">₹{calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-800">Payment Method</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <RadioGroup 
                          defaultValue="upi" 
                          className="space-y-4"
                          value={selectedPaymentMethod || "upi"}
                          onValueChange={(val) => setSelectedPaymentMethod(val as "upi" | "bank" | "razorpay")}
                        >
                          <div className="flex items-center space-x-3 bg-white p-3 rounded-md border border-gray-200 hover:border-primary/50 transition-all cursor-pointer">
                            <RadioGroupItem value="upi" id="upi" className="text-primary" />
                            <label htmlFor="upi" className="flex items-center justify-between w-full cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="bg-purple-100 p-2 rounded-md">
                                  <QrCode size={18} className="text-purple-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">UPI Payment</p>
                                  <p className="text-sm text-gray-500">Pay using any UPI app</p>
                                </div>
                              </div>
                              <img src="/upi-india-logo.png" alt="UPI" className="h-6" />
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-3 bg-white p-3 rounded-md border border-gray-200 hover:border-primary/50 transition-all cursor-pointer">
                            <RadioGroupItem value="bank" id="bank" className="text-primary" />
                            <label htmlFor="bank" className="flex items-center justify-between w-full cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-md">
                                  <CreditCard size={18} className="text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Bank Transfer</p>
                                  <p className="text-sm text-gray-500">Direct bank deposit</p>
                                </div>
                              </div>
                            </label>
                          </div>
                          
                          {/* Razorpay Option */}
                          <div className="flex items-center space-x-3 bg-white p-3 rounded-md border border-gray-200 hover:border-primary/50 transition-all cursor-pointer">
                            <RadioGroupItem value="razorpay" id="razorpay" className="text-primary" />
                            <label htmlFor="razorpay" className="flex items-center justify-between w-full cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-md">
                                  <Banknote size={18} className="text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Razorpay</p>
                                  <p className="text-sm text-gray-500">Pay with card, UPI, or wallet via Razorpay</p>
                                </div>
                              </div>
                              <img src="https://razorpay.com/build/browser/static/razorpay-logo-white.934a6e7d.svg" 
                                   alt="Razorpay" 
                                   className="h-6 bg-blue-500 p-1 rounded" />
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button 
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
                        onClick={
                          selectedPaymentMethod === "upi" 
                            ? handlePayWithUpi 
                            : selectedPaymentMethod === "bank" 
                              ? handleBankTransfer
                              : handleRazorpayPayment
                        }
                        disabled={cartItems.length === 0}
                      >
                        Proceed to Payment
                      </Button>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                        <div className="flex items-center gap-1">
                          <img src="/secured-by-icon.svg" alt="Secured" className="h-4 w-4" />
                          <span>Secure Payment</span>
                        </div>
                        <span>•</span>
                        <span>100% Money Back Guarantee</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium text-gray-800 mb-2">We Accept</h3>
                      <div className="flex space-x-2">
                        <div className="bg-gray-100 p-2 rounded">
                          <svg height="20" viewBox="0 0 148 105" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M147.264 84.104H135.068V104.993H147.264V84.104Z" fill="#FF5F00"></path><path d="M136.404 94.5478C136.398 90.7596 137.573 87.0729 139.759 83.9833C137.573 80.8937 136.398 77.207 136.404 73.4188C136.398 69.6306 137.573 65.9439 139.759 62.8542C137.573 59.7646 136.398 56.078 136.404 52.2898C136.398 48.5016 137.573 44.8149 139.759 41.7252C137.574 38.6346 136.398 34.9477 136.404 31.1592C136.398 27.371 137.573 23.6842 139.759 20.5946C137.573 17.505 136.398 13.8183 136.404 10.03C136.398 6.24188 137.573 2.55512 139.759 -0.534532L136.167 -5.62537C131.739 -0.972766 129.282 5.05262 129.282 11.2852V93.2899C129.282 99.5225 131.739 105.548 136.167 110.201L139.759 105.11C137.573 102.021 136.398 98.3342 136.404 94.546" fill="#EB001B"></path><path d="M145.927 105.11C150.341 100.458 152.791 94.4329 152.791 88.2003V6.19531C152.791 -0.0372568 150.341 -6.06267 145.927 -10.7152L142.335 -5.62537C144.526 -2.54087 145.706 1.14976 145.705 4.94055C145.706 8.73133 144.526 12.422 142.335 15.5065C144.521 18.5961 145.696 22.2828 145.69 26.071C145.696 29.8592 144.521 33.546 142.335 36.6356C144.521 39.7252 145.696 43.412 145.69 47.2002C145.696 50.9884 144.521 54.6751 142.335 57.7648C144.521 60.8544 145.696 64.5411 145.69 68.3293C145.696 72.1175 144.521 75.8043 142.335 78.8939C144.521 81.9835 145.696 85.6703 145.69 89.4585C145.696 93.2467 144.521 96.9334 142.335 100.023L145.927 105.11Z" fill="#F79E1B"></path>
                          </svg>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                          <svg height="20" viewBox="0 0 780 501" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 0H740C762.091 0 780 17.9086 780 40V461C780 483.091 762.091 501 740 501H40C17.9086 501 0 483.091 0 461V40C0 17.9086 17.9086 0 40 0Z" fill="#EFF3F5"></path><path fillRule="evenodd" clipRule="evenodd" d="M472.56 188.376C472.56 179.714 464.844 172.736 455.333 172.736C445.823 172.736 438.107 179.714 438.107 188.376C438.107 197.05 445.823 204.028 455.333 204.028C464.844 204.028 472.56 197.05 472.56 188.376ZM455.333 180.928C460.254 180.928 464.277 184.238 464.254 188.376C464.277 192.526 460.254 195.848 455.333 195.848C450.412 195.848 446.389 192.526 446.389 188.376C446.389 184.238 450.412 180.928 455.333 180.928Z" fill="#2557D6"></path><path fillRule="evenodd" clipRule="evenodd" d="M438.107 172.736H459.356V179.714" fill="#2557D6"></path></svg>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                          <svg height="20" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 0H740C762.091 0 780 17.9086 780 40V460C780 482.091 762.091 500 740 500H40C17.9086 500 0 482.091 0 460V40C0 17.9086 17.9086 0 40 0Z" fill="#EFF3F5"></path><path fillRule="evenodd" clipRule="evenodd" d="M472.56 188.376C472.56 179.714 464.844 172.736 455.333 172.736C445.823 172.736 438.107 179.714 438.107 188.376C438.107 197.05 445.823 204.028 455.333 204.028C464.844 204.028 472.56 197.05 472.56 188.376ZM455.333 180.928C460.254 180.928 464.277 184.238 464.254 188.376C464.277 192.526 460.254 195.848 455.333 195.848C450.412 195.848 446.389 192.526 446.389 188.376C446.389 184.238 450.412 180.928 455.333 180.928Z" fill="#253B80"></path><path fillRule="evenodd" clipRule="evenodd" d="M438.107 172.736H459.356V179.714" fill="#253B80"></path></svg>
                        </div>
                        <div className="bg-blue-500 p-1 rounded">
                          <img src="https://razorpay.com/build/browser/static/razorpay-logo-white.934a6e7d.svg" 
                               alt="Razorpay" 
                               className="h-6" />
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-gray-500">After payment is complete, check your order status in the Order History tab.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600 mt-12">
                <p className="mb-6">Your cart is empty.</p>
                <Link to="/shop">
                  <Button>
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getPaymentDialogTitle()}</DialogTitle>
          </DialogHeader>
          {renderPaymentDialogContent()}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Cart;
