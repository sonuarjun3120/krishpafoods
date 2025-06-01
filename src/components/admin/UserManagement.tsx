
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Mail, Ban } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  lastLogin: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123',
    joinDate: '2023-01-15',
    totalOrders: 8,
    totalSpent: 245.50,
    status: 'active',
    lastLogin: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1-555-0124',
    joinDate: '2023-02-20',
    totalOrders: 12,
    totalSpent: 389.99,
    status: 'active',
    lastLogin: '2024-01-14'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1-555-0125',
    joinDate: '2023-03-10',
    totalOrders: 3,
    totalSpent: 89.25,
    status: 'blocked',
    lastLogin: '2024-01-10'
  },
];

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
        : user
    ));
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Users: {users.length}
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
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{user.email}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.totalOrders}</TableCell>
                  <TableCell>${user.totalSpent}</TableCell>
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
                        onClick={() => handleToggleUserStatus(user.id)}
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
        </CardContent>
      </Card>

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Personal Information</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedUser.phone}</div>
                    <div><span className="font-medium">Join Date:</span> {selectedUser.joinDate}</div>
                    <div><span className="font-medium">Last Login:</span> {selectedUser.lastLogin}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Purchase History</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div><span className="font-medium">Total Orders:</span> {selectedUser.totalOrders}</div>
                    <div><span className="font-medium">Total Spent:</span> ${selectedUser.totalSpent}</div>
                    <div><span className="font-medium">Average Order:</span> ${(selectedUser.totalSpent / selectedUser.totalOrders).toFixed(2)}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge variant={selectedUser.status === 'active' ? 'default' : 'destructive'} className="ml-2">
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Recent Orders</h3>
                <div className="border rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400">
                  Order history would be displayed here...
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
