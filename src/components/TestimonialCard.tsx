
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  name: string;
  location: string;
  quote: string;
  image?: string;
}

const TestimonialCard = ({ name, location, quote, image }: TestimonialProps) => {
  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {image && (
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="mb-4 text-amber-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.59455 16C9.59455 16.5523 9.14684 17 8.59455 17H4.59455C4.04227 17 3.59455 16.5523 3.59455 16V13C3.59455 10.7909 5.38541 9 7.59455 9H8.59455C9.14684 9 9.59455 9.44772 9.59455 10V16Z" fill="currentColor"/>
              <path d="M19.5946 16C19.5946 16.5523 19.1468 17 18.5946 17H14.5946C14.0423 17 13.5946 16.5523 13.5946 16V13C13.5946 10.7909 15.3854 9 17.5946 9H18.5946C19.1468 9 19.5946 9.44772 19.5946 10V16Z" fill="currentColor"/>
            </svg>
          </div>
          <p className="text-gray-700 mb-4">{quote}</p>
          <h4 className="font-playfair font-semibold text-primary">{name}</h4>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
