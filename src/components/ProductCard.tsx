
import { useState } from "react";
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
    <Card className="overflow-hidden transition-transform hover:scale-[1.02] duration-300 bg-white">
      <CardHeader className="p-0">
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4">
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
      <CardFooter className="flex gap-2">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Link to={`/product/${id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90 transition-all duration-300">
            Buy Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
