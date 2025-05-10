
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, Package, Search, Truck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      case 'pending':
        return <Clock className="text-amber-500" size={18} />;
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

  // Separate orders into current (pending, confirmed) and past (shipped, delivered)
  const getCurrentOrders = () => {
    if (!orders) return [];
    return orders.filter(order => 
      order.status === 'pending' || order.status === 'confirmed'
    );
  };

  const getPastOrders = () => {
    if (!orders) return [];
    return orders.filter(order => 
      order.status === 'shipped' || order.status === 'delivered'
    );
  };

  const currentOrders = getCurrentOrders();
  const pastOrders = getPastOrders();

  // Render a single order item
  const renderOrderItem = (item: any, index: number) => (
    <div key={index} className="flex items-center py-2 border-b last:border-0">
      <div className="w-16 h-16">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{item.name}</p>
        <p className="text-xs text-gray-500">{item.weight}</p>
        <div className="flex justify-between mt-1">
          <p className="text-xs">Qty: {item.quantity}</p>
          <p className="text-xs font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );

  // Render an order card with items
  const renderOrderCard = (order: any) => (
    <Card key={order.id} className="mb-4 overflow-hidden">
      <CardHeader className="bg-gray-50 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base">Order #{order.id.substring(0, 8)}</CardTitle>
            <CardDescription>{formatDate(order.created_at)}</CardDescription>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="mb-3">
          <p className="text-sm">
            <span className="font-medium">Total:</span> ₹{order.total_amount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Shipping to: {order.shipping_address.streetAddress || order.shipping_address.address}, 
            {order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.pincode || order.shipping_address.zipCode}
          </p>
        </div>
        
        <div className="mt-4 border-t pt-2">
          <p className="text-sm font-medium mb-2">Order Items</p>
          <div className="max-h-60 overflow-auto">
            {order.items.map((item: any, index: number) => renderOrderItem(item, index))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>

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
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="current">Current Orders ({currentOrders.length})</TabsTrigger>
                <TabsTrigger value="past">Past Orders ({pastOrders.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current">
                {currentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {currentOrders.map((order: any) => renderOrderCard(order))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">You don't have any current orders.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastOrders.length > 0 ? (
                  <div className="space-y-4">
                    {pastOrders.map((order: any) => renderOrderCard(order))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">You don't have any past orders yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
