
import { useState, useEffect } from 'react';
import { supabaseContentService, Category } from '@/services/supabaseContentService';
import { useToast } from '@/hooks/use-toast';

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
  }, []);

  const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    const newCategory = await supabaseContentService.createCategory(categoryData);
    if (newCategory) {
      await fetchCategories();
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

  return {
    categories,
    loading,
    createCategory,
    refreshCategories: fetchCategories
  };
};
