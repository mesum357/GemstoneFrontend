import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-16 text-center border-b border-primary-foreground/20">
          <h3 className="text-luxury text-3xl font-bold mb-4">
            Stay Updated on New Arrivals
          </h3>
          <p className="text-elegant text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Be the first to know about rare gemstone discoveries, exclusive collections, 
            and special offers from our Pakistani mines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button className="btn-gold">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-luxury text-2xl font-bold mb-6">
              Pak<span className="text-secondary">Gems</span>
            </h2>
            <p className="text-elegant opacity-90 mb-6 leading-relaxed">
              Pakistan's premier source for authentic, lab-certified gemstones 
              directly from legendary mining regions.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-luxury text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                "All Gemstones",
                "Certified Stones", 
                "New Arrivals",
                "Best Sellers",
                "Custom Cuts",
                "Bulk Orders"
              ].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-elegant opacity-90 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-luxury text-lg font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Gemstone Education",
                "Certification Guide",
                "Shipping & Returns",
                "Size Guide",
                "Care Instructions"
              ].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-elegant opacity-90 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-luxury text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-secondary" />
                <div>
                  <p className="text-elegant opacity-90">
                    Gem Trading Center<br />
                    Peshawar, Pakistan
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary" />
                <p className="text-elegant opacity-90">+92 91 123 4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary" />
                <p className="text-elegant opacity-90">info@pakgems.com</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-primary-foreground/20" />

        {/* Bottom Bar */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-elegant opacity-90 text-sm">
            © 2024 PakGems. All rights reserved. Proudly serving since 1999.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-elegant opacity-90 hover:opacity-100 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-elegant opacity-90 hover:opacity-100 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-elegant opacity-90 hover:opacity-100 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;