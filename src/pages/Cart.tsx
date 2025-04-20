import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { DeliveryDetailsForm } from "@/components/DeliveryDetailsForm";
import { toast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";
import React from "react";
import { DomesticDeliveryForm } from "@/components/DomesticDeliveryForm";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = React.useState<"domestic" | "international">("domestic");

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
    toast({
      title: "Delivery Details Saved",
      description: "Your domestic delivery information has been saved successfully.",
      variant: "default"
    });
    console.log("Domestic delivery details:", values);
    // Optionally store these details for later
  };

  const handleDeliverySubmit = (values: any) => {
    toast({
      title: "Delivery Details Saved",
      description: "Your delivery information has been saved successfully.",
      variant: "default"
    });
    console.log("Delivery details:", values);
    // You might want to store these details in a state or context for further processing
  };

  const handleInternationalDeliverySubmit = (values: any) => {
    toast({
      title: "Delivery Details Saved",
      description: "Your delivery information has been saved successfully.",
      variant: "default"
    });
    console.log("International delivery details:", values);
    // Optionally store these details for later
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-playfair text-4xl font-bold text-primary mb-8 text-center">
          Your Cart
        </h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
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
                {deliveryType === "domestic" && (
                  <DomesticDeliveryForm onSubmit={handleDomesticDeliverySubmit} />
                )}
                {deliveryType === "international" && (
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

                <Button className="w-full bg-primary hover:bg-primary/90 mb-3">
                  Proceed to Checkout
                </Button>
                
                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-2">We Accept</h3>
                  <div className="flex space-x-2">
                    <div className="bg-gray-100 p-2 rounded">
                      <svg height="20" viewBox="0 0 148 105" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M147.264 84.104H135.068V104.993H147.264V84.104Z" fill="#FF5F00"></path><path d="M136.404 94.5478C136.398 90.7596 137.573 87.0729 139.759 83.9833C137.573 80.8937 136.398 77.207 136.404 73.4188C136.398 69.6306 137.573 65.9439 139.759 62.8542C137.573 59.7646 136.398 56.078 136.404 52.2898C136.398 48.5016 137.573 44.8149 139.759 41.7252C137.574 38.6346 136.398 34.9477 136.404 31.1592C136.398 27.371 137.573 23.6842 139.759 20.5946C137.573 17.505 136.398 13.8183 136.404 10.03C136.398 6.24188 137.573 2.55512 139.759 -0.534532L136.167 -5.62537C131.739 -0.972766 129.282 5.05262 129.282 11.2852V93.2899C129.282 99.5225 131.739 105.548 136.167 110.201L139.759 105.11C137.573 102.021 136.398 98.3342 136.404 94.546" fill="#EB001B"></path><path d="M145.927 105.11C150.341 100.458 152.791 94.4329 152.791 88.2003V6.19531C152.791 -0.0372568 150.341 -6.06267 145.927 -10.7152L142.335 -5.62537C144.526 -2.54087 145.706 1.14976 145.705 4.94055C145.706 8.73133 144.526 12.422 142.335 15.5065C144.521 18.5961 145.696 22.2828 145.69 26.071C145.696 29.8592 144.521 33.546 142.335 36.6356C144.521 39.7252 145.696 43.412 145.69 47.2002C145.696 50.9884 144.521 54.6751 142.335 57.7648C144.521 60.8544 145.696 64.5411 145.69 68.3293C145.696 72.1175 144.521 75.8043 142.335 78.8939C144.521 81.9835 145.696 85.6703 145.69 89.4585C145.696 93.2467 144.521 96.9334 142.335 100.023L145.927 105.11Z" fill="#F79E1B"></path><path d="M18.977 20.9082H25.4867V52.8855H18.977V20.9082Z" fill="#00579F"></path><path d="M45.5075 21.3431C44.0035 20.8284 42.4225 20.5676 40.8316 20.5708C35.5373 20.5708 32 23.1723 32 27.0719C32 30.0078 34.5632 31.7531 36.4894 32.8276C38.4427 33.9268 39.1045 34.649 39.1045 35.589C39.1045 36.9865 37.4853 37.6594 35.9914 37.6594C33.9897 37.6594 32.037 37.1498 30.5431 36.3764L29.8813 36.0407L29.174 41.7033C30.9825 42.3762 34.0122 42.962 37.151 42.9875C42.8222 42.9875 46.3077 40.4114 46.3077 36.2548C46.3077 33.9268 44.7885 32.1308 41.7368 30.5696C39.8359 29.5465 38.6688 28.8736 38.6688 27.8505C38.6688 26.9105 39.7352 25.9889 42.0321 25.9889C43.9854 25.9381 45.5075 26.4984 46.6746 27.0336L47.1611 27.2567L47.8937 21.8781L45.5075 21.3431Z" fill="#00579F"></path><path d="M54.9502 33.9312C55.4368 32.6098 57.1938 28.0621 57.1938 28.0621C57.1431 28.1125 57.6804 26.8164 57.9484 26.0176L58.3843 27.7629C58.3843 27.7629 59.478 32.9709 59.7207 33.9312H54.9502ZM63.3068 20.9082H58.2581C56.8144 20.9082 55.7226 21.2951 55.0608 22.7301L45.0068 52.8855H51.5418C51.5418 52.8855 52.7089 49.7362 52.9517 49.0888H60.4969C60.6889 49.932 61.2769 52.8855 61.2769 52.8855H67.0696L63.3068 20.9082Z" fill="#00579F"></path><path d="M17.3578 20.9082L11.212 41.2941L10.581 38.7195L10.581 38.7179L8.19192 23.2944C8.19192 23.2944 7.9491 21.3431 5.7529 21.3431H0.0407715L0 21.6788C0 21.6788 3.4348 22.2509 7.46261 25.2629L12.9829 52.8855H19.5686L29.515 20.9082H17.3578Z" fill="#00579F"></path><path d="M73.7761 20.9082H79.9729L76.016 52.8855H69.8192L73.7761 20.9082Z" fill="#00579F"></path><path d="M94.3695 37.2729L96.7557 29.5465C96.7557 29.5465 97.5436 27.2184 97.9541 26.0176L98.4406 28.7607C98.4406 28.7607 99.8335 36.2294 100.027 37.2729H94.3695ZM103.966 20.9082H99.4484C97.9033 20.9082 97.1407 21.7572 96.6288 22.7047C96.6288 22.7047 92.1881 33.674 90.3796 37.8712C89.3133 40.0596 88.6514 42.125 88.1648 44.6757C86.916 50.6332 91.0717 53.0587 91.0717 53.0587H97.0316L104.01 36.9614L104.01 52.8855H110.546V20.9082H103.966Z" fill="#F79E1B"></path><path d="M107.388 39.3086C107.388 46.3209 112.728 52.8855 121.883 52.8855C124.987 52.9363 128.05 52.2127 130.739 50.8152C133.428 49.4176 135.651 47.4155 137.19 44.9925V32.498C137.19 32.498 131.206 37.8459 124.626 37.8459C120.019 37.8459 114.093 34.9429 114.093 28.0874C114.093 21.7825 119.04 17.5073 125.871 17.5073C129.256 17.5073 132.53 18.4797 135.621 20.1953C135.782 19.3726 136.925 13.7348 136.925 13.7348C133.882 12.0141 130.487 11.095 127.052 11.0442C117.103 11.0189 107.388 17.6288 107.388 29.5973V39.3086Z" fill="#F79E1B"></path></svg>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                      <svg height="20" viewBox="0 0 780 501" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 0H740C762.091 0 780 17.9086 780 40V461C780 483.091 762.091 501 740 501H40C17.9086 501 0 483.091 0 461V40C0 17.9086 17.9086 0 40 0Z" fill="#2557D6"></path><path d="M449 250C449 175.29 511.29 115 586 115C660.71 115 723 175.29 723 250C723 324.71 660.71 385 586 385C511.29 385 449 324.71 449 250Z" fill="#EB001B"></path><path d="M57 250C57 175.29 119.29 115 194 115C268.71 115 331 175.29 331 250C331 324.71 268.71 385 194 385C119.29 385 57 324.71 57 250Z" fill="#00A1DF"></path><path d="M195.74 180.251C230.956 152.722 276.129 137.01 323.273 137.07C364.261 136.861 404.245 148.939 437.742 171.327C471.239 193.714 496.695 225.373 510.326 262.243C522.114 293.211 525.196 326.953 519.234 359.672C486.916 330.011 441.001 316.803 396.992 324.085C352.983 331.368 315.203 358.131 294.493 397.334C282.162 375.926 275.389 351.61 275.29 326.71C275.281 298.853 283.731 271.733 299.498 249.155C315.266 226.577 337.485 209.8 363.13 201.03C323.467 190.468 286.676 169.6 258.12 140.42C236.912 152.386 218.403 168.624 203.97 188.029C189.538 207.434 179.532 229.57 174.63 253.09C169.728 276.61 170.057 300.959 175.593 324.331C181.129 347.703 191.72 369.513 206.65 388.4C192.84 374.13 181.939 357.246 174.69 338.634C167.441 320.022 163.997 300.075 164.567 280.057C165.138 260.04 169.712 240.364 178.009 222.213C186.306 204.062 198.129 187.857 212.74 174.751C206.821 176.462 200.967 178.415 195.25 180.751L195.74 180.251Z" fill="white"></path></svg>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                      <svg height="20" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 0H740C762.091 0 780 17.9086 780 40V460C780 482.091 762.091 500 740 500H40C17.9086 500 0 482.091 0 460V40C0 17.9086 17.9086 0 40 0Z" fill="#EFF3F5"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M472.56 188.376C472.56 179.714 464.844 172.736 455.333 172.736C445.823 172.736 438.107 179.714 438.107 188.376C438.107 197.05 445.823 204.028 455.333 204.028C464.844 204.028 472.56 197.05 472.56 188.376ZM455.333 180.928C460.254 180.928 464.277 184.238 464.254 188.376C464.277 192.526 460.254 195.848 455.333 195.848C450.412 195.848 446.389 192.526 446.389 188.376C446.389 184.238 450.412 180.928 455.333 180.928Z" fill="#253B80"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M438.107 172.736H459.356V179.714
