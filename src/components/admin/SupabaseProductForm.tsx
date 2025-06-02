
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/services/supabaseContentService';

interface SupabaseProductFormProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

export const SupabaseProductForm: React.FC<SupabaseProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    longDescription: product?.longDescription || '',
    price: product?.price || 0,
    image: product?.image || '',
    category: product?.category || '',
    featured: product?.featured || false,
    spiceLevel: product?.spiceLevel || 'Medium',
    shelfLife: product?.shelfLife || '',
    status: product?.status || 'active',
    stock: product?.stock || 0,
    ingredients: product?.ingredients ? product.ingredients.join(', ') : '',
    servingSuggestions: product?.servingSuggestions ? product.servingSuggestions.join(', ') : '',
    pricing: product?.pricing ? JSON.stringify(product.pricing) : '{"250g": 8.99, "500g": 15.99, "1kg": 28.99}',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData: Partial<Product> = {
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription,
        price: parseFloat(formData.price.toString()),
        image: formData.image,
        category: formData.category,
        featured: formData.featured,
        spiceLevel: formData.spiceLevel,
        shelfLife: formData.shelfLife,
        status: formData.status,
        stock: parseInt(formData.stock.toString()),
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(item => item.trim()) : [],
        servingSuggestions: formData.servingSuggestions ? formData.servingSuggestions.split(',').map(item => item.trim()) : [],
        pricing: formData.pricing ? JSON.parse(formData.pricing) : { '250g': formData.price },
      };
      
      onSave(productData);
    } catch (error) {
      console.error('Error parsing JSON fields:', error);
      alert('Please check your JSON formatting in the pricing field.');
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Product Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Brief description for product cards"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Detailed Description</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={4}
              placeholder="Detailed description for product detail page"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Product Image URL *</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
        </div>

        {/* Category and Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Category & Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vegetable Pickles">Vegetable Pickles</SelectItem>
                  <SelectItem value="Fruit Pickles">Fruit Pickles</SelectItem>
                  <SelectItem value="Citrus Pickles">Citrus Pickles</SelectItem>
                  <SelectItem value="Spice Blends">Spice Blends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                placeholder="Available quantity"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricing">Pricing (JSON format) *</Label>
            <Textarea
              id="pricing"
              value={formData.pricing}
              onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
              placeholder='{"250g": 8.99, "500g": 15.99, "1kg": 28.99}'
              rows={3}
            />
            <p className="text-xs text-gray-500">Define prices for different weights/sizes</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
          
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="Mango, Salt, Red Chili Powder, Mustard Oil, Fenugreek"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="servingSuggestions">Serving Suggestions (comma-separated)</Label>
            <Textarea
              id="servingSuggestions"
              value={formData.servingSuggestions}
              onChange={(e) => setFormData({ ...formData, servingSuggestions: e.target.value })}
              placeholder="Serve with rice, Mix with curd, Pair with roti"
              rows={2}
            />
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
            <Label htmlFor="featured">Featured Product (Display on homepage)</Label>
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
    </div>
  );
};
