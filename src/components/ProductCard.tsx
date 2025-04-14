
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  weight: string;
  description: string;
  image: string;
}

const ProductCard = ({ id, name, price, weight, description, image }: ProductCardProps) => {
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
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
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">₹{price.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ {weight}</span></p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Link to={`/product/${id}`} className="w-full">
          <Button className="w-full bg-amber-600 hover:bg-amber-700">
            Buy Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
