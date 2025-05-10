
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { addTestimonial } from "@/data/testimonials";

const ReviewForm = ({ onReviewSubmitted }: { onReviewSubmitted?: () => void }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    quote: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add the testimonial to our data
    const { name, location, quote } = formData;
    addTestimonial(name, location, quote);
    
    // Simulate form submission delay
    setTimeout(() => {
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your feedback! Your review has been added.",
      });
      
      setFormData({
        name: '',
        location: '',
        quote: ''
      });
      setIsSubmitting(false);
      
      // Call callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    }, 800);
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
          <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <Textarea
            id="quote"
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            required
            placeholder="Share your experience with our products..."
            rows={4}
          />
        </div>
        
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
