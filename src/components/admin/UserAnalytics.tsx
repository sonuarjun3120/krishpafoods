import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Eye, User as UserIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { userService, User } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userData = await userService.getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.phone?.includes(searchTerm) || '')
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const downloadCSV = () => {
    const csvHeader = 'Name,Email,Phone,Total Orders,Total Reviews,Join Date\n';
    const csvData = filteredUsers.map(user => 
      `"${user.name || 'N/A'}","${user.email || 'N/A'}","${user.phone || 'N/A'}","${user.ordered_product_ids?.length || 0}","${user.reviewed_product_ids?.length || 0}","${new Date(user.created_at || '').toLocaleDateString()}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "User data downloaded successfully",
    });
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
          Total Users: {users.length}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Customer Database
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={downloadCSV} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                  <TableHead>Reviews</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id.slice(0, 8)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{user.email || 'N/A'}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{user.phone || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(user.created_at || '').toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {user.ordered_product_ids?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.reviewed_product_ids?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
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
            <DialogTitle>User Details: {selectedUser?.name || 'Unknown'}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Personal Information</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedUser.name || 'N/A'}</div>
                    <div><span className="font-medium">Email:</span> {selectedUser.email || 'N/A'}</div>
                    <div><span className="font-medium">Phone:</span> {selectedUser.phone || 'N/A'}</div>
                    <div><span className="font-medium">Join Date:</span> {new Date(selectedUser.created_at || '').toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Activity Summary</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div><span className="font-medium">Total Orders:</span> {selectedUser.ordered_product_ids?.length || 0}</div>
                    <div><span className="font-medium">Total Reviews:</span> {selectedUser.reviewed_product_ids?.length || 0}</div>
                    <div><span className="font-medium">Last Update:</span> {new Date(selectedUser.updated_at || '').toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              {selectedUser.ordered_product_ids && selectedUser.ordered_product_ids.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Ordered Products</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.ordered_product_ids.map((productId, index) => (
                      <Badge key={index} variant="secondary">Product {productId}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedUser.reviewed_product_ids && selectedUser.reviewed_product_ids.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Reviewed Products</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.reviewed_product_ids.map((productId, index) => (
                      <Badge key={index} variant="outline">Product {productId}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};