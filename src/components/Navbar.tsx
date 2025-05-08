
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent clicks inside the menu from closing it
  const handleMenuContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <nav className="bg-[#5C2A12] shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/27aec43b-a588-481f-a3cb-bae4f348578e.png" 
            alt="Krishpa Home Made Foods" 
            className="h-16 w-auto"
          />
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-[#FEF7CD] hover:text-amber-200 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-[#FEF7CD] hover:text-amber-200 transition-colors">
            Shop
          </Link>
          <Link to="/about" className="text-[#FEF7CD] hover:text-amber-200 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-[#FEF7CD] hover:text-amber-200 transition-colors">
            Contact
          </Link>
          <Link to="/faq" className="text-[#FEF7CD] hover:text-amber-200 transition-colors">
            FAQs
          </Link>
          <Link to="/international" className="text-[#FEF7CD] hover:text-amber-200 transition-colors">
            International
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative border-[#FEF7CD] text-[#FEF7CD] hover:bg-[#7C3D1D] hover:text-[#FEF7CD]">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Button>
          </Link>
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="text-[#FEF7CD] hover:bg-[#7C3D1D] hover:text-[#FEF7CD]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden bg-[#5C2A12] border-t border-[#7C3D1D] py-4"
          onClick={handleMenuContainerClick}
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-[#FEF7CD] hover:text-amber-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="text-[#FEF7CD] hover:text-amber-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className="text-[#FEF7CD] hover:text-amber-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="text-[#FEF7CD] hover:text-amber-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/faq" 
              className="text-[#FEF7CD] hover:text-amber-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQs
            </Link>
            <Link 
              to="/international" 
              className="text-[#FEF7CD] hover:text-amber-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              International
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
