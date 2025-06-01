
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  productCount: number;
}

const mockCategories: Category[] = [
  { id: '1', name: 'Spices', description: 'All types of spices and seasonings', productCount: 25 },
  { id: '2', name: 'Grains', description: 'Rice, wheat, and other grains', productCount: 15 },
  { id: '3', name: 'Oils', description: 'Cooking oils and ghee', productCount: 8 },
  { id: '4', name: 'Garam Masala', description: 'Premium spice blends', parentId: '1', productCount: 5 },
];

export const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', parentId: '' });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', parentId: '' });
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      parentId: category.parentId || ''
    });
    setShowForm(true);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id && c.parentId !== id));
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c =>
        c.id === editingCategory.id
          ? { ...c, ...formData, parentId: formData.parentId || undefined }
          : c
      ));
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        parentId: formData.parentId || undefined,
        productCount: 0
      };
      setCategories([...categories, newCategory]);
    }
    setShowForm(false);
  };

  const renderCategories = (parentId?: string, level = 0) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(category => (
        <div key={category.id}>
          <Card className={`mb-2 ${level > 0 ? 'ml-8' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FolderTree className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                    <p className="text-xs text-gray-500">{category.productCount} products</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {renderCategories(category.id, level + 1)}
        </div>
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Category Management</h1>
        <Button onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="space-y-4">
        {renderCategories()}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category (optional)</Label>
              <select
                id="parent"
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">No parent (root category)</option>
                {categories
                  .filter(cat => !cat.parentId && cat.id !== editingCategory?.id)
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
              </select>
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
