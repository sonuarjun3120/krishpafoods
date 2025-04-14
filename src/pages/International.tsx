
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const International = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-playfair text-4xl font-bold text-primary mb-6 text-center">
          International Orders
        </h1>
        <p className="text-gray-700 mb-12 text-center max-w-2xl mx-auto">
          Missing the authentic taste of Telugu pickles abroad? We ship worldwide to bring a taste of 
          home to NRIs and pickle enthusiasts around the globe.
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1596443686812-2f45229eebc3" 
                alt="International Shipping" 
                className="rounded-lg shadow-md h-full object-cover"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-4">
                For Our Global Customers
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We understand the nostalgia and craving for authentic Telugu pickles when you're 
                living abroad. That's why we've designed our international shipping process to ensure 
                that our pickles reach you safely, no matter where you are.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our special export-ready packaging ensures that the pickles maintain their freshness 
                and flavor during transit. We comply with all international food safety standards 
                and shipping regulations.
              </p>
              <div className="mt-6">
                <Link to="/shop">
                  <Button className="bg-primary hover:bg-primary/90">
                    Browse Our Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-amber-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-bold text-primary mb-2">
                Export-Ready Packaging
              </h3>
              <p className="text-gray-700">
                Our international orders are packed in specially designed containers that prevent leakage 
                and breakage during long shipping journeys.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-amber-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-bold text-primary mb-2">
                Food Safety Compliant
              </h3>
              <p className="text-gray-700">
                All our products comply with international food safety standards and come with appropriate 
                labeling and documentation required for customs clearance.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-amber-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-bold text-primary mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-700">
                We accept international credit cards and other global payment methods with secure 
                encryption to ensure safe transactions.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm mb-12">
            <h2 className="font-playfair text-2xl font-bold text-primary mb-6 text-center">
              Countries We Ship To
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-primary mb-2">North America</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>United States</li>
                  <li>Canada</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-primary mb-2">Europe</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>United Kingdom</li>
                  <li>Germany</li>
                  <li>France</li>
                  <li>Italy</li>
                  <li>Spain</li>
                  <li>Netherlands</li>
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-primary mb-2">Asia Pacific</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Australia</li>
                  <li>Singapore</li>
                  <li>Malaysia</li>
                  <li>New Zealand</li>
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-primary mb-2">Middle East</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>United Arab Emirates</li>
                  <li>Saudi Arabia</li>
                  <li>Qatar</li>
                  <li>Kuwait</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-700 mt-6 text-center italic">
              Don't see your country listed? <Link to="/contact" className="text-primary hover:underline">Contact us</Link> to check if we can arrange shipping to your location.
            </p>
          </div>

          <div className="bg-amber-50 p-8 rounded-lg shadow-sm mb-12">
            <h2 className="font-playfair text-2xl font-bold text-primary mb-6">
              International Shipping FAQ
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-primary mb-2">How long does international shipping take?</h3>
                <p className="text-gray-700">
                  Shipping times vary by destination. Generally, orders to North America take 7-14 business days, 
                  Europe 10-16 business days, Asia Pacific 6-12 business days, and Middle East 8-14 business days.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-primary mb-2">What about customs duties and taxes?</h3>
                <p className="text-gray-700">
                  Import duties, taxes, and customs fees are not included in the product price or shipping cost. 
                  These additional charges are the buyer's responsibility. Please check with your country's 
                  customs office to determine what these additional costs might be.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-primary mb-2">How do you ensure the pickles stay fresh during transit?</h3>
                <p className="text-gray-700">
                  Our pickles are naturally preserved and can withstand long journeys. Additionally, we use 
                  special vacuum-sealed containers for international shipments to maintain freshness. The shelf 
                  life of our pickles is 12-18 months, so there's plenty of time for shipping and enjoyment.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-primary mb-2">Do you offer bulk discounts for international orders?</h3>
                <p className="text-gray-700">
                  Yes, we offer special pricing for bulk international orders. This is particularly popular among 
                  NRI communities who often place group orders. Please <Link to="/contact" className="text-primary hover:underline">contact us</Link> for details.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-playfair text-2xl font-bold text-primary mb-6">
              Ready to Order?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Browse our collection of authentic Telugu pickles and place your order today. 
              A taste of home is just a few clicks away!
            </p>
            <Link to="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default International;
