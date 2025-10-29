
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { addTestimonial } from "@/data/testimonials";
import { z } from 'zod';

const reviewSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  location: z.string()
    .trim()
    .min(2, { message: "Location must be at least 2 characters" })
    .max(100, { message: "Location must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .optional()
    .or(z.literal('')),
  quote: z.string()
    .trim()
    .min(10, { message: "Review must be at least 10 characters" })
    .max(1000, { message: "Review must be less than 1000 characters" })
});

const ReviewForm = ({ onReviewSubmitted }: { onReviewSubmitted?: () => void }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    quote: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate input
      const validatedData = reviewSchema.parse(formData);
      
      // Store user email in localStorage to identify their reviews
      if (validatedData.email) {
        localStorage.setItem('userEmail', validatedData.email);
      }
      
      // Add to Supabase with validated data
      const { data, error } = await supabase
        .from('testimonials')
        .insert([
          { 
            name: validatedData.name, 
            location: validatedData.location, 
            quote: validatedData.quote,
            user_email: validatedData.email || null
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Add the testimonial to our local data as well
      if (data && data[0]) {
        const { name, location, quote, id, user_email } = data[0];
        addTestimonial(name, location, quote, id, user_email);
      }
      
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your feedback! Your review has been added.",
      });
      
      setFormData({
        name: '',
        location: '',
        quote: '',
        email: ''
      });
      
      // Call callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        console.error('Error submitting review:', error);
        toast({
          title: "Error",
          description: "There was a problem submitting your review. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="font-playfair text-xl font-bold text-primary mb-4">Share Your Experience</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="City, Country"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (required to edit/delete your review later)</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <Textarea
            id="quote"
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            required
            placeholder="Share your experience with our products..."
            rows={4}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.quote.length}/1000 characters</p>
        </div>
        
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
