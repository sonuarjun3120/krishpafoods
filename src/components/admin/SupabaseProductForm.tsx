
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { Product } from '@/services/supabaseContentService';
import { useCategories } from '@/hooks/useCategories';

interface SupabaseProductFormProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

interface CustomSize {
  size: string;
  price: number;
}

export const SupabaseProductForm: React.FC<SupabaseProductFormProps> = ({ product, onSave, onCancel }) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    longDescription: product?.longDescription || '',
    category: product?.category || '',
    featured: product?.featured || false,
    spiceLevel: product?.spiceLevel || 'Medium',
    shelfLife: product?.shelfLife || '',
    status: product?.status || 'active',
    stock: product?.stock || 0,
    ingredients: product?.ingredients ? (Array.isArray(product.ingredients) ? product.ingredients.join(', ') : '') : '',
    servingSuggestions: product?.servingSuggestions ? (Array.isArray(product.servingSuggestions) ? product.servingSuggestions.join(', ') : '') : '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [customSizes, setCustomSizes] = useState<CustomSize[]>([
    { size: '250g', price: 0 },
    { size: '500g', price: 0 },
    { size: '1kg', price: 0 }
  ]);

  // Extract images and pricing from product data
  useEffect(() => {
    if (product) {
      // Handle main image and additional images
      const productImages = [];
      if (product.image) {
        productImages.push(product.image);
      }
      
      // Add additional images if they exist
      if (product.additional_images && Array.isArray(product.additional_images)) {
        productImages.push(...product.additional_images);
      }
      
      setImages(productImages);

      // Extract pricing data and convert to custom sizes
      if (product.pricing && typeof product.pricing === 'object') {
        const extractedSizes: CustomSize[] = [];
        Object.entries(product.pricing).forEach(([size, price]) => {
          extractedSizes.push({
            size: size,
            price: Number(price) || 0
          });
        });
        
        if (extractedSizes.length > 0) {
          setCustomSizes(extractedSizes);
        }
      }
    }
  }, [product]);

  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addCustomSize = () => {
    setCustomSizes([...customSizes, { size: '', price: 0 }]);
  };

  const updateCustomSize = (index: number, field: 'size' | 'price', value: string | number) => {
    const updated = [...customSizes];
    updated[index] = { ...updated[index], [field]: value };
    setCustomSizes(updated);
  };

  const removeCustomSize = (index: number) => {
    setCustomSizes(customSizes.filter((_, i) => i !== index));
  };

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

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    if (images.length === 0) {
      alert('At least one product image is required');
      return;
    }

    // Validate custom sizes
    const validSizes = customSizes.filter(size => size.size.trim() && size.price > 0);
    if (validSizes.length === 0) {
      alert('Please add at least one valid size with price');
      return;
    }

    try {
      // Create pricing object from custom sizes
      const pricing: { [key: string]: number } = {};
      validSizes.forEach(size => {
        pricing[size.size.trim()] = size.price;
      });

      const productData: Partial<Product> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        longDescription: formData.longDescription.trim(),
        image: images[0], // Main image (first one)
        additional_images: images.length > 1 ? images.slice(1) : [], // Additional images
        category: formData.category,
        featured: formData.featured,
        spiceLevel: formData.spiceLevel,
        shelfLife: formData.shelfLife.trim(),
        status: formData.status,
        stock: parseInt(formData.stock.toString()) || 0,
        pricing: pricing,
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
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
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
        </CardContent>
      </Card>

      {/* Custom Sizes and Pricing */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sizes and Pricing (₹)</CardTitle>
            <Button type="button" onClick={addCustomSize} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Size
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customSizes.map((size, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Size (e.g., 250g, 500g, 1kg)"
                    value={size.size}
                    onChange={(e) => updateCustomSize(index, 'size', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    min="0"
                    value={size.price}
                    onChange={(e) => updateCustomSize(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                {customSizes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomSize(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Images - Updated to support multiple images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images (Up to 3 images supported)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Add Image URL</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button 
                type="button" 
                onClick={addImage} 
                variant="outline"
                disabled={images.length >= 3}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {images.length >= 3 && (
              <p className="text-sm text-gray-500">Maximum 3 images allowed</p>
            )}
          </div>

          {images.length > 0 && (
            <div className="space-y-2">
              <Label>Current Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
            />
            <Label htmlFor="featured">Featured Product (will appear on homepage)</Label>
          </div>
        </CardContent>
      </Card>
      
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
