
import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl font-bold text-primary mb-6 text-center">
            Our Story
          </h1>
          
          <div className="mb-12">
            <img 
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f" 
              alt="Family preparing pickles" 
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md mb-6"
            />
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm mb-12">
            <h2 className="font-playfair text-2xl font-bold text-primary mb-4">
              The Krishpa Journey
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Krishpa Homemade Pickles was born in the small town of Vijayawada, in Andhra Pradesh, where our 
              founder Krishna Prasad's grandmother was known for her exceptional pickle-making skills. 
              Growing up, Krishna spent countless hours in his grandmother's kitchen, learning the art 
              of selecting the perfect raw mangoes, sun-drying chilies to perfection, and mastering the 
              precise blend of spices that made her pickles so special.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              When Krishna moved to Hyderabad for work, he found himself missing the authentic taste of 
              his grandmother's pickles. Store-bought versions never quite captured the same flavors or 
              used the same quality ingredients. That's when he decided to revive his grandmother's 
              recipes and start making small batches of pickles for himself and his friends.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Word quickly spread about Krishna's delicious homemade pickles, and soon he was receiving 
              requests from friends of friends, colleagues, and even strangers. In 2015, Krishna 
              finally decided to turn his passion into a business, naming it "Krishpa" - a combination 
              of his name and that of his grandmother, Padma.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-primary mb-4">
                Our Philosophy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                At Krishpa, we believe that food is more than just sustenance; it's a vehicle for 
                preserving culture and creating connections. Our pickles are made with the same love, 
                care, and attention to detail that Krishna's grandmother put into every jar she created.
              </p>
              <p className="text-gray-700 mt-4 leading-relaxed">
                We're committed to using only the finest ingredients, sourced directly from farmers 
                who share our passion for quality. No artificial preservatives, colors, or flavors 
                are ever used in our products.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-primary mb-4">
                Our Process
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Every jar of Krishpa pickle is still handcrafted in small batches to ensure quality and 
                consistency. We follow traditional methods that have been refined over generations:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>Ingredients are hand-selected and inspected for quality</li>
                <li>Spices are ground fresh for each batch</li>
                <li>Natural fermentation and curing processes are followed</li>
                <li>Each batch is taste-tested before packaging</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 p-8 rounded-lg shadow-sm mb-12">
            <h2 className="font-playfair text-2xl font-bold text-primary mb-6 text-center">
              Founder's Message
            </h2>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <img 
                  src="https://images.unsplash.com/photo-1556157382-97eda2f9e946" 
                  alt="Krishna Prasad - Founder" 
                  className="rounded-full w-40 h-40 object-cover mx-auto"
                />
              </div>
              <div className="md:w-2/3 md:pl-8">
                <p className="text-gray-700 mb-4 leading-relaxed italic">
                  "Growing up in Andhra Pradesh, pickles were an essential part of our family meals. 
                  My grandmother would spend weeks each summer preparing various pickles that would 
                  last our extended family through the year. Those flavors are etched in my memory, 
                  and it's been my life's passion to preserve and share those authentic tastes with 
                  the world.
                </p>
                <p className="text-gray-700 leading-relaxed italic">
                  At Krishpa, we're not just selling pickles; we're sharing a piece of our heritage, 
                  our family traditions, and the rich culinary legacy of Telugu cuisine. Each jar 
                  contains not just carefully selected ingredients, but also the stories, love, and 
                  warmth of a Telugu household."
                </p>
                <p className="text-right mt-4 font-playfair font-bold text-primary">
                  - Krishna Prasad, Founder
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="font-playfair text-2xl font-bold text-primary mb-4">
              Join the Krishpa Family
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We're grateful to all our customers who have made Krishpa a part of their dining tables 
              and family gatherings. We invite you to try our pickles and experience the authentic 
              taste of Telugu tradition.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
