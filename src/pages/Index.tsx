import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GemstoneCategories from "@/components/GemstoneCategories";
import FeaturedGems from "@/components/FeaturedGems";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // SEO optimization
    document.title = "PakGems - Premium Pakistani Gemstones | Certified Ruby, Sapphire & Emerald";
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Discover authentic Pakistani gemstones from Kashmir, Swat Valley & Hunza. Lab-certified rubies, sapphires, emeralds. Premium quality, direct from source. Shop now!'
      );
    }

    // Keywords meta tag
    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = 'Pakistani gemstones, Kashmir sapphire, Swat emerald, Hunza ruby, certified gemstones, precious stones Pakistan, gemstone dealer, authentic gems';
    document.head.appendChild(metaKeywords);

    // Structured data for gemstone business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "PakGems",
      "description": "Premium Pakistani gemstones dealer specializing in certified rubies, sapphires, and emeralds",
      "url": window.location.origin,
      "priceRange": "$100-$50000",
      "paymentAccepted": ["Credit Card", "PayPal", "Bank Transfer"],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Pakistan",
        "addressLocality": "Peshawar"
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup meta tags on unmount
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) keywordsMeta.remove();
      
      const ldJsonScript = document.querySelector('script[type="application/ld+json"]');
      if (ldJsonScript) ldJsonScript.remove();
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <GemstoneCategories />
      <FeaturedGems />
      <Footer />
    </main>
  );
};

export default Index;
