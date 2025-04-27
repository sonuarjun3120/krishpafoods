
import { Link } from "react-router-dom";

interface ProductBreadcrumbProps {
  category: string;
  productName: string;
}

const ProductBreadcrumb = ({ category, productName }: ProductBreadcrumbProps) => {
  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case 'veg': return 'Vegetarian';
      case 'nonveg': return 'Non-Vegetarian';
      default: return 'Combo Packs';
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm mb-6">
      <Link to="/" className="text-primary hover:text-primary/80">
        Home
      </Link>
      <span className="text-gray-400">/</span>
      <Link to="/shop" className="text-primary hover:text-primary/80">
        Shop
      </Link>
      <span className="text-gray-400">/</span>
      <Link 
        to={`/shop?category=${category}`} 
        className="text-primary hover:text-primary/80"
      >
        {getCategoryDisplay(category)}
      </Link>
      <span className="text-gray-400">/</span>
      <span className="text-gray-600">{productName}</span>
    </div>
  );
};

export default ProductBreadcrumb;
