import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  order_number?: string;
  user_name: string;
  user_email?: string;
  user_phone: string;
  total_amount: number;
  status: string;
  payment_status?: string;
  payment_method?: string;
  payment_id?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  delivery_status?: string;
  courier_name?: string;
  tracking_id?: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  shipping_address: any;
  items: any;
  order_notes?: string;
  created_at: string;
  updated_at: string;
}

export const useRealtimeOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as Order, ...prev]);
            toast({
              title: "New Order Received",
              description: `Order #${(payload.new as Order).order_number || 'N/A'}`,
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

  return { orders, loading, refreshOrders: fetchOrders };
};
