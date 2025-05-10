
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out! We'll get back to you soon.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-playfair text-4xl font-bold text-primary mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-gray-700 mb-12 text-center max-w-2xl mx-auto">
          Have questions about our products or want to place a bulk order? 
          We'd love to hear from you!
        </p>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="font-playfair text-xl font-bold text-primary mb-4">
                Reach Out to Us
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+91 9347445411</p>
                    <p className="text-gray-600">Mon-Sat: 9am to 6pm</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">krishpafoods@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">
                      123 Pickle Lane, Jubilee Hills,<br />
                      Hyderabad, Telangana 500033
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-playfair text-xl font-bold text-primary mb-4">
                Follow Us
              </h2>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/share/12Jf4ruQZYH/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/krishpafoods/profilecard/?igsh=bm5pNmF5ZjBkZXJw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://x.com/krishpafoods?t=DJZgt1mLRZ1QE-P301sJKQ&s=08" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Twitter size={20} />
                </a>
              </div>
              <div className="mt-6">
                <a 
                  href="https://wa.me/919876543210?text=Hello%2C%20I%20have%20a%20query%20about%20ordering%20and%20payment%20for%20Krishpa%20pickles." 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg viewBox="0 0 32 32" className="h-5 w-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.916 1.416 7.5 3.776 10.28L1.304 32l5.892-2.44c2.636 1.92 5.876 3.044 9.372 3.044 8.824 0 15.996-7.176 15.996-16s-7.172-16-15.996-16zM25.252 22.508c-.388 1.096-1.924 2.008-3.148 2.272-.836.172-1.928.308-5.604-1.204-4.708-1.932-7.732-6.676-7.964-6.984-.224-.308-1.84-2.456-1.84-4.684 0-2.228 1.144-3.32 1.576-3.784.344-.368.756-.532 1.012-.532.252 0 .5.004.716.016.624.32.944.064 1.368 1.064.52 1.228 1.28 3.124 1.392 3.352.112.228.188.5.036.796-.14.288-.264.412-.48.652-.22.24-.42.424-.64.684-.196.228-.42.472-.172.9.252.424.112.776 1.676 3.388 1.68 2.156 3.052 2.848 3.496 3.164.444.32.708.268.972.16.26-.1.576-.404 1.092-.824.344-.288.78-.424 1.24-.272.464.14 2.92 1.376 3.42 1.628.5.248.836.38.956.584.12.212.12 1.208-.268 2.372z"/>
                  </svg>
                  Chat on WhatsApp for Payment Queries
                </a>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-playfair text-xl font-bold text-primary mb-6">
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name*
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message*
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="What would you like to tell us?"
                    rows={6}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
