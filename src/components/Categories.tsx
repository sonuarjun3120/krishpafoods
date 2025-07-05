
import React from 'react';
import { Link } from "react-router-dom";
import { Salad, Beef, Package, FolderTree, ShoppingCart, Coffee, Cookie } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";

const Categories = () => {
  const { categories, loading } = useCategories();
  const { products } = useSupabaseProducts();

  // Icon mapping for categories
  const getIcon = (iconName?: string) => {
    const IconComponent = {
      'Salad': Salad,
      'Beef': Beef,
      'Package': Package,
      'FolderTree': FolderTree,
      'ShoppingCart': ShoppingCart,
      'Coffee': Coffee,
      'Cookie': Cookie,
    }[iconName || 'Package'] || Package;

    return <IconComponent className="w-6 h-6" />;
  };

  // Calculate product count per category
  const getCategoryProductCount = (categoryName: string) => {
    return products.filter(product => product.category === categoryName).length;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <FolderTree className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Categories Yet</h3>
          <p className="text-gray-500">Categories will appear here once they are created.</p>
        </CardContent>
      </Card>
    );
  }

  // Enhanced responsive category display
  return (
    <div className="space-y-6">
      {/* Featured Categories - Grid Layout for better display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => {
          const productCount = getCategoryProductCount(category.name);
          
          return (
            <Link 
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-primary/40 group-hover:text-primary/60 transition-colors duration-300">
                        {getIcon(category.icon)}
                      </div>
                    </div>
                  )}
                  
                  {/* Product Count Badge */}
                  {productCount > 0 && (
                    <Badge 
                      className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white"
                      variant="secondary"
                    >
                      {productCount} items
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-primary">
                      {getIcon(category.icon)}
                    </div>
                    <h3 className="text-lg font-playfair font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Explore Collection</span>
                    <span className="text-primary font-medium">
                      →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
