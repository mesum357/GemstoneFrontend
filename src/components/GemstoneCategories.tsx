import { Badge } from "@/components/ui/badge";
import emeraldImage from "@/assets/emerald-sample.jpg";
import sapphireImage from "@/assets/sapphire-sample.jpg";
import rubyImage from "@/assets/ruby-sample.jpg";

const GemstoneCategories = () => {
  const categories = [
    {
      name: "Emeralds",
      description: "Vibrant green gems from Swat Valley",
      image: emeraldImage,
      count: "120+ Stones",
      color: "emerald"
    },
    {
      name: "Sapphires", 
      description: "Royal blue treasures from Kashmir",
      image: sapphireImage,
      count: "85+ Stones",
      color: "sapphire"
    },
    {
      name: "Rubies",
      description: "Pigeon blood reds from Hunza",
      image: rubyImage,
      count: "95+ Stones", 
      color: "ruby"
    }
  ];

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

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              className="group relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="aspect-[4/5] relative">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge 
                    className={`mb-3 ${
                      category.color === 'emerald' ? 'bg-emerald-600' :
                      category.color === 'sapphire' ? 'bg-blue-600' :
                      'bg-red-600'
                    }`}
                  >
                    {category.count}
                  </Badge>
                  <h3 className="text-luxury text-2xl font-bold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-elegant text-sm opacity-90">
                    {category.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-xl">→</span>
                    </div>
                    <p className="text-elegant">Explore Collection</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GemstoneCategories;