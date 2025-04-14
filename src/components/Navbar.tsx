
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#FFF8F0] shadow-sm border-b border-amber-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-playfair text-2xl font-bold text-primary">
          Krishpa Homemade Pickles
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-primary hover:text-primary/80 transition-colors">
            Shop
          </Link>
          <Link to="/about" className="text-primary hover:text-primary/80 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-primary hover:text-primary/80 transition-colors">
            Contact
          </Link>
          <Link to="/faq" className="text-primary hover:text-primary/80 transition-colors">
            FAQs
          </Link>
          <Link to="/international" className="text-primary hover:text-primary/80 transition-colors">
            International
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
