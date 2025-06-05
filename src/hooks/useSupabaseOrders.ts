
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: string;
  payment_method?: string;
  order_notes?: string;
  items: any[];
  shipping_address: any;
  created_at: string;
  updated_at: string;
}

export const useSupabaseOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Set up real-time subscription for orders
    const channel = supabase
      .channel('admin-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('Order change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as Order, ...prev]);
            toast({
              title: "New Order",
              description: `Order from ${(payload.new as Order).user_name} received`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => 
              order.id === payload.new.id ? payload.new as Order : order
            ));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Order Updated",
      description: "Order status updated successfully",
    });
    return true;
  };

  return {
    orders,
    loading,
    updateOrderStatus,
    refreshOrders: fetchOrders
  };
};
