import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, QrCode, CreditCard, Search, Package } from "lucide-react";
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

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = React.useState<"domestic" | "international">("domestic");
  const [showQrCode, setShowQrCode] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<any>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("cart");
  const [paymentTimeout, setPaymentTimeout] = useState<number | null>(null);

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

  const handlePayWithUpi = () => {
    if (!deliveryDetails) {
      toast({
        title: "Delivery Details Required",
        description: "Please fill in your delivery information first.",
        variant: "destructive"
      });
      return;
    }
    setShowQrCode(true);
    
    // Set a timer to automatically detect "payment" after 10 seconds for demonstration
    const timeout = window.setTimeout(() => {
      handlePaymentSuccess();
    }, 10000);
    
    setPaymentTimeout(timeout);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Clear the timeout if it exists
      if (paymentTimeout) {
        clearTimeout(paymentTimeout);
        setPaymentTimeout(null);
      }
      
      setPaymentProcessing(true);
      
      const orderData = {
        user_name: deliveryDetails.name || deliveryDetails.recipientName,
        user_phone: deliveryDetails.mobileNumber,
        user_email: "",
        total_amount: calculateTotal(),
        shipping_address: deliveryDetails,
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
        throw new Error(response.error.message);
      }

      setPaymentSuccess(true);
      
      toast({
        title: "Payment Successful",
        description: "We've received your payment and sent a confirmation to your WhatsApp. The order details have been sent to our team.",
        variant: "default"
      });
      
      clearCart();
      
      // Keep the dialog open to show success message, but will close after 5 seconds
      setTimeout(() => {
        setShowQrCode(false);
        setPaymentSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error Processing Payment",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPaymentProcessing(false);
    }
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

                    <div className="space-y-3">
                      <Button 
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
                        onClick={handlePayWithUpi}
                        disabled={cartItems.length === 0}
                      >
                        <QrCode size={18} /> Pay with UPI QR
                      </Button>
                      
                      <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                        <CreditCard size={18} /> Other Payment Methods
                      </Button>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium text-gray-800 mb-2">We Accept</h3>
                      <div className="flex space-x-2">
                        <div className="bg-gray-100 p-2 rounded">
                          <svg height="20" viewBox="0 0 148 105" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M147.264 84.104H135.068V104.993H147.264V84.104Z" fill="#FF5F00"></path><path d="M136.404 94.5478C136.398 90.7596 137.573 87.0729 139.759 83.9833C137.573 80.8937 136.398 77.207 136.404 73.4188C136.398 69.6306 137.573 65.9439 139.759 62.8542C137.573 59.7646 136.398 56.078 136.404 52.2898C136.398 48.5016 137.573 44.8149 139.759 41.7252C137.574 38.6346 136.398 34.9477 136.404 31.1592C136.398 27.371 137.573 23.6842 139.759 20.5946C137.573 17.505 136.398 13.8183 136.404 10.03C136.398 6.24188 137.573 2.55512 139.759 -0.534532L136.167 -5.62537C131.739 -0.972766 129.282 5.05262 129.282 11.2852V93.2899C129.282 99.5225 131.739 105.548 136.167 110.201L139.759 105.11C137.573 102.021 136.398 98.3342 136.404 94.546" fill="#EB001B"></path><path d="M145.927 105.11C150.341 100.458 152.791 94.4329 152.791 88.2003V6.19531C152.791 -0.0372568 150.341 -6.06267 145.927 -10.7152L142.335 -5.62537C144.526 -2.54087 145.706 1.14976 145.705 4.94055C145.706 8.73133 144.526 12.422 142.335 15.5065C144.521 18.5961 145.696 22.2828 145.69 26.071C145.696 29.8592 144.521 33.546 142.335 36.6356C144.521 39.7252 145.696 43.412 145.69 47.2002C145.696 50.9884 144.521 54.6751 142.335 57.7648C144.521 60.8544 145.696 64.5411 145.69 68.3293C145.696 72.1175 144.521 75.8043 142.335 78.8939C144.521 81.9835 145.696 85.6703 145.69 89.4585C145.696 93.2467 144.521 96.9334 142.335 100.023L145.927 105.11Z" fill="#F79E1B"></path>
                          </svg>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                          <svg height="20" viewBox="0 0 780 501" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 0H740C762.091 0 780 17.9086 780 40V461C780 483.091 762.091 501 740 501H40C17.9086 501 0 483.091 0 461V40C0 17.9086 17.9086 0 40 0Z" fill="#2557D6"></path><path d="M449 250C449 175.29 511.29 115 586 115C660.71 115 723 175.29 723 250C723 324.71 660.71 385 586 385C511.29 385 449 324.71 449 250Z" fill="#EB001B"></path><path d="M57 250C57 175.29 119.29 115 194 115C268.71 115 331 175.29 331 250C331 324.71 268.71 385 194 385C119.29 385 57 324.71 57 250Z" fill="#00A1DF"></path><path d="M195.74 180.251C230.956 152.722 276.129 137.01 323.273 137.07C364.261 136.861 404.245 148.939 437.742 171.327C471.239 193.714 496.695 225.373 510.326 262.243C522.114 293.211 525.196 326.953 519.234 359.672C486.916 330.011 441.001 316.803 396.992 324.085C352.983 331.368 315.203 358.131 294.493 397.334C282.162 375.926 275.389 351.61 275.29 326.71C275.281 298.853 283.731 271.733 299.498 249.155C315.266 226.577 337.485 209.8 363.13 201.03C323.467 190.468 286.676 169.6 258.12 140.42C236.912 152.386 218.403 168.624 203.97 188.029C189.538 207.434 179.532 229.57 174.63 253.09C169.728 276.61 170.057 300.959 175.593 324.331C181.129 347.703 191.72 369.513 206.65 388.4C192.84 374.13 181.939 357.246 174.69 338.634C167.441 320.022 163.997 300.075 164.567 280.057C165.138 260.04 169.712 240.364 178.009 222.213C186.306 204.062 198.129 187.857 212.74 174.751C206.821 176.462 200.967 178.415 195.25 180.751L195.74 180.251Z" fill="white"></path></svg>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                          <svg height="20" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 0H740C762.091 0 780 17.9086 780 40V460C780 482.091 762.091 500 740 500H40C17.9086 500 0 482.091 0 460V40C0 17.9086 17.9086 0 40 0Z" fill="#EFF3F5"></path><path fillRule="evenodd" clipRule="evenodd" d="M472.56 188.376C472.56 179.714 464.844 172.736 455.333 172.736C445.823 172.736 438.107 179.714 438.107 188.376C438.107 197.05 445.823 204.028 455.333 204.028C464.844 204.028 472.56 197.05 472.56 188.376ZM455.333 180.928C460.254 180.928 464.277 184.238 464.254 188.376C464.277 192.526 460.254 195.848 455.333 195.848C450.412 195.848 446.389 192.526 446.389 188.376C446.389 184.238 450.412 180.928 455.333 180.928Z" fill="#253B80"></path><path fillRule="evenodd" clipRule="evenodd" d="M438.107 172.736H459.356V179.714" fill="#253B80"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600 mt-12">
                <p className="mb-6">Your cart is empty.</p>
                <Link to="/shop">
                  <Button className="bg-primary hover:bg-primary/90">
                    Browse Products
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <OrderHistory />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQrCode} onOpenChange={(open) => {
        if (!open && paymentTimeout) {
          clearTimeout(paymentTimeout);
          setPaymentTimeout(null);
        }
        if (!paymentProcessing && !paymentSuccess) {
          setShowQrCode(open);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {paymentSuccess ? "Payment Complete" : "Scan & Pay"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {paymentSuccess ? (
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
            ) : (
              <>
                <UpiQrCode 
                  amount={calculateTotal()} 
                  upiId="9963763160@ptsbi" 
                />
                <div className="mt-6 text-center text-sm text-gray-500">
                  {paymentProcessing ? (
                    <p>Processing your payment...</p>
                  ) : (
                    <>
                      <p>After payment, you'll receive a confirmation on WhatsApp.</p>
                      <p className="text-xs text-gray-400 mt-1">(Payment will be auto-detected in a few seconds for demo purposes)</p>
                    </>
                  )}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={handlePaymentSuccess} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-r-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "I've Completed the Payment"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Cart;
