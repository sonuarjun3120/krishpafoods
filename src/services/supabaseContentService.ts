
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
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

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: any;
  status: 'published' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  folder?: string;
  alt_text?: string;
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
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
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

  async updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating category:', error);
      return false;
    }
    return true;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }
    return true;
  },

  // Pages
  async getPages(): Promise<PageContent[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
    return data || [];
  },

  async getPage(slug: string): Promise<PageContent | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    
    if (error) {
      console.error('Error fetching page:', error);
      return null;
    }
    return data;
  },

  async createPage(page: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>): Promise<PageContent | null> {
    const { data, error } = await supabase
      .from('pages')
      .insert([page])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating page:', error);
      return null;
    }
    return data;
  },

  async updatePage(id: string, updates: Partial<PageContent>): Promise<boolean> {
    const { error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating page:', error);
      return false;
    }
    return true;
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching media:', error);
      return [];
    }
    return data || [];
  },

  async uploadMedia(file: File, folder: string = 'general'): Promise<MediaItem | null> {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    
    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
    
    // Save media record to database
    const mediaRecord = {
      name: file.name,
      url: publicUrl,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      folder: folder,
      alt_text: file.name
    };
    
    const { data, error } = await supabase
      .from('media')
      .insert([mediaRecord])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving media record:', error);
      return null;
    }
    return data;
  },

  async deleteMedia(id: string): Promise<boolean> {
    // First get the media item to get the file path
    const { data: mediaItem, error: fetchError } = await supabase
      .from('media')
      .select('url')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching media item:', fetchError);
      return false;
    }
    
    // Extract file path from URL
    const urlParts = mediaItem.url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folderName = urlParts[urlParts.length - 2];
    const filePath = `${folderName}/${fileName}`;
    
    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([filePath]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }
    
    // Delete media record from database
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting media record:', error);
      return false;
    }
    return true;
  }
};
