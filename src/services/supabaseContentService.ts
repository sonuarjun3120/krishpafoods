
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category?: string;
  featured?: boolean;
  spiceLevel: string;
  shelfLife: string;
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
  // Products - working with existing products table
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    // Transform the data to match our Product interface
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      longDescription: item.longDescription,
      price: parseFloat(item.pricing?.['250g']) || 0, // Extract price from pricing JSON
      image: item.image,
      category: 'Traditional Pickles', // Default category since we don't have this field yet
      featured: item.featured || false,
      spiceLevel: item.spiceLevel,
      shelfLife: item.shelfLife,
      ingredients: item.ingredients,
      servingSuggestions: item.servingSuggestions,
      pricing: item.pricing,
      created_at: item.created_at
    }));
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
    
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      longDescription: item.longDescription,
      price: parseFloat(item.pricing?.['250g']) || 0,
      image: item.image,
      category: 'Traditional Pickles',
      featured: item.featured || false,
      spiceLevel: item.spiceLevel,
      shelfLife: item.shelfLife,
      ingredients: item.ingredients,
      servingSuggestions: item.servingSuggestions,
      pricing: item.pricing,
      created_at: item.created_at
    }));
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
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      longDescription: data.longDescription,
      price: parseFloat(data.pricing?.['250g']) || 0,
      image: data.image,
      category: 'Traditional Pickles',
      featured: data.featured || false,
      spiceLevel: data.spiceLevel,
      shelfLife: data.shelfLife,
      ingredients: data.ingredients,
      servingSuggestions: data.servingSuggestions,
      pricing: data.pricing,
      created_at: data.created_at
    };
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    // Transform our Product interface back to database schema
    const dbProduct = {
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      image: product.image,
      featured: product.featured || false,
      spiceLevel: product.spiceLevel,
      shelfLife: product.shelfLife,
      ingredients: product.ingredients || [],
      servingSuggestions: product.servingSuggestions || [],
      pricing: product.pricing || { '250g': product.price }
    };

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      longDescription: data.longDescription,
      price: parseFloat(data.pricing?.['250g']) || 0,
      image: data.image,
      category: 'Traditional Pickles',
      featured: data.featured || false,
      spiceLevel: data.spiceLevel,
      shelfLife: data.shelfLife,
      ingredients: data.ingredients,
      servingSuggestions: data.servingSuggestions,
      pricing: data.pricing,
      created_at: data.created_at
    };
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    // Transform updates to match database schema
    const dbUpdates: any = {};
    
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.longDescription) dbUpdates.longDescription = updates.longDescription;
    if (updates.image) dbUpdates.image = updates.image;
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
    if (updates.spiceLevel) dbUpdates.spiceLevel = updates.spiceLevel;
    if (updates.shelfLife) dbUpdates.shelfLife = updates.shelfLife;
    if (updates.ingredients) dbUpdates.ingredients = updates.ingredients;
    if (updates.servingSuggestions) dbUpdates.servingSuggestions = updates.servingSuggestions;
    if (updates.pricing) dbUpdates.pricing = updates.pricing;

    const { error } = await supabase
      .from('products')
      .update(dbUpdates)
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

  // Placeholder methods for future features (when tables are created)
  async getCategories(): Promise<Category[]> {
    console.log('Categories table not yet created');
    return [];
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
    console.log('Categories table not yet created');
    return null;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
    console.log('Categories table not yet created');
    return false;
  },

  async deleteCategory(id: string): Promise<boolean> {
    console.log('Categories table not yet created');
    return false;
  },

  async getPages(): Promise<PageContent[]> {
    console.log('Pages table not yet created');
    return [];
  },

  async getPage(slug: string): Promise<PageContent | null> {
    console.log('Pages table not yet created');
    // Return default content for home page
    if (slug === 'home') {
      return {
        id: 'default-home',
        title: 'Home Page',
        slug: 'home',
        status: 'published',
        content: {
          heroTitle: 'A Taste of Tradition in Every Bite!',
          heroDescription: 'Authentic Telugu-style pickles made with traditional recipes from Andhra and Telangana. Handcrafted with love and the finest ingredients.',
          aboutTitle: 'Our Pickle Heritage',
          aboutDescription: 'Krishpa Homemade Pickles began in a small kitchen in Vijayawada, where our founder\'s grandmother perfected recipes that have been treasured for generations. Today, we continue this legacy using the same traditional methods, handpicking ingredients, and crafting each batch with care and love.'
        }
      };
    }
    return null;
  },

  async createPage(page: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>): Promise<PageContent | null> {
    console.log('Pages table not yet created');
    return null;
  },

  async updatePage(id: string, updates: Partial<PageContent>): Promise<boolean> {
    console.log('Pages table not yet created');
    return false;
  },

  async getMedia(): Promise<MediaItem[]> {
    console.log('Media table not yet created');
    return [];
  },

  async uploadMedia(file: File, folder: string = 'general'): Promise<MediaItem | null> {
    console.log('Media functionality not yet implemented');
    return null;
  },

  async deleteMedia(id: string): Promise<boolean> {
    console.log('Media table not yet created');
    return false;
  }
};
