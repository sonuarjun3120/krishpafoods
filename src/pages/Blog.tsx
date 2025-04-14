
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "The Art of Pickle Making: Telugu Traditions",
    excerpt: "Discover the time-honored techniques and cultural significance of pickle making in Telugu households.",
    date: "April 10, 2023",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
    author: "Krishna Prasad",
    category: "Traditions"
  },
  {
    id: 2,
    title: "Health Benefits of Homemade Pickles",
    excerpt: "Explore the surprising health benefits of traditionally fermented pickles and their probiotic properties.",
    date: "March 15, 2023",
    image: "https://images.unsplash.com/photo-1584272194894-97f134b5a5c3",
    author: "Dr. Lakshmi Rao",
    category: "Health"
  },
  {
    id: 3,
    title: "Avakaya: The King of Telugu Pickles",
    excerpt: "Learn about the history and cultural significance of Avakaya, the most beloved pickle variety in Andhra and Telangana.",
    date: "February 28, 2023",
    image: "https://images.unsplash.com/photo-1567164289519-6165f888c913",
    author: "Ravi Kumar",
    category: "Pickle Types"
  },
  {
    id: 4,
    title: "Storing Pickles: Tips for Maximum Shelf Life",
    excerpt: "Expert advice on how to properly store your homemade pickles to ensure they remain fresh and flavorful for months.",
    date: "January 20, 2023",
    image: "https://images.unsplash.com/photo-1513135467880-6c41633f8554",
    author: "Padma Reddy",
    category: "Tips & Tricks"
  },
  {
    id: 5,
    title: "Beyond Rice: Creative Ways to Enjoy Telugu Pickles",
    excerpt: "Innovative serving suggestions and recipe ideas that go beyond the traditional rice and pickle combination.",
    date: "December 12, 2022",
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d",
    author: "Anita Sharma",
    category: "Recipes"
  },
  {
    id: 6,
    title: "From Farm to Jar: The Journey of Our Ingredients",
    excerpt: "Follow the journey of how we source the finest ingredients from local farmers for our handcrafted pickles.",
    date: "November 5, 2022",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
    author: "Krishna Prasad",
    category: "Behind the Scenes"
  }
];

const Blog = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-playfair text-4xl font-bold text-primary mb-6 text-center">
          Pickle Chronicles
        </h1>
        <p className="text-gray-700 mb-12 text-center max-w-2xl mx-auto">
          Stories, traditions, recipes, and everything you need to know about the wonderful world of Telugu pickles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                <h2 className="font-playfair text-xl font-bold text-primary mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">By {post.author}</span>
                  <Button variant="link" className="text-primary p-0">
                    Read More →
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-primary hover:bg-primary/90">
            Load More Articles
          </Button>
        </div>

        <div className="mt-16 bg-amber-50 rounded-lg p-8 max-w-3xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-primary mb-4 text-center">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-700 mb-6 text-center">
            Stay updated with our latest articles, recipes, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="bg-primary hover:bg-primary/90">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
