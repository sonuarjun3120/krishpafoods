
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, FolderTree, Search, Package, Upload, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useRealtimeCategories, Category } from '@/hooks/useRealtimeCategories';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const CategoryManagement = () => {
  const { categories, loading } = useRealtimeCategories();
  const { products } = useSupabaseProducts();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    icon: 'Package',
    image: ''
  });
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  // Calculate product count per category
  useEffect(() => {
    if (products && categories) {
      const stats: Record<string, number> = {};
      categories.forEach(category => {
        stats[category.name] = products.filter(product => 
          product.category === category.name
        ).length;
      });
      setCategoryStats(stats);
    }
  }, [products, categories]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', icon: 'Package', image: '' });
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'Package',
      image: category.image || ''
    });
    setShowForm(true);
  };

  const handleDeleteCategory = async (id: string, categoryName: string) => {
    const productCount = categoryStats[categoryName] || 0;
    const confirmMessage = productCount > 0 
      ? `This category has ${productCount} products. Are you sure you want to delete it? Products will become uncategorized.`
      : 'Are you sure you want to delete this category?';
      
    if (confirm(confirmMessage)) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Category Deleted",
          description: "Category has been removed successfully",
        });
      }
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim(),
            icon: formData.icon,
            image: formData.image.trim()
          })
          .eq('id', editingCategory.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name.trim(),
            description: formData.description.trim(),
            icon: formData.icon,
            image: formData.image.trim()
          });
        
        if (error) throw error;
      }

      setShowForm(false);
      setFormData({ name: '', description: '', icon: 'Package', image: '' });
      toast({
        title: "Success",
        description: editingCategory ? "Category updated successfully" : "Category created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Category Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage product categories ({categories.length} total)
          </p>
        </div>
        <Button onClick={handleAddCategory} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <FolderTree className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                {searchTerm ? (
                  <p className="text-gray-500">No categories found matching "{searchTerm}"</p>
                ) : (
                  <p className="text-gray-500">No categories found. Create your first category!</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-0">
                {/* Category Image */}
                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FolderTree className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                    <Button variant="secondary" size="sm" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Category Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      <Package className="h-3 w-3" />
                      {categoryStats[category.name] || 0}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {category.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Icon: {category.icon || 'Package'}</span>
                    <span>{categoryStats[category.name] || 0} products</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <select
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="Package">Package</option>
                <option value="Salad">Salad</option>
                <option value="Beef">Beef</option>
                <option value="FolderTree">FolderTree</option>
                <option value="ShoppingCart">ShoppingCart</option>
                <option value="Coffee">Coffee</option>
                <option value="Cookie">Cookie</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Category Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/category-image.jpg"
              />
              <p className="text-xs text-gray-500">
                Recommended size: 400x300px. Use high-quality images for better display.
              </p>
              {formData.image && (
                <div className="mt-2">
                  <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('bg-gray-100');
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
