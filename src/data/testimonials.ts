
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  user_email?: string | null;
}

const testimonials: Testimonial[] = [];

// Function to fetch testimonials from Supabase
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (data) {
      // Update the local testimonials array
      testimonials.length = 0;
      testimonials.push(...data);
    }
    
    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return testimonials;
  }
};

// Initialize testimonials from Supabase when this module is imported
fetchTestimonials().catch(console.error);

// Function to add a new testimonial
export const addTestimonial = (
  name: string, 
  location: string, 
  quote: string, 
  id?: string, 
  user_email?: string | null
): Testimonial => {
  const newId = id || crypto.randomUUID();
  const newTestimonial: Testimonial = {
    id: newId,
    name,
    location,
    quote,
    user_email
  };
  
  testimonials.unshift(newTestimonial); // Add to the beginning to show newest first
  return newTestimonial;
};

// Function to edit a testimonial
export const editTestimonial = async (id: string, quote: string): Promise<boolean> => {
  try {
    // Update in Supabase
    const { error } = await supabase
      .from('testimonials')
      .update({ quote })
      .eq('id', id);
    
    if (error) throw error;
    
    // Update in local array
    const index = testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      testimonials[index].quote = quote;
    }
    
    return true;
  } catch (error) {
    console.error('Error editing testimonial:', error);
    return false;
  }
};

// Function to delete a testimonial
export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    // Delete from Supabase
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Delete from local array
    const index = testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      testimonials.splice(index, 1);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
};

export default testimonials;
