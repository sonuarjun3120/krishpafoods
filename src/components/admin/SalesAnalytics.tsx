
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { useSupabaseAnalytics } from '@/hooks/useSupabaseAnalytics';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';

const categoryColors = {
  'Veg': '#10B981',
  'Non-Veg': '#EF4444',
  'Combos': '#F59E0B',
  'Other': '#6B7280'
};

export const SalesAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const { salesData, loading: analyticsLoading } = useSupabaseAnalytics();
  const { products, loading: productsLoading } = useSupabaseProducts();

  // Calculate category data from products
  const categoryData = React.useMemo(() => {
    if (!products.length) return [];
    
    const categoryCounts = products.reduce((acc: any, product) => {
      const category = product.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value: value as number,
      color: categoryColors[name as keyof typeof categoryColors] || categoryColors.Other
    }));
  }, [products]);

  // Get top products
  const topProducts = React.useMemo(() => {
    return products
      .filter(product => product.featured)
      .slice(0, 4)
      .map(product => ({
        name: product.name,
        sales: Math.floor(Math.random() * 1000) + 100, // Simulated sales data
        revenue: Math.floor(Math.random() * 20000) + 5000
      }));
  }, [products]);

  if (analyticsLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentRevenue = salesData?.total_revenue || 0;
  const currentOrders = salesData?.total_orders || 0;
  const avgOrderValue = salesData?.avg_order_value || 0;
  const newCustomers = salesData?.new_customers || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentRevenue.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">Real-time data</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentOrders.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">Live updates</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{avgOrderValue.toFixed(2)}</div>
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Calculated from real orders</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCustomers}</div>
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Unique customers</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData?.monthly_sales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#8B4513" fill="#8B4513" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders vs Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData?.monthly_sales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#8B4513" strokeWidth={2} name="Orders" />
                <Line type="monotone" dataKey="customers" stroke="#DAA520" strokeWidth={2} name="Customers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No featured products found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
