import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-gemstones.jpg";

const Hero = () => {
  return (
    <section className="hero-parallax min-h-screen flex items-center justify-center relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-luxury text-6xl md:text-8xl mb-6 animate-fade-in-up">
          Rare Pakistani
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-yellow-400">
            Gemstones
          </span>
        </h1>
        
        <p className="text-elegant text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up [animation-delay:200ms]">
          Discover ethically sourced, lab-certified precious stones from the 
          legendary mines of Pakistan
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up [animation-delay:400ms]">
          <Button 
            size="lg" 
            className="btn-emerald text-lg px-8 py-4 rounded-full"
          >
            Explore Collection
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg px-8 py-4 rounded-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            Learn About Our Gems
          </Button>
        </div>
        
        <div className="flex justify-center items-center gap-8 text-sm opacity-80 animate-fade-in-up [animation-delay:600ms]">
          <div className="text-center">
            <div className="text-2xl font-bold">500+</div>
            <div>Premium Stones</div>
          </div>
          <div className="w-px h-12 bg-white/30" />
          <div className="text-center">
            <div className="text-2xl font-bold">100%</div>
            <div>Lab Certified</div>
          </div>
          <div className="w-px h-12 bg-white/30" />
          <div className="text-center">
            <div className="text-2xl font-bold">25+</div>
            <div>Years Experience</div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/60" />
      </div>
    </section>
  );
};

export default Hero;