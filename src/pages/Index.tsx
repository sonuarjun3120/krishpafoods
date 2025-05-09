
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import products from "@/data/products";
import { Package } from "lucide-react";

const Index = () => {
  // Use the first 3 products from our products data
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Artisanal Pickles
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handcrafted selection of premium pickles, made with love and
            the finest ingredients.
          </p>
        </header>
        
        {/* Combo Packs Section */}
        <div className="bg-amber-50 p-6 rounded-lg mb-12 flex items-center">
          <Package size={32} className="text-[#5C2A12] mr-4" />
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#5C2A12]">Combo Packs</h2>
            <p className="text-gray-600">Special combinations for the perfect gift or pantry restock</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
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
      </main>
    </div>
  );
};

export default Index;
