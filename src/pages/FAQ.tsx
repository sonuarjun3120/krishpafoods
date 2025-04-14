
import Layout from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const FAQ = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-playfair text-4xl font-bold text-primary mb-6 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-700 mb-12 text-center max-w-2xl mx-auto">
          Have questions about our pickles? Find answers to commonly asked questions below.
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="bg-white rounded-lg shadow-sm">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6 text-left font-medium">
                How long do your pickles last?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Our pickles have a shelf life of 12-18 months when stored properly. The exact shelf life for each product is mentioned on the label and product page. Always keep the jar tightly sealed after use and store in a cool, dry place away from direct sunlight.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-6 text-left font-medium">
                Do your pickles contain preservatives?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                No, we don't add any artificial preservatives to our pickles. The natural preservation comes from salt, oil, and the traditional pickling process. The high oil and salt content, along with our careful preparation methods, naturally preserve the pickles.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="px-6 text-left font-medium">
                How do you ship your pickles?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                We carefully pack our pickles in leak-proof containers and use sturdy packaging materials to ensure they reach you in perfect condition. For domestic orders, we use courier services that typically deliver within 3-5 business days. For international orders, please see our <Link to="/international" className="text-primary hover:underline">International Orders</Link> page for more details.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="px-6 text-left font-medium">
                Are your pickles vegetarian/vegan?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Yes, all our pickles are 100% vegetarian and vegan. We use only plant-based ingredients.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="px-6 text-left font-medium">
                Do you offer bulk orders or custom packaging?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Yes, we offer bulk orders for events, restaurants, and retail stores. We can also provide custom packaging for special occasions like weddings or corporate gifts. Please <Link to="/contact" className="text-primary hover:underline">contact us</Link> for more information and pricing.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="px-6 text-left font-medium">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                We accept various payment methods including credit/debit cards, UPI, net banking, and international cards for our overseas customers. All transactions are secure and encrypted.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="px-6 text-left font-medium">
                Do you offer returns or refunds?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Due to the nature of food products, we generally don't accept returns. However, if you receive damaged goods or if there's an issue with your order, please contact us within 48 hours of receiving your order, and we'll be happy to help you with a replacement or refund.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="px-6 text-left font-medium">
                What is the best way to store your pickles?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Store our pickles in a cool, dry place away from direct sunlight. Once opened, always use a clean, dry spoon to take out the pickle, and ensure the jar is tightly sealed after each use. While refrigeration is not necessary, it can help maintain freshness in hot climates.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9">
              <AccordionTrigger className="px-6 text-left font-medium">
                Are your pickles spicy?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                The spice level varies across our products. We clearly indicate the spice level (Mild, Medium, Hot, Extra Hot) on each product page to help you choose according to your preference. If you're sensitive to spice, we recommend starting with our Mild options.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10">
              <AccordionTrigger className="px-6 text-left font-medium">
                Do you ship internationally?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Yes, we ship to several countries worldwide. Please visit our <Link to="/international" className="text-primary hover:underline">International Orders</Link> page for detailed information on countries we serve, shipping costs, and estimated delivery times.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-10 text-center">
            <p className="text-gray-700 mb-4">
              Didn't find an answer to your question?
            </p>
            <Link to="/contact" className="text-primary hover:underline font-medium">
              Contact our customer support team →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
