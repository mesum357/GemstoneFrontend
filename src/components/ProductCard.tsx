import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye, Award } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "@/hooks/useCurrency";
import { getImageUrl } from "@/utils/api";
import ImageModal from "./ImageModal";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  type?: string;
  productType?: 'Shilajit' | 'Gemstone';
  image: string;
  price?: number;
  carat?: number;
  origin?: string;
  certified?: boolean;
  treatment?: string;
  shape?: string;
  color?: string;
  category?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isLiked, toggleLike, getProductLikeCount } = useLikes();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { pkrToUsd, formatPKR, formatUSD } = useCurrency();
  const [showImageModal, setShowImageModal] = useState(false);

  const productId = product._id || product.id || '';
  const liked = isLiked(productId);
  const likeCount = getProductLikeCount(productId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/payment/${productId}`);
  };

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden">
        <img 
          src={getImageUrl(product.image)} 
          alt={product.name}
          className="product-image"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="rounded-full"
              onClick={handleQuickView}
            >
              <Eye className="w-4 h-4 mr-1" />
              Quick View
            </Button>
            <Button 
              size="sm" 
              className="btn-emerald rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.certified && (
            <Badge className="bg-accent text-accent-foreground">
              <Award className="w-3 h-3 mr-1" />
              Certified
            </Badge>
          )}
          {product.treatment === "Untreated" && (
            <Badge variant="secondary">
              Natural
            </Badge>
          )}
          {!product.certified && !product.treatment && product.productType && (
            <Badge variant="secondary">
              {product.productType}
            </Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          onClick={handleLike}
        >
          <div className="relative">
            <Heart 
              className={`w-4 h-4 ${
                liked ? 'fill-red-500 text-red-500' : 'text-white'
              }`} 
            />
            {likeCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs bg-white text-primary border border-primary/20"
              >
                {likeCount}
              </Badge>
            )}
          </div>
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-luxury text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              {product.productType || product.type} {product.category ? `• ${product.category}` : ''} {product.shape ? `• ${product.shape}` : ''}
            </p>
          </div>
          {product.price && product.price > 0 && (
            <div className="text-right">
              <p className="text-luxury text-xl font-bold text-primary">
                {formatPKR(product.price)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatUSD(pkrToUsd(product.price))}
              </p>
            </div>
          )}
        </div>
        
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {product.description}
          </p>
        )}
        
        {(product.carat || product.color || product.origin) && (
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            {product.carat && <span>{product.carat} ct</span>}
            {product.carat && product.color && <span>•</span>}
            {product.color && <span>{product.color}</span>}
            {(product.carat || product.color) && product.origin && <span>•</span>}
            {product.origin && <span>{product.origin}</span>}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {product.treatment && (
            <Badge variant="outline" className="text-xs">
              {product.treatment}
            </Badge>
          )}
          {product.category && !product.treatment && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            className="hover:btn-sapphire"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        imageUrl={getImageUrl(product.image)}
        productName={product.name}
        open={showImageModal}
        onOpenChange={setShowImageModal}
      />
    </div>
  );
};

export default ProductCard;