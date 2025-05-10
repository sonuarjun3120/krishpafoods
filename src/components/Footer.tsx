import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Phone, Mail, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const Footer = () => {
  return <footer className="bg-[#5C2A12] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-xl font-bold mb-4">Krishpa Homemade Pickles</h3>
            <p className="text-sm mb-4">
              Authentic Telugu-style pickles made with traditional recipes from Andhra and Telangana.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/12Jf4ruQZYH/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-amber-200">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/krishpafoods/profilecard/?igsh=bm5pNmF5ZjBkZXJw" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-amber-200">
                <Instagram size={20} />
              </a>
              <a href="https://x.com/krishpafoods?t=DJZgt1mLRZ1QE-P301sJKQ&s=08" target="_blank" rel="noopener noreferrer" aria-label="Twitter (formerly X)" className="text-white hover:text-amber-200">
                <Twitter size={20} />
              </a>
              <a href="https://www.youtube.com/@krishpahomemadepickles" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:text-amber-200">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-playfair text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-sm hover:text-amber-200">Shop</Link></li>
              <li><Link to="/about" className="text-sm hover:text-amber-200">About Us</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-amber-200">Contact</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-amber-200">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-playfair text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Phone size={16} className="mr-2" />
                +91 9347445411
              </li>
              <li className="flex items-center text-sm">
                <Mail size={16} className="mr-2" />
                krishpafoods@gmail.com
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-playfair text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for recipes and special offers.
            </p>
            <div className="flex">
              <Input type="email" placeholder="Your email" className="bg-white text-black rounded-r-none" />
              <Button className="rounded-l-none bg-[8b4513] bg-[#8b4513]">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Krishpa Homemade Pickles. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
