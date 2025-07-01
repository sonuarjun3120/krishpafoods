
import { useState } from 'react';

interface ProductGalleryProps {
  image: string;
  name: string;
  productId: number;
  additionalImages?: string[];
}

const ProductGallery = ({ image, name, productId, additionalImages = [] }: ProductGalleryProps) => {
  // Combine main image with additional images from database
  const getProductImages = (mainImage: string, additional: string[]) => {
    const images = [mainImage];
    
    // Add additional images from database if they exist
    if (additional && Array.isArray(additional)) {
      images.push(...additional.filter(img => img && img.trim()));
    }
    
    return images;
  };

  const images = getProductImages(image, additionalImages);
  
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="md:w-1/2 p-4">
      <div 
        className="mb-4 relative overflow-hidden rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={selectedImage} 
          alt={name} 
          className={`w-full h-96 object-cover transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        )}
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
