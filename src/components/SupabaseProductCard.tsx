
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { Product } from "@/services/supabaseContentService";

interface SupabaseProductCardProps {
  product: Product;
}

const SupabaseProductCard = ({ product }: SupabaseProductCardProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  
  // Parse pricing data - it could be stored as JSON or object
  const getPricing = () => {
    if (!product.pricing) return [{ weight: "250g", price: product.price }];
    
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
    return [{ weight: "250g", price: product.price }];
  };

  const pricing = getPricing();

  useEffect(() => {
    if (!selectedWeight && pricing.length > 0) {
      setSelectedWeight(pricing[0].weight);
    }
  }, [pricing, selectedWeight]);

  const selectedPricing = pricing.find(p => p.weight === selectedWeight) || pricing[0];

  const handleAddToCart = () => {
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: selectedPricing.price,
      weight: selectedWeight,
      image: product.image 
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedWeight}) has been added to your cart.`,
    });
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 bg-white hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0">
        <Link to={`/product/${product.id}`}>
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isHovered ? "opacity-20" : "opacity-0"
            }`}></div>
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
              <div className="text-sm text-gray-600">{pricing[0].weight}</div>
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
        <Link to={`/product/${product.id}`} className="w-full">
          <Button className="w-full bg-[#8b4513] hover:bg-[#8b4513]/90 transition-all duration-300">
            Buy Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SupabaseProductCard;
