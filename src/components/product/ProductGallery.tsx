
import { useState } from 'react';

interface ProductGalleryProps {
  image: string;
  name: string;
  productId: number;
}

const ProductGallery = ({ image, name, productId }: ProductGalleryProps) => {
  // Create unique images array based on the productId
  const getProductImages = (id: number, mainImage: string) => {
    const baseImages = [mainImage];
    
    // Add product-specific secondary images
    switch(id) {
      case 1: // Avakaya Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
          "https://images.unsplash.com/photo-1608500218890-c4914cf4d7c0"
        );
        break;
      case 2: // Gongura Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1439886183900-e79ec0057170",
          "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
        );
        break;
      case 3: // Tomato Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1485833077593-4278bba3f11f",
          "https://images.unsplash.com/photo-1438565434616-3ef039228b15"
        );
        break;
      case 4: // Lemon Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac",
          "https://images.unsplash.com/photo-1441057206919-63d19fac2369"
        );
        break;
      case 5: // Green Chili Pickle
        baseImages.push(
          "https://images.unsplash.com/photo-1501286353178-1ec881214838",
          "https://images.unsplash.com/photo-1469041797191-50ace28483c3"
        );
        break;
      default:
        // For products without specific images, use generic ones
        baseImages.push(
          "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2",
          "https://images.unsplash.com/photo-1487252665478-49b61b47f302"
        );
    }
    
    return baseImages;
  };

  const images = getProductImages(productId, image);
  
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
