import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye, Award } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  type: string;
  image: string;
  price: number;
  carat: number;
  origin: string;
  certified: boolean;
  treatment: string;
  shape: string;
  color: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" className="rounded-full">
              <Eye className="w-4 h-4 mr-1" />
              Quick View
            </Button>
            <Button size="sm" className="btn-emerald rounded-full">
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
        </div>
        
        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart 
            className={`w-4 h-4 ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-white'
            }`} 
          />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-luxury text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm">{product.type} • {product.shape}</p>
          </div>
          <div className="text-right">
            <p className="text-luxury text-xl font-bold text-primary">
              ${product.price.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>{product.carat} ct</span>
          <span>•</span>
          <span>{product.color}</span>
          <span>•</span>
          <span>{product.origin}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {product.treatment}
          </Badge>
          <Button size="sm" variant="outline" className="hover:btn-sapphire">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;