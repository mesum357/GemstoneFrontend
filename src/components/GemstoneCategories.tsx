import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Product {
  _id: string;
  name: string;
  productType: 'Shilajit' | 'Gemstone';
  image: string;
  description: string;
  featured: boolean;
}

const GemstoneCategories = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products?productType=Gemstone&featured=true`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Premium Categories
          </Badge>
          <h2 className="text-luxury text-4xl md:text-5xl font-bold mb-6">
            Explore by <span className="text-accent">Gemstone</span>
          </h2>
          <p className="text-elegant text-lg text-muted-foreground max-w-2xl mx-auto">
            Each gemstone type tells a unique story of formation, rarity, and beauty. 
            Discover the perfect stone for your collection.
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No featured gemstones available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div 
                key={product._id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GemstoneCategories;