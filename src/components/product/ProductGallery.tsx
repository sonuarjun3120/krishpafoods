
import { useState } from 'react';

interface ProductGalleryProps {
  image: string;
  name: string;
}

const ProductGallery = ({ image, name }: ProductGalleryProps) => {
  // For demonstration, create multiple views of the same image
  // In a real app, you would get an array of different images
  const images = [
    image,
    "https://images.unsplash.com/photo-1589216532372-1c2a367900d9",
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  ];
  
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="md:w-1/2 p-4">
      <div className="mb-4">
        <img 
          src={selectedImage} 
          alt={name} 
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`cursor-pointer border-2 ${selectedImage === img ? 'border-[#5C2A12]' : 'border-gray-200'} rounded-md overflow-hidden w-20 h-20`}
            onClick={() => setSelectedImage(img)}
          >
            <img 
              src={img} 
              alt={`${name} view ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
