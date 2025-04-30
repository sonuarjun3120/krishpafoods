
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Package, Search, Truck } from "lucide-react";

const OrderHistory = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [searchClicked, setSearchClicked] = useState(false);

  const {
    data: orders,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders', phoneNumber],
    queryFn: async () => {
      if (!phoneNumber) return [];
      
      const response = await supabase.functions.invoke('get-orders', {
        body: { phone: phoneNumber }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data?.orders || [];
    },
    enabled: searchClicked && !!phoneNumber
  });

  const handleSearch = () => {
    if (phoneNumber) {
      setSearchClicked(true);
      refetch();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'shipped':
        return <Truck className="text-blue-500" size={18} />;
      case 'delivered':
        return <Package className="text-primary" size={18} />;
      default:
        return <AlertCircle className="text-amber-500" size={18} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium mb-4">Find Your Orders</h2>
        <div className="flex gap-2">
          <Input 
            placeholder="Enter your phone number" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            className="flex items-center gap-2"
          >
            <Search size={16} /> Search
          </Button>
        </div>
      </div>

      {searchClicked && (
        <div>
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-gray-500">Loading your orders...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center text-red-800">
              <p>Error loading orders. Please try again.</p>
            </div>
          )}

          {!isLoading && !error && orders && orders.length === 0 && phoneNumber && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-center">
              <p className="text-amber-800">No orders found for this phone number.</p>
            </div>
          )}

          {!isLoading && !error && orders && orders.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <h3 className="p-4 border-b bg-gray-50 font-medium">Your Order History</h3>
              <div className="divide-y">
                {orders.map((order: any) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm"><span className="font-medium">Items:</span> {order.items.length}</p>
                      <p className="text-sm"><span className="font-medium">Total:</span> ₹{order.total_amount.toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-dashed">
                      <p className="text-xs text-gray-500">
                        Shipping to: {order.shipping_address.streetAddress || order.shipping_address.address}, 
                        {order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.pincode || order.shipping_address.zipCode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
