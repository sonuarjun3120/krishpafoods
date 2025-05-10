
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Lakshmi Reddy",
    location: "Hyderabad, India",
    quote: "Krishpa's Avakaya pickle reminds me of my grandmother's recipe. Authentic taste that brings back childhood memories!"
  },
  {
    id: 2,
    name: "Ravi Kumar",
    location: "Dallas, USA",
    quote: "Living abroad, I missed the taste of home. Krishpa's pickles are exactly what I needed. The Gongura pickle is exceptional!"
  },
  {
    id: 3,
    name: "Anusha Patel",
    location: "Bengaluru, India",
    quote: "I order regularly for my family. The quality and taste are consistent every time. Tomato pickle is our favorite!"
  },
  {
    id: 4,
    name: "Suresh Menon",
    location: "Mumbai, India",
    quote: "The pickle flavors are so authentic and delicious. It's like having a piece of home at every meal!"
  }
];

// Function to add a new testimonial
export const addTestimonial = (name: string, location: string, quote: string): Testimonial => {
  const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
  const newTestimonial: Testimonial = {
    id: newId,
    name,
    location,
    quote
  };
  
  testimonials.unshift(newTestimonial); // Add to the beginning to show newest first
  return newTestimonial;
};

export default testimonials;
