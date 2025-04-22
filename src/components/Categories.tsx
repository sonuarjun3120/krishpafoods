
import { Link } from "react-router-dom";
import { LucideSalad, Beef, Fish } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Vegetarian Pickles",
      description: "Traditional vegetarian pickles made with fresh vegetables and spices",
      image: "https://images.unsplash.com/photo-1589216532372-1c2a367900d9",
      icon: <LucideSalad className="w-6 h-6" />,
      link: "/shop?category=veg"
    },
    {
      id: 2,
      name: "Non-Vegetarian",
      description: "Premium meat and seafood-based pickles including chicken, mutton, fish and prawns",
      image: "https://images.unsplash.com/photo-1574484284002-952d92456975",
      icon: <Beef className="w-6 h-6" />,
      link: "/shop?category=nonveg"
    },
    {
      id: 3,
      name: "Combo Packs",
      description: "Special combination packs of our best-selling pickles",
      image: "https://images.unsplash.com/photo-1567606855340-df87e6a35b5e",
      icon: <Fish className="w-6 h-6" />,
      link: "/shop?category=combo"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link 
        to={categories[0].link}
        className="relative overflow-hidden rounded-2xl group h-[400px] transition-transform hover:scale-[1.02] duration-300"
      >
        <img
          src={categories[0].image}
          alt={categories[0].name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-6">
          <div className="flex items-center gap-2 text-white mb-2">
            {categories[0].icon}
            <h3 className="text-2xl font-playfair font-bold">{categories[0].name}</h3>
          </div>
          <p className="text-white/90">{categories[0].description}</p>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-[400px]">
        {categories.slice(1).map((category) => (
          <Link
            key={category.id}
            to={category.link}
            className="relative overflow-hidden rounded-2xl group transition-transform hover:scale-[1.02] duration-300"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-4">
              <div className="flex items-center gap-2 text-white mb-1">
                {category.icon}
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
