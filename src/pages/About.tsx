import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronDown, 
  Award, 
  Users, 
  Leaf, 
  Heart, 
  Globe, 
  Target,
  Eye,
  Building2,
  CheckCircle2
} from "lucide-react";
import heroImage from "@/assets/hero-gemstones.jpg";

const About = () => {
  useEffect(() => {
    document.title = "About Us | VitalGeo Naturals - Authentic Gemstones & Shilajit";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Learn about VitalGeo Naturals - a proud enterprise based in Gilgit-Baltistan, Pakistan, providing authentic gemstones, rare minerals, and pure Himalayan Shilajit.'
      );
    }
  }, []);

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Laboratory-tested gemstones and Shilajit ensuring highest standards"
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description: "Environmental sustainability in every step of production"
    },
    {
      icon: Users,
      title: "Fair Trade",
      description: "Supporting local communities through fair trade and responsible mining"
    },
    {
      icon: Heart,
      title: "Authenticity",
      description: "Ethically extracted and scientifically tested products"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Promoting Gilgit-Baltistan's natural wealth to global markets"
    },
    {
      icon: Building2,
      title: "Local Empowerment",
      description: "Empowering local communities through sustainable business practices"
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-parallax min-h-[70vh] flex items-center justify-center relative pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-luxury text-5xl md:text-7xl mb-6 animate-fade-in-up">
            About
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-yellow-400">
              VitalGeo Naturals
            </span>
          </h1>
          
          <p className="text-elegant text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up [animation-delay:200ms]">
            Bridging the rich natural resources of northern mountains with modern standards 
            of purity, sustainability, and quality
          </p>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Our Leadership
            </Badge>
            <h2 className="text-luxury text-4xl md:text-5xl font-bold mb-6">
              Founder And <span className="text-primary">CEO</span>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="text-center border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="text-luxury text-3xl">Mujahid Ali</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Founder and CEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-elegant text-muted-foreground">
                  Leading VitalGeo Naturals with a vision to promote the natural wealth 
                  of Gilgit-Baltistan to global markets while empowering local communities 
                  through sustainable and ethical business practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Our Story
              </Badge>
              <h2 className="text-luxury text-4xl md:text-5xl font-bold mb-6">
                About <span className="text-primary">Us</span>
              </h2>
            </div>

            <div className="space-y-6 text-elegant text-lg leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">VitalGeo Naturals (Pvt.) Ltd.</strong> is a proud enterprise based in Gilgit-Baltistan, Pakistan, dedicated to providing the world with nature's purest gifts — authentic gemstones, rare minerals, and pure Himalayan Shilajit. Founded and led by Mujahid Ali, the company bridges the rich natural resources of the northern mountains with modern standards of purity, sustainability, and quality.
              </p>
              
              <p>
                From the heart of the Himalayas, our gemstones, minerals, and Shilajit are ethically extracted, scientifically tested, and carefully refined to preserve their natural composition and potency. Every product reflects our deep respect for nature, local heritage, and customer trust.
              </p>
              
              <p>
                At VitalGeo Naturals, we are committed to empowering local communities through fair trade, sustainable mining, and responsible business practices. Our mission is to promote the unmatched natural wealth of Gilgit-Baltistan to global markets — ensuring excellence, authenticity, and purity in every product we deliver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Vision */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-luxury text-3xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-elegant text-muted-foreground leading-relaxed">
                  To become a leading global brand that promotes the natural wealth of Gilgit-Baltistan through sustainable trade in gemstones and Shilajit, while empowering local communities.
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-luxury text-3xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-elegant text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Deliver premium-quality, laboratory-tested gemstones and Shilajit.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Ensure fair trade and support local miners.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Maintain environmental sustainability in every step of production.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Build long-term trust with clients through transparency and excellence.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Panel */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-luxury text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-primary">Features</span>
            </h2>
            <p className="text-elegant text-lg text-muted-foreground max-w-2xl mx-auto">
              What sets VitalGeo Naturals apart in delivering authentic natural products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border-2 border-border/50 hover:border-primary/40 transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-luxury text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-elegant text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
