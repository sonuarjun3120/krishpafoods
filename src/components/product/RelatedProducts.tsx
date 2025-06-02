
import ProductCard from "@/components/ProductCard";
import { Product } from "@/services/supabaseContentService";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="font-playfair text-2xl font-bold text-primary mb-8 text-center">
        Related Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
