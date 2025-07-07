
import { useState, useEffect } from 'react';
import { supabaseContentService, Category } from '@/services/supabaseContentService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    const data = await supabaseContentService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();

    // Set up real-time subscription for categories
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        async (payload) => {
          console.log('Category change detected:', payload);
          console.log('Event type:', payload.eventType);
          console.log('Payload old:', payload.old);
          console.log('Payload new:', payload.new);
          
          if (payload.eventType === 'INSERT') {
            const newCategory = payload.new as Category;
            console.log('Adding new category:', newCategory);
            setCategories(prev => [...prev, newCategory]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedCategory = payload.new as Category;
            console.log('Updating category:', updatedCategory);
            setCategories(prev => prev.map(category => 
              category.id === updatedCategory.id ? updatedCategory : category
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedCategory = payload.old as Category;
            console.log('Deleting category:', deletedCategory);
            console.log('Categories before delete:', categories);
            setCategories(prev => {
              const filtered = prev.filter(category => category.id !== deletedCategory.id);
              console.log('Categories after delete:', filtered);
              return filtered;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    const newCategory = await supabaseContentService.createCategory(categoryData);
    if (newCategory) {
      toast({
        title: "Category Created",
        description: "Category has been created successfully",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const success = await supabaseContentService.updateCategory(id, updates);
    if (success) {
      toast({
        title: "Category Updated",
        description: "Category has been updated successfully",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      console.log('Attempting to delete category with id:', id);
      const success = await supabaseContentService.deleteCategory(id);
      console.log('Delete result:', success);
      
      if (success) {
        // Manually update state immediately for better UX
        setCategories(prev => {
          const updated = prev.filter(category => category.id !== id);
          console.log('Updated categories after delete:', updated);
          return updated;
        });
        
        toast({
          title: "Category Deleted",
          description: "Category has been deleted successfully",
        });
        return true;
      } else {
        console.error('Delete operation returned false');
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      toast({
        title: "Error",
        description: "Failed to delete category: " + (error as Error).message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories
  };
};
