import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact Us | VitalGeo Naturals";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Get in touch with VitalGeo Naturals. Contact us for inquiries about our authentic gemstones and Himalayan Shilajit products.'
      );
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Get In Touch
            </Badge>
            <h1 className="text-luxury text-5xl md:text-7xl font-bold mb-6">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-elegant text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about our products? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Card className="text-center border-2 border-border/50 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-luxury">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">info@vitalgeonaturals.com</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-border/50 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-luxury">Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">+92 XXX XXXX XXX</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-border/50 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-luxury">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Gilgit-Baltistan, Pakistan</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="text-luxury text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="What is this regarding?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea 
                      rows={6}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Your message here..."
                    />
                  </div>
                  <Button type="submit" className="w-full btn-emerald" size="lg">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
