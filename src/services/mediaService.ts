import { supabase } from '@/integrations/supabase/client';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export const mediaService = {
  async getAllMedia(): Promise<MediaItem[]> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        type: item.type as 'image' | 'video'
      })) as MediaItem[];
    } catch (error) {
      console.error('Error fetching media:', error);
      return [];
    }
  },

  async uploadToStorage(file: File, category: string = 'general'): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${category}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading to storage:', error);
      return null;
    }
  },

  async createMediaRecord(mediaData: {
    name: string;
    url: string;
    type: 'image' | 'video';
    category: string;
    uploaded_by?: string;
  }): Promise<MediaItem | null> {
    try {
      const { data, error } = await supabase
        .from('media')
        .insert([mediaData])
        .select()
        .single();

      if (error) throw error;
      return data ? {
        ...data,
        type: data.type as 'image' | 'video'
      } as MediaItem : null;
    } catch (error) {
      console.error('Error creating media record:', error);
      return null;
    }
  },

  async deleteMedia(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  }
};