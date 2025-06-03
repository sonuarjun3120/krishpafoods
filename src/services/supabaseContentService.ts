
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  image: string;
  category?: string;
  featured?: boolean;
  spiceLevel?: string;
  shelfLife?: string;
  ingredients?: any;
  servingSuggestions?: any;
  pricing?: any;
  stock?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const supabaseContentService = {
  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data || [];
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    return data || [];
  },

  async getProduct(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    return data;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    return data;
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product:', error);
      return false;
    }
    return true;
  },

  async deleteProduct(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    return true;
  }
};
