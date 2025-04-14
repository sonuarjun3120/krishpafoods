
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: 1,
    name: "Classic Dill Pickles",
    price: 8.99,
    description: "Crisp cucumbers in a traditional dill brine. A timeless favorite!",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
  },
  {
    id: 2,
    name: "Spicy Garlic Pickles",
    price: 9.99,
    description: "A fiery blend of garlic and chili peppers. Not for the faint of heart!",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
  },
  {
    id: 3,
    name: "Bread & Butter Pickles",
    price: 7.99,
    description: "Sweet and tangy slices perfect for sandwiches and burgers.",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary/20">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
