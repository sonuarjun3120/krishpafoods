
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Mail, Ban } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSupabaseAnalytics, UserAnalytics } from '@/hooks/useSupabaseAnalytics';

export const UserManagement = () => {
  const { userAnalytics, loading, updateUserStatus } = useSupabaseAnalytics();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAnalytics | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const filteredUsers = userAnalytics.filter(user =>
    (user.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUserStatus = async (userEmail: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    await updateUserStatus(userEmail, newStatus as 'active' | 'blocked');
  };

  const handleViewUser = (user: UserAnalytics) => {
    setSelectedUser(user);
    setShowUserDetails(true);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Users: {userAnalytics.length}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Accounts</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {userAnalytics.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.user_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id.slice(0, 8)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{user.user_email}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{user.user_phone || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(user.signup_date).toLocaleDateString()}</TableCell>
                    <TableCell>{user.total_orders}</TableCell>
                    <TableCell>₹{Number(user.total_spent).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.user_email, user.status)}
                          className={user.status === 'active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details: {selectedUser?.user_name || 'Unknown'}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Personal Information</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div><span className="font-medium">Email:</span> {selectedUser.user_email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedUser.user_phone || 'N/A'}</div>
                    <div><span className="font-medium">Join Date:</span> {new Date(selectedUser.signup_date).toLocaleDateString()}</div>
                    <div><span className="font-medium">Last Order:</span> {selectedUser.last_order_date ? new Date(selectedUser.last_order_date).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Purchase History</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div><span className="font-medium">Total Orders:</span> {selectedUser.total_orders}</div>
                    <div><span className="font-medium">Total Spent:</span> ₹{Number(selectedUser.total_spent).toFixed(2)}</div>
                    <div><span className="font-medium">Average Order:</span> ₹{selectedUser.total_orders > 0 ? (Number(selectedUser.total_spent) / selectedUser.total_orders).toFixed(2) : '0.00'}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge variant={selectedUser.status === 'active' ? 'default' : 'destructive'} className="ml-2">
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
