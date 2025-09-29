import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingBag, User, Heart, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-luxury text-2xl text-primary">
              Pak<span className="text-accent">Gems</span>
            </h1>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-elegant hover:text-primary transition-colors">
              Gemstones
            </a>
            <a href="#" className="text-elegant hover:text-primary transition-colors">
              Jewelry
            </a>
            <a href="#" className="text-elegant hover:text-primary transition-colors">
              Certified
            </a>
            <a href="#" className="text-elegant hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="text-elegant hover:text-primary transition-colors">
              Education
            </a>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center bg-muted rounded-full px-4 py-2 w-80">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Search gemstones..."
              className="bg-transparent flex-1 outline-none text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-elegant hover:text-primary transition-colors py-2">
                Gemstones
              </a>
              <a href="#" className="text-elegant hover:text-primary transition-colors py-2">
                Jewelry
              </a>
              <a href="#" className="text-elegant hover:text-primary transition-colors py-2">
                Certified
              </a>
              <a href="#" className="text-elegant hover:text-primary transition-colors py-2">
                About
              </a>
              <a href="#" className="text-elegant hover:text-primary transition-colors py-2">
                Education
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;