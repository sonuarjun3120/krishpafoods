
import { useState, useEffect } from 'react';
import { supabaseContentService, Product } from '@/services/supabaseContentService';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    const data = await supabaseContentService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct = await supabaseContentService.createProduct(productData);
    if (newProduct) {
      await fetchProducts();
      toast({
        title: "Product Created",
        description: "Product has been created successfully",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    const success = await supabaseContentService.updateProduct(id, updates);
    if (success) {
      await fetchProducts();
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProduct = async (id: number) => {
    const success = await supabaseContentService.deleteProduct(id);
    if (success) {
      await fetchProducts();
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts
  };
};
