
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserAnalytics {
  id: string;
  user_email: string;
  user_name?: string;
  user_phone?: string;
  total_orders: number;
  total_spent: number;
  last_order_date?: string;
  signup_date: string;
  status: 'active' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface SalesData {
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  new_customers: number;
  monthly_sales: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
}

export const useSupabaseAnalytics = () => {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserAnalytics = async () => {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .order('total_spent', { ascending: false });
    
    if (error) {
      console.error('Error fetching user analytics:', error);
    } else {
      // Cast the data to match our UserAnalytics interface
      const typedUserAnalytics = (data || []).map(user => ({
        ...user,
        status: user.status as UserAnalytics['status']
      })) as UserAnalytics[];
      setUserAnalytics(typedUserAnalytics);
    }
  };

  const fetchSalesData = async () => {
    // Get overall stats
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, created_at, user_email');

    if (ordersError) {
      console.error('Error fetching orders for analytics:', ordersError);
      return;
    }

    if (orders) {
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Get unique customers
      const uniqueCustomers = new Set(orders.map(order => order.user_email)).size;

      // Calculate monthly data
      const monthlyData = orders.reduce((acc: any, order) => {
        const month = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { month, revenue: 0, orders: 0, customers: new Set() };
        }
        acc[month].revenue += Number(order.total_amount);
        acc[month].orders += 1;
        acc[month].customers.add(order.user_email);
        return acc;
      }, {});

      const monthlySales = Object.values(monthlyData).map((data: any) => ({
        month: data.month,
        revenue: data.revenue,
        orders: data.orders,
        customers: data.customers.size
      }));

      setSalesData({
        total_revenue: totalRevenue,
        total_orders: totalOrders,
        avg_order_value: avgOrderValue,
        new_customers: uniqueCustomers,
        monthly_sales: monthlySales
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUserAnalytics(), fetchSalesData()]);
      setLoading(false);
    };

    fetchData();

    // Set up real-time subscriptions
    const ordersChannel = supabase
      .channel('admin-orders-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchSalesData();
        }
      )
      .subscribe();

    const analyticsChannel = supabase
      .channel('admin-user-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_analytics'
        },
        () => {
          fetchUserAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(analyticsChannel);
    };
  }, []);

  const updateUserStatus = async (email: string, status: 'active' | 'blocked') => {
    const { error } = await supabase
      .from('user_analytics')
      .update({ status })
      .eq('user_email', email);
    
    if (!error) {
      setUserAnalytics(prev => prev.map(user => 
        user.user_email === email ? { ...user, status } : user
      ));
    }
    
    return !error;
  };

  return {
    userAnalytics,
    salesData,
    loading,
    updateUserStatus,
    refreshData: () => {
      fetchUserAnalytics();
      fetchSalesData();
    }
  };
};
