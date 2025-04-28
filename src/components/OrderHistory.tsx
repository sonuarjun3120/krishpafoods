
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  user_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: any[];
  shipping_address: {
    city: string;
    state: string;
    pincode: string;
    [key: string]: any;
  };
}

const OrderHistory = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSearchOrders = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await supabase.functions.invoke("get-orders", {
        body: { phone }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setOrders(response.data.orders || []);
      
      if (response.data.orders.length === 0) {
        toast({
          title: "No Orders Found",
          description: "No orders found with the provided phone number",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Check Your Order History</h2>
        <p className="text-gray-500 text-sm mb-4">
          Enter your phone number to see your previous orders
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="max-w-xs"
          />
          <Button 
            onClick={handleSearchOrders} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-r-2 border-white"></div>
            ) : (
              <Search size={18} />
            )}
            Search
          </Button>
        </div>
      </div>

      {orders.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Your Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "confirmed" 
                          ? "bg-green-100 text-green-800" 
                          : order.status === "shipped" 
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => showOrderDetails(order)}
                        className="flex items-center gap-1"
                      >
                        <Package size={14} />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedOrder && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details #{selectedOrder.id.substring(0, 8)}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Order Information</h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>Date:</div>
                  <div>{formatDate(selectedOrder.created_at)}</div>
                  <div>Status:</div>
                  <div>{selectedOrder.status}</div>
                  <div>Total Amount:</div>
                  <div>₹{selectedOrder.total_amount.toFixed(2)}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Shipping Address</h3>
                <div className="mt-2 text-sm">
                  {selectedOrder.shipping_address.streetAddress && <p>{selectedOrder.shipping_address.streetAddress}</p>}
                  <p>
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pincode}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Items</h3>
                <div className="mt-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b text-sm">
                      <span>{item.name} ({item.weight}) x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrderHistory;
