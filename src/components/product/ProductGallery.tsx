
interface ProductGalleryProps {
  image: string;
  name: string;
}

const ProductGallery = ({ image, name }: ProductGalleryProps) => {
  return (
    <div className="md:w-1/2">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ProductGallery;
