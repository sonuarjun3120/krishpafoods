
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, ChevronDown, ChevronUp, User, Package, CreditCard, Truck, MapPin, Phone, Mail } from 'lucide-react';
import { useRealtimeOrders, Order } from '@/hooks/useRealtimeOrders';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomerAnalytics {
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date: string | null;
}

export const OrderManagement = () => {
  const { orders, loading } = useRealtimeOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [customerAnalytics, setCustomerAnalytics] = useState<Record<string, CustomerAnalytics>>({});
  const { toast } = useToast();

  // Fetch customer analytics for all unique customers
  useEffect(() => {
    const fetchCustomerAnalytics = async () => {
      const uniqueEmails = [...new Set(orders.map(o => o.user_email).filter(Boolean))];
      
      for (const email of uniqueEmails) {
        const { data } = await supabase
          .from('user_analytics')
          .select('*')
          .eq('user_email', email)
          .maybeSingle();
        
        if (data) {
          setCustomerAnalytics(prev => ({
            ...prev,
            [email as string]: data
          }));
        }
      }
    };

    if (orders.length > 0) {
      fetchCustomerAnalytics();
    }
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = !dateFilter || order.created_at.includes(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'processing': return 'text-blue-600';
      case 'shipped': return 'text-purple-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Orders ({orders.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const shippingAddress = order.shipping_address || {};
                const isExpanded = expandedOrderId === order.id;
                const analytics = order.user_email ? customerAnalytics[order.user_email] : null;
                const itemsTotal = Array.isArray(order.items) 
                  ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) 
                  : 0;
                
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-4 pb-4 border-b">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold text-xl">Order #{order.order_number || order.id.slice(0, 8)}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={getStatusVariant(order.status)} className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
                                {order.payment_status === 'completed' ? '✓ Paid' : 'Payment Pending'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">₹{Number(order.total_amount).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {itemsTotal} {itemsTotal === 1 ? 'item' : 'items'}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="mt-2"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                            {isExpanded ? 'Hide Details' : 'Show Full Details'}
                          </Button>
                        </div>
                      </div>

                      {/* Quick Overview Grid */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <Card>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <User className="h-4 w-4" />
                              <span className="text-xs font-medium">CUSTOMER</span>
                            </div>
                            <div className="font-semibold">{order.user_name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" />
                              {order.user_phone}
                            </div>
                            {analytics && (
                              <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                                {analytics.total_orders} orders • ₹{Number(analytics.total_spent).toFixed(0)} spent
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <CreditCard className="h-4 w-4" />
                              <span className="text-xs font-medium">PAYMENT</span>
                            </div>
                            <div className="font-semibold">{order.payment_method?.toUpperCase() || 'UPI'}</div>
                            <div className="text-sm mt-1">
                              <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                                {order.payment_status === 'completed' ? 'Paid' : 'Pending'}
                              </Badge>
                            </div>
                            {order.razorpay_payment_id && (
                              <div className="text-xs text-muted-foreground mt-2 font-mono">
                                {order.razorpay_payment_id.slice(0, 12)}...
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Truck className="h-4 w-4" />
                              <span className="text-xs font-medium">DELIVERY</span>
                            </div>
                            <div className="font-semibold capitalize">{order.delivery_status || 'Pending'}</div>
                            {order.courier_name && (
                              <div className="text-sm text-muted-foreground mt-1">{order.courier_name}</div>
                            )}
                            {order.tracking_id && (
                              <div className="text-xs text-muted-foreground mt-1 font-mono">
                                {order.tracking_id}
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <MapPin className="h-4 w-4" />
                              <span className="text-xs font-medium">SHIP TO</span>
                            </div>
                            <div className="font-semibold text-sm">{shippingAddress.city}</div>
                            <div className="text-sm text-muted-foreground">{shippingAddress.state}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              PIN: {shippingAddress.pincode || shippingAddress.zipCode}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t pt-4 space-y-6">
                          {/* Complete Customer Information */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Complete Customer Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-3 gap-6">
                                <div>
                                  <Label className="text-muted-foreground">Full Name</Label>
                                  <div className="font-medium text-lg mt-1">{order.user_name}</div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Email Address</Label>
                                  <div className="font-medium mt-1 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {order.user_email || 'Not provided'}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Phone Number</Label>
                                  <div className="font-medium mt-1 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {order.user_phone}
                                  </div>
                                </div>
                              </div>

                              {analytics && (
                                <div className="mt-6 pt-6 border-t">
                                  <Label className="text-muted-foreground mb-3 block">Customer Analytics</Label>
                                  <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-muted p-4 rounded-lg">
                                      <div className="text-2xl font-bold text-primary">{analytics.total_orders}</div>
                                      <div className="text-xs text-muted-foreground mt-1">Total Orders</div>
                                    </div>
                                    <div className="bg-muted p-4 rounded-lg">
                                      <div className="text-2xl font-bold text-primary">₹{Number(analytics.total_spent).toFixed(0)}</div>
                                      <div className="text-xs text-muted-foreground mt-1">Total Spent</div>
                                    </div>
                                    <div className="bg-muted p-4 rounded-lg">
                                      <div className="text-2xl font-bold text-primary">₹{Number(analytics.average_order_value).toFixed(0)}</div>
                                      <div className="text-xs text-muted-foreground mt-1">Avg Order Value</div>
                                    </div>
                                    <div className="bg-muted p-4 rounded-lg">
                                      <div className="text-sm font-medium">
                                        {analytics.last_order_date ? new Date(analytics.last_order_date).toLocaleDateString() : 'N/A'}
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1">Last Order</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Complete Product Breakdown */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Complete Product Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg bg-muted/30">
                                    <div className="flex-1">
                                      <div className="font-semibold text-lg">{item.name}</div>
                                      {item.weight && (
                                        <div className="text-sm text-muted-foreground mt-1">
                                          <span className="font-medium">Weight:</span> {item.weight}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-4 mt-2">
                                        <div className="bg-primary/10 px-3 py-1 rounded">
                                          <span className="text-xs text-muted-foreground">Quantity</span>
                                          <div className="font-bold text-primary">{item.quantity}</div>
                                        </div>
                                        <div className="bg-primary/10 px-3 py-1 rounded">
                                          <span className="text-xs text-muted-foreground">Unit Price</span>
                                          <div className="font-bold text-primary">₹{(parseFloat(item.price) / item.quantity).toFixed(2)}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-muted-foreground mb-1">Line Total</div>
                                      <div className="text-2xl font-bold text-primary">₹{item.price}</div>
                                    </div>
                                  </div>
                                ))}
                                
                                {/* Order Summary */}
                                <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4 mt-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="text-sm text-muted-foreground">Order Total</div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {itemsTotal} {itemsTotal === 1 ? 'item' : 'items'} • {Array.isArray(order.items) ? order.items.length : 0} {Array.isArray(order.items) && order.items.length === 1 ? 'product' : 'products'}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-3xl font-bold text-primary">₹{Number(order.total_amount).toFixed(2)}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Complete Payment Information */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Complete Payment Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <Label className="text-muted-foreground">Payment Method</Label>
                                  <div className="font-semibold text-lg mt-1">{order.payment_method?.toUpperCase() || 'UPI'}</div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Payment Status</Label>
                                  <div className="mt-1">
                                    <Badge 
                                      variant={order.payment_status === 'completed' ? 'default' : 'secondary'}
                                      className="text-sm px-3 py-1"
                                    >
                                      {order.payment_status === 'completed' ? '✓ Payment Completed' : 'Payment Pending'}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Amount Paid</Label>
                                  <div className="font-bold text-2xl text-primary mt-1">₹{Number(order.total_amount).toFixed(2)}</div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Transaction Date</Label>
                                  <div className="font-medium mt-1">{new Date(order.created_at).toLocaleString()}</div>
                                </div>
                                {order.razorpay_payment_id && (
                                  <div className="col-span-2">
                                    <Label className="text-muted-foreground">Razorpay Payment ID</Label>
                                    <div className="font-mono text-sm bg-muted p-3 rounded mt-1">{order.razorpay_payment_id}</div>
                                  </div>
                                )}
                                {order.razorpay_order_id && (
                                  <div className="col-span-2">
                                    <Label className="text-muted-foreground">Razorpay Order ID</Label>
                                    <div className="font-mono text-sm bg-muted p-3 rounded mt-1">{order.razorpay_order_id}</div>
                                  </div>
                                )}
                                {order.payment_id && (
                                  <div className="col-span-2">
                                    <Label className="text-muted-foreground">Payment Reference ID</Label>
                                    <div className="font-mono text-sm bg-muted p-3 rounded mt-1">{order.payment_id}</div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Complete Delivery & Tracking Information */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Complete Delivery Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {/* Shipping Address */}
                              <div>
                                <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                                  <MapPin className="h-4 w-4" />
                                  Complete Shipping Address
                                </Label>
                                <div className="bg-muted p-4 rounded-lg border-2">
                                  <div className="space-y-2">
                                    <div className="font-semibold text-lg">
                                      {shippingAddress.streetAddress || shippingAddress.address}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{shippingAddress.city},</span>
                                      <span className="font-medium">{shippingAddress.state}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">PIN Code:</span>
                                        <span className="font-bold ml-2">{shippingAddress.pincode || shippingAddress.zipCode}</span>
                                      </div>
                                      {shippingAddress.country && (
                                        <div>
                                          <span className="text-muted-foreground">Country:</span>
                                          <span className="font-medium ml-2">{shippingAddress.country}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Delivery Tracking */}
                              <div>
                                <Label className="text-muted-foreground mb-3 block">Delivery Tracking & Management</Label>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label>Courier Service</Label>
                                    <Input
                                      placeholder="e.g., Blue Dart, DTDC"
                                      defaultValue={order.courier_name || ''}
                                      onBlur={(e) => {
                                        supabase.from('orders').update({ courier_name: e.target.value }).eq('id', order.id);
                                      }}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label>Tracking Number</Label>
                                    <Input
                                      placeholder="Enter tracking ID"
                                      defaultValue={order.tracking_id || ''}
                                      onBlur={(e) => {
                                        supabase.from('orders').update({ tracking_id: e.target.value }).eq('id', order.id);
                                      }}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label>Current Delivery Status</Label>
                                    <Select
                                      defaultValue={order.delivery_status || 'pending'}
                                      onValueChange={(value) => {
                                        supabase.from('orders').update({ delivery_status: value }).eq('id', order.id);
                                      }}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">📦 Pending</SelectItem>
                                        <SelectItem value="picked">✅ Picked Up</SelectItem>
                                        <SelectItem value="in_transit">🚚 In Transit</SelectItem>
                                        <SelectItem value="out_for_delivery">🏃 Out for Delivery</SelectItem>
                                        <SelectItem value="delivered">✓ Delivered</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              {/* Delivery Dates */}
                              <div className="grid grid-cols-2 gap-4">
                                {order.estimated_delivery_date && (
                                  <div className="bg-muted p-4 rounded-lg">
                                    <Label className="text-muted-foreground text-xs">Estimated Delivery Date</Label>
                                    <div className="font-semibold text-lg mt-1">
                                      {new Date(order.estimated_delivery_date).toLocaleDateString('en-IN', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </div>
                                  </div>
                                )}
                                {order.actual_delivery_date && (
                                  <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
                                    <Label className="text-muted-foreground text-xs">Actual Delivery Date</Label>
                                    <div className="font-semibold text-lg mt-1 text-primary">
                                      {new Date(order.actual_delivery_date).toLocaleDateString('en-IN', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Order Notes & Additional Information */}
                          {order.order_notes && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">Order Notes & Special Instructions</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
                                  <div className="whitespace-pre-wrap">{order.order_notes}</div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Order Management Actions */}
                          <Card className="bg-muted/50">
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-base font-semibold">Update Order Status</Label>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Change the overall order status to keep customer informed
                                  </div>
                                </div>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => handleStatusChange(order.id, value)}
                                >
                                  <SelectTrigger className="w-48">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">⏳ Pending</SelectItem>
                                    <SelectItem value="processing">⚙️ Processing</SelectItem>
                                    <SelectItem value="shipped">📦 Shipped</SelectItem>
                                    <SelectItem value="delivered">✅ Delivered</SelectItem>
                                    <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
