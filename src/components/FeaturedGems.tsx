import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";
import { mockProducts } from "@/data/mockProducts";
import { ArrowRight } from "lucide-react";

const FeaturedGems = () => {
  const featuredProducts = mockProducts.slice(0, 6);

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

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["All", "Ruby", "Sapphire", "Emerald", "Aquamarine", "Tourmaline"].map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className={category === "All" ? "btn-emerald" : "hover:btn-sapphire"}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <div key={product.id} className="animate-fade-in-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" className="btn-sapphire px-8 py-4 rounded-full">
            View All Gemstones
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGems;