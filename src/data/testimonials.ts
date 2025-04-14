
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Lakshmi Reddy",
    location: "Hyderabad, India",
    quote: "Krishpa's Avakaya pickle reminds me of my grandmother's recipe. Authentic taste that brings back childhood memories!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  },
  {
    id: 2,
    name: "Ravi Kumar",
    location: "Dallas, USA",
    quote: "Living abroad, I missed the taste of home. Krishpa's pickles are exactly what I needed. The Gongura pickle is exceptional!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    id: 3,
    name: "Anusha Patel",
    location: "Bengaluru, India",
    quote: "I order regularly for my family. The quality and taste are consistent every time. Tomato pickle is our favorite!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
  }
];

export default testimonials;
