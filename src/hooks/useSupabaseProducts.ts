
import { useState, useEffect } from 'react';
import { supabaseContentService, Product } from '@/services/supabaseContentService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

    // Set up real-time subscription for products
    const channel = supabase
      .channel('admin-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          console.log('Product change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Add new product to the list
            setProducts(prev => [payload.new as Product, ...prev]);
            toast({
              title: "New Product Added",
              description: `${(payload.new as Product).name} has been added`,
            });
          } else if (payload.eventType === 'UPDATE') {
            // Update existing product
            setProducts(prev => prev.map(product => 
              product.id === payload.new.id ? payload.new as Product : product
            ));
            toast({
              title: "Product Updated",
              description: `${(payload.new as Product).name} has been updated`,
            });
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted product
            setProducts(prev => prev.filter(product => product.id !== payload.old.id));
            toast({
              title: "Product Deleted",
              description: "Product has been deleted",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct = await supabaseContentService.createProduct(productData);
    if (newProduct) {
      // Real-time will handle the UI update
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
      // Real-time will handle the UI update
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
      // Real-time will handle the UI update
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
