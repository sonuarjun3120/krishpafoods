import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/services/supabaseContentService';
import { useCategories } from '@/hooks/useCategories';

interface SupabaseProductFormProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

export const SupabaseProductForm: React.FC<SupabaseProductFormProps> = ({ product, onSave, onCancel }) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    longDescription: product?.longDescription || '',
    image: product?.image || '',
    category: product?.category || '',
    featured: product?.featured || false,
    spiceLevel: product?.spiceLevel || 'Medium',
    shelfLife: product?.shelfLife || '',
    status: product?.status || 'active',
    stock: product?.stock || 0,
    price: 0,
    ingredients: product?.ingredients ? (Array.isArray(product.ingredients) ? product.ingredients.join(', ') : '') : '',
    servingSuggestions: product?.servingSuggestions ? (Array.isArray(product.servingSuggestions) ? product.servingSuggestions.join(', ') : '') : '',
  });

  // Extract price from pricing for editing
  useEffect(() => {
    if (product?.pricing && typeof product.pricing === 'object') {
      const prices = Object.values(product.pricing);
      if (prices.length > 0) {
        setFormData(prev => ({ ...prev, price: Number(prices[0]) || 0 }));
      }
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }

    if (!formData.description.trim()) {
      alert('Product description is required');
      return;
    }

    if (!formData.image.trim()) {
      alert('Product image URL is required');
      return;
    }

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    if (formData.price <= 0) {
      alert('Please enter a valid price greater than 0');
      return;
    }

    try {
      const productData: Partial<Product> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        longDescription: formData.longDescription.trim(),
        image: formData.image.trim(),
        category: formData.category,
        featured: formData.featured,
        spiceLevel: formData.spiceLevel,
        shelfLife: formData.shelfLife.trim(),
        status: formData.status,
        stock: parseInt(formData.stock.toString()) || 0,
        price: formData.price,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(item => item.trim()).filter(item => item) : [],
        servingSuggestions: formData.servingSuggestions ? formData.servingSuggestions.split(',').map(item => item.trim()).filter(item => item) : [],
      };
      
      console.log('Submitting product data:', productData);
      onSave(productData);
    } catch (error) {
      console.error('Error preparing product data:', error);
      alert('Please check your form data.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Base Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
              placeholder="Enter base price for 250g"
            />
            <p className="text-xs text-gray-500">
              This will create pricing for 250g, 500g (1.8x), and 1kg (3.5x)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                  <div className="p-2 text-sm text-gray-500">Loading categories...</div>
                ) : categories.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No categories available</div>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              placeholder="Enter stock quantity"
            />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spiceLevel">Spice Level</Label>
              <Select value={formData.spiceLevel} onValueChange={(value) => setFormData({ ...formData, spiceLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select spice level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mild">Mild</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hot">Hot</SelectItem>
                  <SelectItem value="Extra Hot">Extra Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shelfLife">Shelf Life</Label>
              <Input
                id="shelfLife"
                value={formData.shelfLife}
                onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                placeholder="e.g., 6 months"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Media</h3>
        <div className="space-y-2">
          <Label htmlFor="image">Image URL *</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            required
          />
          {formData.image && (
            <div className="mt-2">
              <img
                src={formData.image}
                alt="Preview"
                className="w-20 h-20 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Ingredients & Suggestions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Ingredients & Suggestions</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="Mango, Red Chili Powder, Mustard Oil, Salt, Turmeric"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="servingSuggestions">Serving Suggestions (comma separated)</Label>
            <Textarea
              id="servingSuggestions"
              value={formData.servingSuggestions}
              onChange={(e) => setFormData({ ...formData, servingSuggestions: e.target.value })}
              placeholder="Serve with rice, Mix with curd, Pair with roti"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
          />
          <Label htmlFor="featured">Featured Product (will appear on homepage)</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};
