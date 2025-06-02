
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import TestimonialCard from "@/components/TestimonialCard";
import ReviewForm from "@/components/ReviewForm";
import Categories from "@/components/Categories";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import testimonials, { fetchTestimonials, editTestimonial, deleteTestimonial } from "@/data/testimonials";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabaseContentService } from "@/services/supabaseContentService";

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [refreshTestimonials, setRefreshTestimonials] = useState(0);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [homeContent, setHomeContent] = useState<any>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Initially show only 4 testimonials
  const initialTestimonialsCount = 4;
  const displayedTestimonials = showAllTestimonials 
    ? testimonials 
    : testimonials.slice(0, initialTestimonialsCount);

  // Load products and content from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load featured products from Supabase
      const featuredProducts = await supabaseContentService.getFeaturedProducts();
      setProducts(featuredProducts);
      
      // Load home page content from Supabase
      const pageContent = await supabaseContentService.getPage('home');
      if (pageContent) {
        setHomeContent(pageContent.content);
      } else {
        // Fallback to default content
        setHomeContent({
          heroTitle: 'A Taste of Tradition in Every Bite!',
          heroDescription: 'Authentic Telugu-style pickles made with traditional recipes from Andhra and Telangana. Handcrafted with love and the finest ingredients.',
          aboutTitle: 'Our Pickle Heritage',
          aboutDescription: 'Krishpa Homemade Pickles began in a small kitchen in Vijayawada, where our founder\'s grandmother perfected recipes that have been treasured for generations. Today, we continue this legacy using the same traditional methods, handpicking ingredients, and crafting each batch with care and love.'
        });
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Force re-render of testimonials when a new one is added
  const handleReviewSubmitted = () => {
    setRefreshTestimonials(prev => prev + 1);
  };
  
  // Fetch testimonials on component mount
  useEffect(() => {
    const loadTestimonials = async () => {
      await fetchTestimonials();
    };
    
    loadTestimonials();
  }, [refreshTestimonials]);
  
  // Handle testimonial edit
  const handleEditTestimonial = async (id: string, quote: string) => {
    const success = await editTestimonial(id, quote);
    if (success) {
      setRefreshTestimonials(prev => prev + 1);
    } else {
      toast({
        title: "Error",
        description: "Failed to update your review. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle testimonial delete
  const handleDeleteTestimonial = async (id: string) => {
    const success = await deleteTestimonial(id);
    if (success) {
      setRefreshTestimonials(prev => prev + 1);
    } else {
      toast({
        title: "Error",
        description: "Failed to delete your review. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !homeContent) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-amber-50">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-6">
              {homeContent.heroTitle}
            </h1>
            <p className="text-gray-700 mb-8 text-lg">
              {homeContent.heroDescription}
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
            <img src="https://images.unsplash.com/photo-1589216532372-1c2a367900d9" alt="Assorted pickles in jars" className="rounded-lg shadow-lg w-full h-auto object-cover" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-amber-50/80 to-transparent"></div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold text-primary mb-2 text-center">
            Browse by Category
          </h2>
          <p className="text-gray-700 mb-10 text-center max-w-2xl mx-auto">
            Explore our diverse collection of handcrafted pickles
          </p>
          <Categories />
        </div>
      </section>

      {/* About Brief Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold text-primary mb-6">
              {homeContent.aboutTitle}
            </h2>
            <p className="text-gray-700 mb-8">
              {homeContent.aboutDescription}
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
            {products.length > 0 ? (
              products.map(product => <ProductCard key={product.id} {...product} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No featured products available at the moment.</p>
              </div>
            )}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop">
              <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
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
          
          {testimonials.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedTestimonials.map(testimonial => (
                <TestimonialCard 
                  key={`${testimonial.id}-${refreshTestimonials}`} 
                  {...testimonial}
                  onEdit={handleEditTestimonial}
                  onDelete={handleDeleteTestimonial}
                />
              ))}
            </div>
          )}
          
          {testimonials.length > initialTestimonialsCount && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => setShowAllTestimonials(!showAllTestimonials)}
              >
                {showAllTestimonials ? "Show Less" : "More Reviews"}
              </Button>
            </div>
          )}
          
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  Share Your Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-white py-16 animate-fade-in bg-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl font-bold mb-6 text-secondary-foreground">
            Bring Home the Taste of Tradition
          </h2>
          <p className="mb-8 max-w-2xl mx-auto text-secondary-foreground">
            From our family's kitchen to your table - experience the authentic flavors of Telugu cuisine with Krishpa Homemade Pickles.
          </p>
          <Link to="/shop">
            <Button className="text-white py-2 px-8 text-lg transition-all duration-300 hover:scale-105 bg-[#8b4513]">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
