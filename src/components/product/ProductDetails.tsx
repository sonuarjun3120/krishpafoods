
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductPricing } from "@/data/products";
import ProductRating from "./ProductRating";

interface ProductDetailsProps {
  name: string;
  pricing: ProductPricing[];
  selectedWeight: string;
  setSelectedWeight: (weight: string) => void;
  selectedPricing: ProductPricing;
  longDescription: string;
  spiceLevel: string;
  ingredients: string[];
  shelfLife: string;
  servingSuggestions: string[];
  quantity: number;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
}

const ProductDetails = ({
  name,
  pricing,
  selectedWeight,
  setSelectedWeight,
  selectedPricing,
  longDescription,
  spiceLevel,
  ingredients,
  shelfLife,
  servingSuggestions,
  quantity,
  setQuantity,
  onAddToCart
}: ProductDetailsProps) => {
  // Add safety check for price
  const safePrice = selectedPricing?.price || 0;
  
  return (
    <div className="md:w-1/2 p-6 md:p-8">
      <h1 className="font-playfair text-3xl font-bold text-primary mb-2">
        {name}
      </h1>
      
      <ProductRating />
      
      <div className="mb-4">
        <Select value={selectedWeight} onValueChange={setSelectedWeight}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            {pricing.map((price) => (
              <SelectItem key={price.weight} value={price.weight}>
                {price.weight} - ₹{price.price || 0}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <p className="text-xl font-bold text-primary">
          ₹{safePrice.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ {selectedPricing?.weight || "250g"}</span>
        </p>
      </div>
      
      <p className="text-gray-700 mb-6">{longDescription}</p>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Spice Level</h3>
        <div className="flex items-center">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            spiceLevel === 'Mild' ? 'bg-green-100 text-green-800' : 
            spiceLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
            spiceLevel === 'Hot' ? 'bg-orange-100 text-orange-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {spiceLevel}
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Ingredients</h3>
        <ul className="list-disc list-inside text-gray-700">
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Shelf Life</h3>
        <p className="text-gray-700">{shelfLife}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="font-medium text-gray-900 mb-2">Serving Suggestions</h3>
        <ul className="list-disc list-inside text-gray-700">
          {servingSuggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="border border-gray-300 rounded-md flex items-center mr-4">
          <button 
            className="px-3 py-1 text-gray-500 hover:text-gray-700"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span className="px-3 py-1">{quantity}</span>
          <button 
            className="px-3 py-1 text-gray-500 hover:text-gray-700"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
        
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={onAddToCart}
        >
          Add to Cart
        </Button>
      </div>
      
      <Button 
        className="w-full bg-amber-600 hover:bg-amber-700"
      >
        Buy Now
      </Button>
      
      <div className="mt-6 text-center">
        <a 
          href="https://wa.me/919876543210" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-green-600 hover:text-green-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          Have questions? Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default ProductDetails;
