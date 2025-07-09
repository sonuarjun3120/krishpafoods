import { supabase } from '@/integrations/supabase/client';

export interface ContentBlock {
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  button?: {
    text: string;
    link: string;
  };
  email?: string;
  phone?: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content_blocks: ContentBlock[];
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export const pageService = {
  async getAllPages(): Promise<Page[]> {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        content_blocks: typeof item.content_blocks === 'string' 
          ? JSON.parse(item.content_blocks) 
          : Array.isArray(item.content_blocks) 
            ? (item.content_blocks as unknown) as ContentBlock[]
            : [],
        status: item.status as 'published' | 'draft'
      })) as Page[];
    } catch (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
  },

  async getPageBySlug(slug: string): Promise<Page | null> {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data ? {
        ...data,
        content_blocks: typeof data.content_blocks === 'string' 
          ? JSON.parse(data.content_blocks) 
          : Array.isArray(data.content_blocks) 
            ? (data.content_blocks as unknown) as ContentBlock[]
            : [],
        status: data.status as 'published' | 'draft'
      } as Page : null;
    } catch (error) {
      console.error('Error fetching page:', error);
      return null;
    }
  },

  async updatePage(id: string, updates: Partial<Page>): Promise<Page | null> {
    try {
      const updateData: any = { ...updates };
      if (updates.content_blocks) {
        updateData.content_blocks = JSON.stringify(updates.content_blocks);
      }
      
      const { data, error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? {
        ...data,
        content_blocks: typeof data.content_blocks === 'string' 
          ? JSON.parse(data.content_blocks) 
          : Array.isArray(data.content_blocks) 
            ? (data.content_blocks as unknown) as ContentBlock[]
            : [],
        status: data.status as 'published' | 'draft'
      } as Page : null;
    } catch (error) {
      console.error('Error updating page:', error);
      return null;
    }
  },

  async createPage(pageData: {
    slug: string;
    title: string;
    content_blocks: ContentBlock[];
    status?: 'published' | 'draft';
  }): Promise<Page | null> {
    try {
      const insertData = {
        ...pageData,
        content_blocks: JSON.stringify(pageData.content_blocks),
        status: pageData.status || 'draft'
      };
      
      const { data, error } = await supabase
        .from('pages')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return data ? {
        ...data,
        content_blocks: typeof data.content_blocks === 'string' 
          ? JSON.parse(data.content_blocks) 
          : Array.isArray(data.content_blocks) 
            ? (data.content_blocks as unknown) as ContentBlock[]
            : [],
        status: data.status as 'published' | 'draft'
      } as Page : null;
    } catch (error) {
      console.error('Error creating page:', error);
      return null;
    }
  }
};