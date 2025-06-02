
import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import products from "@/data/products";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import RelatedProducts from "@/components/product/RelatedProducts";

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
        </div>
      </Layout>
    );
  }

  if (!selectedWeight && product.pricing.length > 0) {
    setSelectedWeight(product.pricing[0].weight);
  }

  const selectedPricing = product.pricing.find(p => p.weight === selectedWeight) || product.pricing[0];

  const handleAddToCart = () => {
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

  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <ProductBreadcrumb category={product.category} productName={product.name} />

        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
          <ProductGallery image={product.image} name={product.name} productId={product.id} />
          <ProductDetails
            name={product.name}
            pricing={product.pricing}
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
            selectedPricing={selectedPricing}
            longDescription={product.longDescription}
            spiceLevel={product.spiceLevel}
            ingredients={product.ingredients}
            shelfLife={product.shelfLife}
            servingSuggestions={product.servingSuggestions}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
          />
        </div>
        
        <RelatedProducts products={relatedProducts} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
