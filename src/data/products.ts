
export interface Product {
  id: number;
  name: string;
  price: number;
  weight: string;
  description: string;
  longDescription: string;
  ingredients: string[];
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  shelfLife: string;
  servingSuggestions: string[];
  image: string;
  featured: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Avakaya Pickle",
    price: 299,
    weight: "500g",
    description: "Traditional raw mango pickle with mustard and chili. A Telugu household favorite.",
    longDescription: "Our signature Avakaya is made from handpicked raw mangoes, sun-dried red chilies, and premium mustard, following an authentic family recipe that has been passed down through generations. Each jar is carefully prepared to ensure that perfect balance of tangy, spicy flavors that makes Avakaya the king of Telugu pickles.",
    ingredients: ["Raw Mangoes", "Mustard Seeds", "Chili Powder", "Sesame Oil", "Fenugreek Seeds", "Salt", "Turmeric"],
    spiceLevel: "Hot",
    shelfLife: "12 months",
    servingSuggestions: ["Mix with hot rice and ghee", "Serve with curd rice", "Pair with dosa or idli"],
    image: "https://images.unsplash.com/photo-1589216532372-1c2a367900d9",
    featured: true
  },
  {
    id: 2,
    name: "Gongura Pickle",
    price: 349,
    weight: "500g",
    description: "Tangy sorrel leaves pickle with a perfect balance of spices that complements rice perfectly.",
    longDescription: "Our Gongura pickle is a true Andhra delicacy made from fresh sorrel leaves harvested at peak season. The leaves are hand-sorted, chopped, and mixed with specially ground spices to create that distinctive tangy flavor. This pickle is the perfect accompaniment to plain rice with a dollop of ghee or with hot rotis.",
    ingredients: ["Gongura Leaves (Sorrel)", "Red Chilies", "Garlic", "Mustard Seeds", "Sesame Oil", "Salt", "Turmeric"],
    spiceLevel: "Medium",
    shelfLife: "12 months",
    servingSuggestions: ["Mix with steamed rice", "Spread on dosa", "Serve with plain paratha"],
    image: "https://images.unsplash.com/photo-1589556223844-cbfb15a21f26",
    featured: true
  },
  {
    id: 3,
    name: "Tomato Pickle",
    price: 249,
    weight: "500g",
    description: "Sweet and tangy tomato pickle made with ripe tomatoes and aromatic spices.",
    longDescription: "Our Tomato pickle combines the tanginess of vine-ripened tomatoes with the sweetness of jaggery and warmth of carefully selected spices. Slow-cooked to perfection, this pickle delivers a burst of flavors in every bite and pairs wonderfully with a variety of Indian breads and rice dishes.",
    ingredients: ["Ripe Tomatoes", "Jaggery", "Red Chilies", "Mustard Seeds", "Fenugreek Seeds", "Sesame Oil", "Salt"],
    spiceLevel: "Mild",
    shelfLife: "10 months",
    servingSuggestions: ["Pair with chapati or paratha", "Serve with curd rice", "Excellent with plain dosa"],
    image: "https://images.unsplash.com/photo-1582372685645-d53659ee6203",
    featured: true
  },
  {
    id: 4,
    name: "Lemon Pickle",
    price: 299,
    weight: "500g",
    description: "Zesty and tangy lemon pickle that adds a burst of flavor to any meal.",
    longDescription: "Our Lemon pickle features organically grown lemons that are cured in salt and then mixed with aromatic spices. The pickling process allows the lemons to develop complex flavors while maintaining their zesty character. This pickle is a refreshing accompaniment to many meals and helps aid digestion.",
    ingredients: ["Lemons", "Salt", "Red Chili Powder", "Mustard Seeds", "Fenugreek Seeds", "Turmeric", "Asafoetida"],
    spiceLevel: "Medium",
    shelfLife: "18 months",
    servingSuggestions: ["Perfect with biryani", "Great with rice and dal", "Enjoyable with plain yogurt"],
    image: "https://images.unsplash.com/photo-1621607152860-3f3bf6b1d2a9",
    featured: true
  },
  {
    id: 5,
    name: "Green Chili Pickle",
    price: 279,
    weight: "500g",
    description: "Fiery green chili pickle for those who love extra heat in their meals.",
    longDescription: "This specialty Green Chili Pickle is crafted for those who appreciate heat. Made with fresh green chilies and a special blend of spices, it delivers a powerful punch of flavor and spice that elevates simple meals. The chilies are handpicked at just the right stage of maturity to ensure optimal heat and flavor.",
    ingredients: ["Green Chilies", "Mustard Seeds", "Garlic", "Ginger", "Sesame Oil", "Salt", "Turmeric", "Fenugreek Seeds"],
    spiceLevel: "Extra Hot",
    shelfLife: "12 months",
    servingSuggestions: ["Use sparingly with plain rice", "Mix with yogurt rice", "Add to sandwiches for heat"],
    image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3",
    featured: false
  },
  {
    id: 6,
    name: "Tamarind Pickle",
    price: 269,
    weight: "500g",
    description: "Sweet and sour tamarind pickle with jaggery and mild spices. Perfect for those who prefer less heat.",
    longDescription: "Our Tamarind Pickle blends the natural sourness of tamarind with the sweetness of jaggery, creating a perfect balance of flavors. This pickle is milder than most, making it suitable for those who enjoy the tangy taste but prefer less spicy food. It's a wonderful addition to simple meals and helps stimulate the appetite.",
    ingredients: ["Tamarind", "Jaggery", "Mild Red Chilies", "Mustard Seeds", "Sesame Oil", "Salt", "Turmeric"],
    spiceLevel: "Mild",
    shelfLife: "12 months",
    servingSuggestions: ["Great with plain rice", "Perfect with South Indian breakfast items", "Pair with rotis"],
    image: "https://images.unsplash.com/photo-1563649634806-624cd1e63fc9",
    featured: false
  }
];

export default products;
