
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Download } from 'lucide-react';
import { useSupabaseOrders, Order } from '@/hooks/useSupabaseOrders';

export const OrderManagement = () => {
  const { orders, loading, updateOrderStatus } = useSupabaseOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = !dateFilter || order.created_at.includes(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer Details</TableHead>
                  <TableHead>Shipping Address</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const shippingAddress = order.shipping_address || {};
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>#{order.id.slice(0, 8)}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{order.user_name}</div>
                          <div className="text-sm text-muted-foreground">{order.user_email || 'No email'}</div>
                          <div className="text-sm text-muted-foreground">{order.user_phone}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm max-w-48">
                          <div>{shippingAddress.streetAddress || shippingAddress.address}</div>
                          <div>{shippingAddress.city}, {shippingAddress.state}</div>
                          <div>{shippingAddress.pincode || shippingAddress.zipCode}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {order.payment_method?.toUpperCase() || 'UPI'}
                          </div>
                          <Badge 
                            variant={order.payment_status === 'completed' ? 'default' : 'secondary'}
                            className={order.payment_status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {order.payment_status === 'completed' ? 'Paid' : 'Pending'}
                          </Badge>
                          {order.razorpay_payment_id && (
                            <div className="text-xs text-muted-foreground">
                              ID: {order.razorpay_payment_id.slice(0, 10)}...
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {Array.isArray(order.items) ? order.items.length : 0} items
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Array.isArray(order.items) && order.items.slice(0, 2).map((item: any, index: number) => (
                              <div key={index}>{item.quantity}x {item.name}</div>
                            ))}
                            {Array.isArray(order.items) && order.items.length > 2 && (
                              <div>+{order.items.length - 2} more</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="font-medium">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </TableCell>
                      
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge variant={getStatusVariant(order.status)} className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
