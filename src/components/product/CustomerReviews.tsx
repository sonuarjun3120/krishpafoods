import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: number;
  name: string;
  city: string;
  rating: number;
  comment: string;
}

const CustomerReviews = () => {
  const reviews: Review[] = [
    {
      id: 1,
      name: "స్వాతి",
      city: "హైదరాబాద్",
      rating: 5,
      comment: "గొంగూర పచ్చడి రుచిగా ఉంది, స్వచ్ఛంగా ప్యాక్ చేశారు."
    },
    {
      id: 2,
      name: "రమేష్",
      city: "గుంటూరు",
      rating: 5,
      comment: "ఇలాంటి హోమేడ్ టేస్ట్ చాలా రోజుల తరువాత తింటున్నా."
    },
    {
      id: 3,
      name: "లక్ష్మి",
      city: "విజయవాడ",
      rating: 4,
      comment: "కచ్చితంగా మళ్లీ ఆర్డర్ చేస్తాను."
    },
    {
      id: 4,
      name: "వేణు",
      city: "విశాఖపట్నం",
      rating: 5,
      comment: "చాలా రుచిగా ఉంది. నాణ్యత బాగుంది."
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="mt-12">
      <h2 className="font-playfair text-2xl font-bold text-primary mb-6">
        కస్టమర్ రివ్యూలు
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-600">{review.city}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                "{review.comment}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-1 text-sm text-gray-600">
          <span>సరాసరి రేటింగ్:</span>
          <div className="flex items-center space-x-1 ml-2">
            {renderStars(5)}
            <span className="font-medium">4.8/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;