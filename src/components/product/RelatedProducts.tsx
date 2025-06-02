
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  return (
    <div className="mt-16">
      <h2 className="font-playfair text-2xl font-bold text-primary mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
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
  );
};

export default RelatedProducts;
