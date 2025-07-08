
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { Product } from "@/services/supabaseContentService";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SupabaseProductCardProps {
  product: Product;
}

const SupabaseProductCard = ({ product }: SupabaseProductCardProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get all images including main image and additional images
  const getAllImages = () => {
    const images = [product.image];
    if (product.additional_images && Array.isArray(product.additional_images)) {
      images.push(...product.additional_images);
    }
    return images.filter(img => img); // Remove any null/undefined images
  };

  const allImages = getAllImages();
  
  // Parse pricing data - it could be stored as JSON or object
  const getPricing = () => {
    if (!product.pricing) return [{ weight: "250g", price: 299 }];
    
    if (typeof product.pricing === 'object' && !Array.isArray(product.pricing)) {
      // Convert object format to array format
      return Object.entries(product.pricing).map(([weight, price]) => ({
        weight,
        price: Number(price)
      }));
    }
    
    if (Array.isArray(product.pricing)) {
      return product.pricing;
    }
    
    // Fallback to single price
    return [{ weight: "250g", price: 299 }];
  };

  const pricing = getPricing();

  useEffect(() => {
    if (!selectedWeight && pricing.length > 0) {
      setSelectedWeight(pricing[0].weight);
    }
  }, [pricing, selectedWeight]);

  // Add safety check for selectedPricing
  const selectedPricing = pricing.find(p => p.weight === selectedWeight) || pricing[0] || { weight: "250g", price: 299 };

  const validateWeightSelection = () => {
    if (pricing.length > 1 && (!selectedWeight || selectedWeight === "")) {
      toast({
        title: "Please select weight",
        description: "Please select a weight before proceeding.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateWeightSelection()) return;

    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: selectedPricing.price,
      weight: selectedWeight || selectedPricing.weight,
      image: product.image 
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedWeight || selectedPricing.weight}) has been added to your cart.`,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateWeightSelection()) return;
    
    // Add to cart first
    handleAddToCart();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 bg-white hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0">
        <Link to={`/product/${product.id}`}>
          <div className="relative w-full h-48 overflow-hidden group">
            <img
              src={allImages[currentImageIndex]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isHovered ? "opacity-20" : "opacity-0"
            }`}></div>
            
            {/* Image navigation arrows - only show if multiple images */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {allImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className={`p-4 transition-all duration-300 ${isHovered ? "bg-gray-50" : ""}`}>
        <Link to={`/product/${product.id}`}>
          <CardTitle className="font-playfair mb-2 text-primary hover:text-primary/80">{product.name}</CardTitle>
        </Link>
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            {pricing.length > 1 ? (
              <Select value={selectedWeight} onValueChange={setSelectedWeight}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  {pricing.map((price) => (
                    <SelectItem key={price.weight} value={price.weight}>
                      {price.weight} - ₹{price.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-gray-600">{selectedPricing.weight}</div>
            )}
          </div>
          <p className="font-bold text-primary whitespace-nowrap">₹{selectedPricing.price}</p>
        </div>
      </CardContent>
      <CardFooter className={`flex gap-2 transition-all duration-300 ${isHovered ? "bg-gray-50" : ""}`}>
        <Button 
          className="w-full bg-[#8b4513] hover:bg-[#8b4513]/90 transition-all duration-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button 
          className="w-full bg-[#8b4513] hover:bg-[#8b4513]/90 transition-all duration-300"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseProductCard;
