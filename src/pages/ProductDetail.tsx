
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import RelatedProducts from "@/components/product/RelatedProducts";
import { useSupabaseProductsPublic } from "@/hooks/useSupabaseProductsPublic";
import { Product } from "@/services/supabaseContentService";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { products, getProduct } = useSupabaseProductsPublic();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setLoading(true);
        const productData = await getProduct(Number(id));
        setProduct(productData);
        
        // Get related products
        const related = products
          .filter(p => p.id !== Number(id) && p.category === productData?.category)
          .slice(0, 4);
        setRelatedProducts(related);
        
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, getProduct, products]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading product...</p>
        </div>
      </Layout>
    );
  }
  
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

  // Convert pricing from JSON to array format expected by components
  const pricingArray = product.pricing ? 
    Object.entries(product.pricing).map(([weight, price]) => ({ weight, price: Number(price) })) :
    [{ weight: "250g", price: product.price }];

  if (!selectedWeight && pricingArray.length > 0) {
    setSelectedWeight(pricingArray[0].weight);
  }

  const selectedPricing = pricingArray.find(p => p.weight === selectedWeight) || pricingArray[0];

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <ProductBreadcrumb category={product.category || ''} productName={product.name} />

        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
          <ProductGallery image={product.image} name={product.name} productId={product.id} />
          <ProductDetails
            name={product.name}
            pricing={pricingArray}
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
            selectedPricing={selectedPricing}
            longDescription={product.longDescription || product.description}
            spiceLevel={product.spiceLevel}
            ingredients={product.ingredients || []}
            shelfLife={product.shelfLife}
            servingSuggestions={product.servingSuggestions || []}
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
