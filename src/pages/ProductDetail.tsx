
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import products from "@/data/products";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop">
            <Button>Return to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Initialize selectedWeight if not set
  if (!selectedWeight && product.pricing.length > 0) {
    setSelectedWeight(product.pricing[0].weight);
  }

  const selectedPricing = product.pricing.find(p => p.weight === selectedWeight) || product.pricing[0];

  const handleAddToCart = () => {
    // Add product with selected quantity and weight
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: selectedPricing.price,
        weight: selectedPricing.weight,
        image: product.image
      });
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (${selectedPricing.weight}) has been added to your cart.`,
    });
  };

  // Get related products (products not including current one)
  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-6 md:p-8">
            <h1 className="font-playfair text-3xl font-bold text-primary mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="mr-2 flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-sm">(32 reviews)</span>
            </div>
            
            {/* Weight/Price Selection */}
            <div className="mb-4">
              <Select value={selectedWeight} onValueChange={setSelectedWeight}>
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  {product.pricing.map((price) => (
                    <SelectItem key={price.weight} value={price.weight}>
                      {price.weight} - ₹{price.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <p className="text-xl font-bold text-primary">
                ₹{selectedPricing.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ {selectedPricing.weight}</span>
              </p>
            </div>
            
            <p className="text-gray-700 mb-6">{product.longDescription}</p>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Spice Level</h3>
              <div className="flex items-center">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.spiceLevel === 'Mild' ? 'bg-green-100 text-green-800' : 
                  product.spiceLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                  product.spiceLevel === 'Hot' ? 'bg-orange-100 text-orange-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {product.spiceLevel}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Ingredients</h3>
              <ul className="list-disc list-inside text-gray-700">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Shelf Life</h3>
              <p className="text-gray-700">{product.shelfLife}</p>
            </div>
            
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-2">Serving Suggestions</h3>
              <ul className="list-disc list-inside text-gray-700">
                {product.servingSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="border border-gray-300 rounded-md flex items-center mr-4">
                <button 
                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="px-3 py-1">{quantity}</span>
                <button 
                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
              
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleAddToCart}
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
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="font-playfair text-2xl font-bold text-primary mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                pricing={product.pricing}
                description={product.description}
                image={product.image}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
