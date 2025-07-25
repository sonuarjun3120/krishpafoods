
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import RelatedProducts from "@/components/product/RelatedProducts";
import CustomerReviews from "@/components/product/CustomerReviews";
import { supabaseContentService, Product } from "@/services/supabaseContentService";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState<any[]>([]);
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

  // Handle pricing in a separate useEffect to avoid re-render loops
  useEffect(() => {
    if (!product) return;

    let newPricing = [];
    
    if (product?.pricing && Array.isArray(product.pricing)) {
      newPricing = product.pricing;
    } else if (product?.pricing && typeof product.pricing === 'object') {
      // If pricing is stored as an object, try to convert it
      newPricing = Object.entries(product.pricing).map(([weight, price]) => ({
        weight,
        price: Number(price) || 0
      }));
    } else if (product?.price) {
      // Fallback to simple price structure
      newPricing = [{ weight: "250g", price: product.price }];
    } else {
      // Default pricing if nothing is available
      newPricing = [{ weight: "250g", price: 0 }];
    }
    
    // Ensure pricing is not empty and set default weight
    if (newPricing.length === 0) {
      newPricing = [{ weight: "250g", price: 0 }];
    }

    setPricing(newPricing);
  }, [product]);

  // Set default selectedWeight when pricing changes
  useEffect(() => {
    if (!selectedWeight && pricing.length > 0) {
      setSelectedWeight(pricing[0].weight);
    }
  }, [pricing, selectedWeight]);

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

  // Ensure selectedPricing is never undefined
  const selectedPricing = pricing.find(p => p.weight === selectedWeight) || pricing[0] || { weight: "250g", price: 0 };

  const validateWeightSelection = () => {
    if (!selectedWeight || selectedWeight === "") {
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

  const handleBuyNow = () => {
    if (!validateWeightSelection()) return;
    
    // Add to cart first
    handleAddToCart();
    
    // Navigate to cart/checkout page
    navigate('/cart');
  };

  // Convert Supabase products to the format expected by RelatedProducts
  const convertedRelatedProducts = relatedProducts.map(p => {
    // Ensure spiceLevel matches allowed types
    const validSpiceLevel = (level: string): "Medium" | "Mild" | "Hot" | "Extra Hot" => {
      switch (level) {
        case "Mild":
          return "Mild";
        case "Hot":
          return "Hot";
        case "Extra Hot":
          return "Extra Hot";
        default:
          return "Medium";
      }
    };

    // Ensure category matches allowed types - handle both database format and expected format
    const validCategory = (category: string): "veg" | "nonveg" | "combo" => {
      const normalizedCategory = category?.toLowerCase();
      switch (normalizedCategory) {
        case "veg":
        case "vegetarian":
          return "veg";
        case "nonveg":
        case "non-veg":
        case "non-vegetarian":
          return "nonveg";
        case "combo":
        case "combination":
          return "combo";
        default:
          return "veg";
      }
    };

    // Convert pricing format
    let convertedPricing = [];
    if (p.pricing && Array.isArray(p.pricing)) {
      convertedPricing = p.pricing;
    } else if (p.pricing && typeof p.pricing === 'object') {
      convertedPricing = Object.entries(p.pricing).map(([weight, price]) => ({
        weight,
        price: Number(price) || 0
      }));
    } else if (p.price) {
      convertedPricing = [{ weight: "250g", price: p.price }];
    } else {
      convertedPricing = [{ weight: "250g", price: 0 }];
    }

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      image: p.image,
      category: validCategory(p.category || 'veg'),
      pricing: convertedPricing,
      featured: p.featured || false,
      longDescription: p.longDescription || p.description,
      spiceLevel: validSpiceLevel(p.spiceLevel || 'Medium'),
      ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
      shelfLife: p.shelfLife || '6 months',
      servingSuggestions: Array.isArray(p.servingSuggestions) ? p.servingSuggestions : []
    };
  });

  // Ensure category matches allowed types for the main product
  const validProductCategory = (category: string): "veg" | "nonveg" | "combo" => {
    const normalizedCategory = category?.toLowerCase();
    switch (normalizedCategory) {
      case "veg":
      case "vegetarian":
        return "veg";
      case "nonveg":
      case "non-veg":
      case "non-vegetarian":
        return "nonveg";
      case "combo":
      case "combination":
        return "combo";
      default:
        return "veg";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <ProductBreadcrumb category={validProductCategory(product?.category || 'veg')} productName={product?.name || ''} />

        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
          <ProductGallery 
            image={product.image} 
            name={product.name} 
            productId={product.id}
            additionalImages={product.additional_images}
          />
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
            onBuyNow={handleBuyNow}
          />
        </div>
        
        <CustomerReviews />
        <RelatedProducts products={convertedRelatedProducts} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
