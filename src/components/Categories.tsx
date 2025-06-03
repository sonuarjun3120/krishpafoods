
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Salad, Beef, Package } from "lucide-react";
import { supabaseContentService, Category } from "@/services/supabaseContentService";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await supabaseContentService.getCategories();
      setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  // Icon mapping for categories
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Salad':
        return <Salad className="w-6 h-6" />;
      case 'Beef':
        return <Beef className="w-6 h-6" />;
      case 'Package':
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[400px] bg-gray-200 animate-pulse rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-[400px]">
          <div className="bg-gray-200 animate-pulse rounded-2xl"></div>
          <div className="bg-gray-200 animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories available.</p>
      </div>
    );
  }

  const [firstCategory, ...restCategories] = categories;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First category - large display */}
      <Link 
        to={`/shop?category=${encodeURIComponent(firstCategory.name)}`}
        className="relative overflow-hidden rounded-2xl group h-[400px] transition-transform hover:scale-[1.02] duration-300"
      >
        <img
          src={firstCategory.image || "https://images.unsplash.com/photo-1589216532372-1c2a367900d9"}
          alt={firstCategory.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-6">
          <div className="flex items-center gap-2 text-white mb-2">
            {getIcon(firstCategory.icon)}
            <h3 className="text-2xl font-playfair font-bold">{firstCategory.name}</h3>
          </div>
          <p className="text-white/90">{firstCategory.description}</p>
        </div>
      </Link>

      {/* Rest of categories - grid display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-[400px]">
        {restCategories.slice(0, 2).map((category) => (
          <Link
            key={category.id}
            to={`/shop?category=${encodeURIComponent(category.name)}`}
            className="relative overflow-hidden rounded-2xl group transition-transform hover:scale-[1.02] duration-300"
          >
            <img
              src={category.image || "https://images.unsplash.com/photo-1567606855340-df87e6a35b5e"}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-4">
              <div className="flex items-center gap-2 text-white mb-1">
                {getIcon(category.icon)}
                <h3 className="text-xl font-playfair font-bold">{category.name}</h3>
              </div>
              <p className="text-white/90 text-sm">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
