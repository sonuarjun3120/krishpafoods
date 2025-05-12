
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EditReviewFormProps {
  id: string;
  initialQuote: string;
  onSubmit: (quote: string) => void;
  onCancel: () => void;
}

const EditReviewForm = ({ id, initialQuote, onSubmit, onCancel }: EditReviewFormProps) => {
  const [quote, setQuote] = useState(initialQuote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Submit the edited quote
    onSubmit(quote);
    
    // Reset form state
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <h3 className="font-playfair text-xl font-bold text-primary mb-4">Edit Your Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <Textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
            placeholder="Share your experience with our products..."
            rows={4}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditReviewForm;
