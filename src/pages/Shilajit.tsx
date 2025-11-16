import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Award, Leaf, Mountain, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-gemstones.jpg";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Product {
  _id: string;
  name: string;
  productType: 'Shilajit' | 'Gemstone';
  image: string;
  description: string;
  category?: string;
  price?: number;
  featured: boolean;
}

const Shilajit = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Pure Himalayan Shilajit | VitalGeo Naturals";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Discover authentic Himalayan Shilajit from Gilgit-Baltistan, Pakistan. Lab-tested, pure, and ethically sourced. Premium quality Shilajit resin and extracts.'
      );
    }
    
    fetchShilajitProducts();
  }, []);

  const fetchShilajitProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products?productType=Shilajit`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch Shilajit products');
      }
    } catch (error) {
      console.error('Error fetching Shilajit products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-parallax min-h-screen flex items-center justify-center relative pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-luxury text-6xl md:text-8xl mb-6 animate-fade-in-up">
            Pure Himalayan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
              Shilajit
            </span>
          </h1>
          
          <p className="text-elegant text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up [animation-delay:200ms]">
            Authentic Shilajit from the pristine mountains of Gilgit-Baltistan, 
            ethically sourced and laboratory tested for purity
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up [animation-delay:400ms]">
            <Button 
              size="lg" 
              className="btn-emerald text-lg px-8 py-4 rounded-full"
            >
              Shop Shilajit
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 rounded-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-sm opacity-80 animate-fade-in-up [animation-delay:600ms]">
            <div className="text-center">
              <div className="text-2xl font-bold">100%</div>
              <div>Pure & Natural</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-center">
              <div className="text-2xl font-bold">Lab</div>
              <div>Tested</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-center">
              <div className="text-2xl font-bold">Ethical</div>
              <div>Sourcing</div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* Product Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Premium Collection
            </Badge>
            <h2 className="text-luxury text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-primary">Shilajit</span> Products
            </h2>
            <p className="text-elegant text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully curated selection of authentic Himalayan Shilajit, 
              each product tested for purity and potency.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-card rounded-lg border border-border/50">
              <Mountain className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-luxury text-xl font-semibold mb-2">High Altitude Source</h3>
              <p className="text-muted-foreground">
                Sourced from pristine Himalayan mountains in Gilgit-Baltistan
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border/50">
              <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-luxury text-xl font-semibold mb-2">Lab Tested</h3>
              <p className="text-muted-foreground">
                Every batch is tested for purity, potency, and authenticity
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border/50">
              <Leaf className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-luxury text-xl font-semibold mb-2">100% Natural</h3>
              <p className="text-muted-foreground">
                Pure, unprocessed Shilajit maintaining natural composition
              </p>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product._id} className="animate-fade-in-up">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No Shilajit products available at the moment.
              </p>
              <p className="text-muted-foreground mt-2">
                Please check back later or contact us for more information.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Shilajit;
