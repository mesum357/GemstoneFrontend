import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Forgot Password | VitalGeo Naturals";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Implement forgot password API call when backend is ready
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSuccess(true);
      toast({
        title: "Email Sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send reset email. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="border-2 border-border/50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-luxury text-3xl">Check Your Email</CardTitle>
                  <CardDescription className="text-lg">
                    We've sent password reset instructions to your email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Please check your email inbox and follow the instructions to reset your password.
                    If you don't see the email, check your spam folder.
                  </p>
                  <Button asChild className="w-full btn-emerald" size="lg">
                    <Link to="/login">Back to Login</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-luxury text-3xl">Forgot Password</CardTitle>
                <CardDescription className="text-lg">
                  Enter your email and we'll send you reset instructions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-emerald"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Instructions"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ForgotPassword;

