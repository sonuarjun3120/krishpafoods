
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { type ProductPricing } from "@/data/products";

interface ProductCardProps {
  id: number;
  name: string;
  pricing: ProductPricing[];
  description: string;
  image: string;
}

const ProductCard = ({ id, name, pricing, description, image }: ProductCardProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<string>(pricing[0].weight);
  const [isHovered, setIsHovered] = useState(false);
  
  // Create an array of images for the carousel
  const images = [
    image,
    "https://images.unsplash.com/photo-1589216532372-1c2a367900d9",
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image carousel interval that only runs when hovered
  useEffect(() => {
    let interval: number | null = null;
    
    if (isHovered) {
      interval = window.setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1000); // Faster rotation when hovering
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, images.length]);

  const selectedPricing = pricing.find(p => p.weight === selectedWeight) || pricing[0];

  const handleAddToCart = () => {
    addToCart({ 
      id, 
      name, 
      price: selectedPricing.price,
      weight: selectedWeight,
      image 
    });
    
    toast({
      title: "Added to cart",
      description: `${name} (${selectedWeight}) has been added to your cart.`,
    });
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 bg-white hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0); // Reset to main image when not hovering
      }}
    >
      <CardHeader className="p-0">
        <Link to={`/product/${id}`}>
          <div className="relative w-full h-48 overflow-hidden">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${name} view ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                } ${isHovered ? "scale-110" : "scale-100"}`}
              />
            ))}
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isHovered ? "opacity-20" : "opacity-0"
            }`}></div>
          </div>
        </Link>
      </CardHeader>
      <CardContent className={`p-4 transition-all duration-300 ${isHovered ? "bg-gray-50" : ""}`}>
        <Link to={`/product/${id}`}>
          <CardTitle className="font-playfair mb-2 text-primary hover:text-primary/80">{name}</CardTitle>
        </Link>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
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
        <Link to={`/product/${id}`} className="w-full">
          <Button className="w-full bg-[#8b4513] hover:bg-[#8b4513]/90 transition-all duration-300">
            Buy Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
