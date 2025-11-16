import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

import { API_URL } from '@/utils/api';

interface Product {
  _id: string;
  name: string;
  productType: 'Shilajit' | 'Gemstone';
  image: string;
  description: string;
  category: string;
  featured: boolean;
}

const FeaturedGems = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Fetch non-featured gemstones
      const response = await fetch(`${API_URL}/products?productType=Gemstone&featured=false`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Handpicked Collection
          </Badge>
          <h2 className="text-luxury text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-primary">Gemstones</span>
          </h2>
          <p className="text-elegant text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most exquisite collection of premium gemstones, 
            each carefully selected for their exceptional beauty and quality.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.map((product) => (
              <div key={product._id} className="animate-fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedGems;