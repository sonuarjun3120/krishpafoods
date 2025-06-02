
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Award, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import TestimonialCard from "@/components/TestimonialCard";
import testimonials from "@/data/testimonials";
import { useSupabaseProductsPublic } from "@/hooks/useSupabaseProductsPublic";
import { useEffect, useState } from "react";
import { Product } from "@/services/supabaseContentService";

const Home = () => {
  const { getFeaturedProducts } = useSupabaseProductsPublic();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      const products = await getFeaturedProducts();
      setFeaturedProducts(products.slice(0, 3)); // Show only 3 featured products
      setLoading(false);
    };
    loadFeaturedProducts();
  }, [getFeaturedProducts]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-primary mb-6 animate-fade-in">
            A Taste of Tradition in Every Bite!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in">
            Authentic Telugu-style pickles made with traditional recipes from Andhra and Telangana. 
            Handcrafted with love and the finest ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
                Shop Our Pickles <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
              Featured Pickles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular traditional pickles, each crafted with authentic recipes passed down through generations.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Link to="/shop">
              <Button className="bg-[#8b4513] hover:bg-[#8b4513]/90 transition-all duration-300 transform hover:scale-105">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-6">
                Our Pickle Heritage
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Krishpa Homemade Pickles began in a small kitchen in Vijayawada, where our founder's grandmother 
                perfected recipes that have been treasured for generations. Today, we continue this legacy using 
                the same traditional methods, handpicking ingredients, and crafting each batch with care and love.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Every jar tells a story of tradition, authenticity, and the rich culinary heritage of Telugu cuisine. 
                We source the finest ingredients and use time-honored techniques to ensure each pickle captures 
                the authentic flavors of Andhra and Telangana.
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136" 
                alt="Traditional pickle making" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose Krishpa?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to bringing you the most authentic and delicious pickles with traditional recipes and modern quality standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Authentic Recipes</h3>
              <p className="text-gray-600 text-sm">Traditional family recipes passed down through generations</p>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Family Business</h3>
              <p className="text-gray-600 text-sm">A trusted family business serving customers with love and care</p>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">Only the finest ingredients sourced from trusted suppliers</p>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Made with Love</h3>
              <p className="text-gray-600 text-sm">Each jar is handcrafted with attention to detail and care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our valued customers have to say about our pickles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Ready to Taste Tradition?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Order your favorite pickles today and experience the authentic flavors of Telugu cuisine delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
