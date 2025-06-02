
import { Link } from "react-router-dom";
import { Salad, Beef, Package } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Vegetable Pickles",
      description: "Traditional vegetable pickles made with fresh vegetables and spices",
      image: "https://images.unsplash.com/photo-1589216532372-1c2a367900d9",
      icon: <Salad className="w-6 h-6" />,
      link: "/shop?category=Vegetable Pickles"
    },
    {
      id: 2,
      name: "Fruit Pickles",
      description: "Sweet and tangy fruit pickles including mango, lemon and tamarind varieties",
      image: "https://images.unsplash.com/photo-1574484284002-952d92456975",
      icon: <Beef className="w-6 h-6" />,
      link: "/shop?category=Fruit Pickles"
    },
    {
      id: 3,
      name: "Spice Blends",
      description: "Aromatic spice blends and masala powders for authentic flavors",
      image: "https://images.unsplash.com/photo-1567606855340-df87e6a35b5e",
      icon: <Package className="w-6 h-6" />,
      link: "/shop?category=Spice Blends"
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
