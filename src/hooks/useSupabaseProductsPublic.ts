
import { useState, useEffect } from 'react';
import { supabaseContentService, Product } from '@/services/supabaseContentService';

export const useSupabaseProductsPublic = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await supabaseContentService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const getFeaturedProducts = async () => {
    const data = await supabaseContentService.getFeaturedProducts();
    return data;
  };

  const getProduct = async (id: number) => {
    const data = await supabaseContentService.getProduct(id);
    return data;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    getFeaturedProducts,
    getProduct
  };
};
