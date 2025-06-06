
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import RelatedProducts from "@/components/product/RelatedProducts";
import { supabaseContentService, Product } from "@/services/supabaseContentService";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productData = await supabaseContentService.getProduct(Number(id));
        setProduct(productData);
        
        if (productData) {
          // Fetch related products from the same category
          const allProducts = await supabaseContentService.getProducts();
          const related = allProducts
            .filter(p => p.id !== productData.id && p.category === productData.category)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading product...</p>
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

  // Handle pricing - ensure it's always an array
  let pricing = [];
  
  if (product.pricing && Array.isArray(product.pricing)) {
    pricing = product.pricing;
  } else if (product.pricing && typeof product.pricing === 'object') {
    // If pricing is stored as an object, try to convert it
    pricing = Object.values(product.pricing);
  } else if (product.price) {
    // Fallback to simple price structure
    pricing = [{ weight: "250g", price: product.price }];
  } else {
    // Default pricing if nothing is available
    pricing = [{ weight: "250g", price: 0 }];
  }
  
  if (!selectedWeight && pricing.length > 0) {
    setSelectedWeight(pricing[0].weight);
  }

  const selectedPricing = pricing.find(p => p.weight === selectedWeight) || pricing[0];

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

  // Convert Supabase products to the format expected by RelatedProducts
  const convertedRelatedProducts = relatedProducts.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.image,
    category: p.category || '',
    pricing: Array.isArray(p.pricing) ? p.pricing : [{ weight: "250g", price: p.price || 0 }],
    featured: p.featured || false,
    longDescription: p.longDescription || p.description,
    spiceLevel: p.spiceLevel || 'Medium',
    ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
    shelfLife: p.shelfLife || '6 months',
    servingSuggestions: Array.isArray(p.servingSuggestions) ? p.servingSuggestions : []
  }));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <ProductBreadcrumb category={product.category || 'Products'} productName={product.name} />

        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
          <ProductGallery image={product.image} name={product.name} productId={product.id} />
          <ProductDetails
            name={product.name}
            pricing={pricing}
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
            selectedPricing={selectedPricing}
            longDescription={product.longDescription || product.description}
            spiceLevel={product.spiceLevel || 'Medium'}
            ingredients={product.ingredients || []}
            shelfLife={product.shelfLife || '6 months'}
            servingSuggestions={product.servingSuggestions || []}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
          />
        </div>
        
        <RelatedProducts products={convertedRelatedProducts} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
