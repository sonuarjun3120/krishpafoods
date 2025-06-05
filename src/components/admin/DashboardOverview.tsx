
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useSupabaseAnalytics } from '@/hooks/useSupabaseAnalytics';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useSupabaseOrders } from '@/hooks/useSupabaseOrders';

export const DashboardOverview = () => {
  const { salesData, userAnalytics, loading: analyticsLoading } = useSupabaseAnalytics();
  const { products, loading: productsLoading } = useSupabaseProducts();
  const { orders, loading: ordersLoading } = useSupabaseOrders();

  const loading = analyticsLoading || productsLoading || ordersLoading;

  // Get recent orders for activity feed
  const recentOrders = React.useMemo(() => {
    return orders
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        customerName: order.user_name,
        action: `Order #${order.id.slice(0, 8)} ${order.status}`,
        time: new Date(order.created_at).toLocaleString()
      }));
  }, [orders]);

  // Calculate low stock products
  const lowStockProducts = React.useMemo(() => {
    return products.filter(product => (product.stock || 0) < 10).length;
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalRevenue = salesData?.total_revenue || 0;
  const totalOrders = salesData?.total_orders || 0;
  const totalCustomers = salesData?.new_customers || 0;
  const totalProducts = products.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Live data from Supabase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Real-time order tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Unique customers registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products in catalog
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData?.monthly_sales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8B4513" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData?.monthly_sales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="customers" stroke="#8B4513" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockProducts > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-3" />
                <div>
                  <p className="font-medium">Low Stock Alert</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lowStockProducts} products are running low on stock
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Real-time Updates</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dashboard connected to live Supabase data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((activity, index) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {activity.customerName} - {new Date(activity.time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
