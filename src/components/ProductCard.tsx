
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  
  // Safety check for pricing array
  if (!pricing || pricing.length === 0) {
    return null; // Don't render if no pricing data
  }
  
  const [selectedWeight, setSelectedWeight] = useState<string>(pricing[0].weight);
  const [isHovered, setIsHovered] = useState(false);
  
  // Function to get product-specific images
  const getProductImages = (productId: number, mainImage: string) => {
    const baseImages = [mainImage];
    
    // Add product-specific secondary images based on product ID
    switch(productId) {
      case 1: // Avakaya Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
          "https://images.unsplash.com/photo-1608500218890-c4914cf4d7c0"
        );
        break;
      case 2: // Gongura Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1439886183900-e79ec0057170",
          "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
        );
        break;
      case 3: // Tomato Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1485833077593-4278bba3f11f",
          "https://images.unsplash.com/photo-1438565434616-3ef039228b15"
        );
        break;
      case 4: // Lemon Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac",
          "https://images.unsplash.com/photo-1441057206919-63d19fac2369"
        );
        break;
      case 5: // Green Chili Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1501286353178-1ec881214838",
          "https://images.unsplash.com/photo-1469041797191-50ace28483c3"
        );
        break;
      case 6: // Tamarind Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2",
          "https://images.unsplash.com/photo-1487252665478-49b61b47f302"
        );
        break;
      case 7: // Chicken Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1574484284002-952d92456975",
          "https://images.unsplash.com/photo-1603360946369-dc9bb6258143"
        );
        break;
      case 8: // Boneless Chicken Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1580217729415-08d9fe8d5438",
          "https://images.unsplash.com/photo-1664288036226-29fd284eb555"
        );
        break;
      default:
        // For products without specific images, use generic ones
        baseImages.push(
          "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
          "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
        );
    }
    
    return baseImages;
  };
  
  const images = getProductImages(id, image);
  
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
