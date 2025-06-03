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
  price?: number; // Add simple price field
  stock?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OTPVerification {
  id: string;
  user_id: string;
  email: string;
  otp_code: string;
  expires_at: string;
  verified?: boolean;
  created_at?: string;
}

export const supabaseContentService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data || [];
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      return null;
    }
    return data;
  },

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
    // Convert simple price to pricing object if price is provided
    let pricing = product.pricing;
    if (product.price && !pricing) {
      pricing = {
        "250g": product.price,
        "500g": Math.round(product.price * 1.8),
        "1kg": Math.round(product.price * 3.5)
      };
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        longDescription: product.longDescription || '',
        image: product.image,
        category: product.category || '',
        featured: product.featured || false,
        spiceLevel: product.spiceLevel || 'Medium',
        shelfLife: product.shelfLife || '',
        ingredients: product.ingredients || [],
        servingSuggestions: product.servingSuggestions || [],
        pricing: pricing || {},
        stock: product.stock || 0,
        status: product.status || 'active'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    return data;
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    // Convert simple price to pricing object if price is provided
    let pricing = updates.pricing;
    if (updates.price && !pricing) {
      pricing = {
        "250g": updates.price,
        "500g": Math.round(updates.price * 1.8),
        "1kg": Math.round(updates.price * 3.5)
      };
      updates.pricing = pricing;
    }

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
  },

  // Profile management
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }
    return true;
  },

  // OTP verification
  async createOTPVerification(otp: Omit<OTPVerification, 'id' | 'created_at'>): Promise<OTPVerification | null> {
    const { data, error } = await supabase
      .from('otp_verifications')
      .insert([otp])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating OTP verification:', error);
      return null;
    }
    return data;
  },

  async verifyOTP(userId: string, otpCode: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('user_id', userId)
      .eq('otp_code', otpCode)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (error || !data) {
      console.error('Invalid or expired OTP:', error);
      return false;
    }

    // Mark as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', data.id);

    return true;
  }
};
