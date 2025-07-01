import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Product } from '@/services/supabaseContentService';
import { useCategories } from '@/hooks/useCategories';

interface SupabaseProductFormProps {
  product?: Product | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

export const SupabaseProductForm = ({ product, onSave, onCancel }: SupabaseProductFormProps) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    image: '',
    additional_images: [] as string[],
    category: '',
    featured: false,
    spiceLevel: 'Medium',
    shelfLife: '6 months',
    ingredients: [] as string[],
    servingSuggestions: [] as string[],
    pricing: [] as Array<{ weight: string; price: number }>,
    stock: 0,
    status: 'active'
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newSuggestion, setNewSuggestion] = useState('');
  const [newPricing, setNewPricing] = useState({ weight: '', price: 0 });

  useEffect(() => {
    if (product) {
      // Convert pricing format if needed
      let convertedPricing = [];
      if (product.pricing && Array.isArray(product.pricing)) {
        convertedPricing = product.pricing;
      } else if (product.pricing && typeof product.pricing === 'object') {
        convertedPricing = Object.entries(product.pricing).map(([weight, price]) => ({
          weight,
          price: Number(price) || 0
        }));
      } else {
        convertedPricing = [{ weight: "250g", price: 0 }];
      }

      setFormData({
        name: product.name || '',
        description: product.description || '',
        longDescription: product.longDescription || '',
        image: product.image || '',
        additional_images: product.additional_images || [],
        category: product.category || '',
        featured: product.featured || false,
        spiceLevel: product.spiceLevel || 'Medium',
        shelfLife: product.shelfLife || '6 months',
        ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
        servingSuggestions: Array.isArray(product.servingSuggestions) ? product.servingSuggestions : [],
        pricing: convertedPricing,
        stock: product.stock || 0,
        status: product.status || 'active'
      });
    }
  }, [product]);

  const addAdditionalImage = () => {
    if (newImageUrl.trim() && formData.additional_images.length < 2) {
      setFormData(prev => ({
        ...prev,
        additional_images: [...prev.additional_images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addSuggestion = () => {
    if (newSuggestion.trim()) {
      setFormData(prev => ({
        ...prev,
        servingSuggestions: [...prev.servingSuggestions, newSuggestion.trim()]
      }));
      setNewSuggestion('');
    }
  };

  const removeSuggestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      servingSuggestions: prev.servingSuggestions.filter((_, i) => i !== index)
    }));
  };

  const addPricing = () => {
    if (newPricing.weight.trim() && newPricing.price > 0) {
      setFormData(prev => ({
        ...prev,
        pricing: [...prev.pricing, { ...newPricing }]
      }));
      setNewPricing({ weight: '', price: 0 });
    }
  };

  const removePricing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.image.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.pricing.length === 0) {
      alert('Please add at least one pricing option');
      return;
    }

    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Main Image URL *</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Images (Max 2)</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/additional-image.jpg"
                disabled={formData.additional_images.length >= 2}
              />
              <Button 
                type="button" 
                onClick={addAdditionalImage}
                disabled={!newImageUrl.trim() || formData.additional_images.length >= 2}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.additional_images.map((url, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-2">
                  Additional Image {index + 1}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeAdditionalImage(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spiceLevel">Spice Level</Label>
              <Select 
                value={formData.spiceLevel} 
                onValueChange={(value) => setFormData({ ...formData, spiceLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Add ingredient"
            />
            <Button type="button" onClick={addIngredient} disabled={!newIngredient.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-2">
                {ingredient}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeIngredient(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Serving Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Serving Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              placeholder="Add serving suggestion"
            />
            <Button type="button" onClick={addSuggestion} disabled={!newSuggestion.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.servingSuggestions.map((suggestion, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-2">
                {suggestion}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeSuggestion(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newPricing.weight}
              onChange={(e) => setNewPricing({ ...newPricing, weight: e.target.value })}
              placeholder="Weight (e.g., 250g)"
              className="flex-1"
            />
            <Input
              type="number"
              value={newPricing.price}
              onChange={(e) => setNewPricing({ ...newPricing, price: parseFloat(e.target.value) || 0 })}
              placeholder="Price"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={addPricing} 
              disabled={!newPricing.weight.trim() || newPricing.price <= 0}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.pricing.map((price, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{price.weight} - ₹{price.price}</span>
                <X 
                  className="h-4 w-4 cursor-pointer text-red-500" 
                  onClick={() => removePricing(index)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};
