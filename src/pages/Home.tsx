
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import products from "@/data/products";
import testimonials from "@/data/testimonials";

const Home = () => {
  const featuredProducts = products.filter(product => product.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-amber-50">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">
              A Taste of Tradition in Every Bite!
            </h1>
            <p className="text-gray-700 mb-8 text-lg">
              Authentic Telugu-style pickles made with traditional recipes from Andhra and Telangana.
              Handcrafted with love and the finest ingredients.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-white py-2 px-6">
                  Explore Our Pickles
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Learn Our Story
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1589216532372-1c2a367900d9" 
              alt="Assorted pickles in jars" 
              className="rounded-lg shadow-lg w-full h-auto object-cover" 
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-amber-50/80 to-transparent"></div>
      </section>

      {/* About Brief Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold text-primary mb-6">
              Our Pickle Heritage
            </h2>
            <p className="text-gray-700 mb-8">
              Krishpa Homemade Pickles began in a small kitchen in Vijayawada, where our founder's
              grandmother perfected recipes that have been treasured for generations. 
              Today, we continue this legacy using the same traditional methods, handpicking 
              ingredients, and crafting each batch with care and love.
            </p>
            <Link to="/about">
              <Button variant="link" className="text-primary">
                Read Our Full Story →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold text-primary mb-2 text-center">
            Our Signature Pickles
          </h2>
          <p className="text-gray-700 mb-10 text-center max-w-2xl mx-auto">
            Handcrafted in small batches using traditional methods and the finest ingredients
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop">
              <Button className="bg-primary hover:bg-primary/90">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold text-primary mb-2 text-center">
            What Our Customers Say
          </h2>
          <p className="text-gray-700 mb-10 text-center max-w-2xl mx-auto">
            We're proud to bring the authentic taste of Telugu cuisine to homes around the world
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl font-bold mb-6">
            Bring Home the Taste of Tradition
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            From our family's kitchen to your table - experience the authentic flavors of Telugu cuisine with Krishpa Homemade Pickles.
          </p>
          <Link to="/shop">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-8 text-lg">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
