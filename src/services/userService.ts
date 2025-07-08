import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  reviewed_product_ids?: number[];
  ordered_product_ids?: number[];
  created_at?: string;
  updated_at?: string;
}

export const userService = {
  async createOrUpdateUser(userData: {
    name?: string;
    email?: string;
    phone?: string;
    reviewed_product_id?: number;
    ordered_product_id?: number;
  }): Promise<User | null> {
    try {
      // Check if user exists by email or phone
      let existingUser = null;
      
      if (userData.email) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('email', userData.email)
          .single();
        existingUser = data;
      }
      
      if (!existingUser && userData.phone) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('phone', userData.phone)
          .single();
        existingUser = data;
      }

      if (existingUser) {
        // Update existing user
        const updates: any = {
          updated_at: new Date().toISOString()
        };

        if (userData.name) updates.name = userData.name;
        if (userData.email && !existingUser.email) updates.email = userData.email;
        if (userData.phone && !existingUser.phone) updates.phone = userData.phone;

        if (userData.reviewed_product_id) {
          const currentReviews = existingUser.reviewed_product_ids || [];
          if (!currentReviews.includes(userData.reviewed_product_id)) {
            updates.reviewed_product_ids = [...currentReviews, userData.reviewed_product_id];
          }
        }

        if (userData.ordered_product_id) {
          const currentOrders = existingUser.ordered_product_ids || [];
          updates.ordered_product_ids = [...currentOrders, userData.ordered_product_id];
        }

        const { data, error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', existingUser.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new user
        const newUser: any = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          reviewed_product_ids: userData.reviewed_product_id ? [userData.reviewed_product_id] : [],
          ordered_product_ids: userData.ordered_product_id ? [userData.ordered_product_id] : []
        };

        const { data, error } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async getUserStats(userId: string): Promise<{
    totalOrders: number;
    totalReviews: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('reviewed_product_ids, ordered_product_ids')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        totalOrders: data?.ordered_product_ids?.length || 0,
        totalReviews: data?.reviewed_product_ids?.length || 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { totalOrders: 0, totalReviews: 0 };
    }
  }
};