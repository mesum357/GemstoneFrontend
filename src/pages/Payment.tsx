import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Loader2, Lock, QrCode, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { API_URL, getImageUrl } from '@/utils/api';

interface PaymentSettings {
  _id?: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  iban?: string;
  qrCode?: string;
}

interface Product {
  _id?: string;
  id?: string;
  name: string;
  productType?: 'Shilajit' | 'Gemstone';
  image: string;
  price?: number;
  description?: string;
}

const Payment = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pkrToUsd, formatPKR, formatUSD } = useCurrency();
  const [product, setProduct] = useState<Product | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [paymentData, setPaymentData] = useState({
    accountName: "",
    transactionId: "",
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    fetchPaymentSettings();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/${productId}`);
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await fetch(`${API_URL}/payment-settings`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          setPaymentSettings(data.settings);
        }
      } else {
        console.error('Failed to fetch payment settings');
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleCopyAccountNumber = () => {
    if (paymentSettings?.accountNumber) {
      navigator.clipboard.writeText(paymentSettings.accountNumber);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Account number copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPEG or PNG)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setScreenshotFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!screenshotFile) {
      toast({
        title: "Validation Error",
        description: "Please upload a payment screenshot",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // First upload the screenshot
      const formData = new FormData();
      formData.append('screenshot', screenshotFile);
      formData.append('accountName', paymentData.accountName);
      formData.append('transactionId', paymentData.transactionId);
      formData.append('productId', productId || '');

      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Payment Request Submitted",
          description: "Your payment request has been submitted and is pending verification. You can check the status in My Transactions.",
          duration: 5000,
        });
        
        // Reset form
        setPaymentData({
          accountName: "",
          transactionId: "",
        });
        setScreenshotFile(null);
        setScreenshotPreview("");
        const input = document.getElementById('screenshot-upload') as HTMLInputElement;
        if (input) input.value = '';

        // Navigate to transactions page after successful submission
        setTimeout(() => {
          navigate("/my-transactions");
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to submit payment');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit payment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
        <Link to="/" className="mt-4">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  if (!paymentSettings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Payment settings not available</p>
        <Link to="/" className="mt-4">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Details - Left Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <Badge variant="outline" className="mt-2">
                      {product.productType}
                    </Badge>
                  </div>
                  {product.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  {product.price && product.price > 0 && (
                    <div className="pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Amount</span>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {formatPKR(product.price)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatUSD(pkrToUsd(product.price))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Payment Section - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Account Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Account Number</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={paymentSettings.accountNumber}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleCopyAccountNumber}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Account Name</Label>
                      <Input
                        value={paymentSettings.accountName}
                        readOnly
                        className="font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Bank Name</Label>
                      <Input
                        value={paymentSettings.bankName}
                        readOnly
                      />
                    </div>

                    {paymentSettings.iban && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">IBAN</Label>
                        <Input
                          value={paymentSettings.iban}
                          readOnly
                          className="font-mono"
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* QR Code */}
                  {paymentSettings.qrCode && (
                    <div className="flex flex-col items-center p-6 bg-muted/50 rounded-lg border-2 border-dashed">
                      <QrCode className="w-8 h-8 mb-4 text-primary" />
                      <Label className="text-center mb-4">Scan QR Code to Pay</Label>
                      <div className="bg-white p-4 rounded-lg">
                        <img
                          src={`${API_URL.replace('/api', '')}${paymentSettings.qrCode}`}
                          alt="QR Code"
                          className="w-48 h-48"
                          onError={(e) => {
                            console.error('Failed to load QR code image');
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-4 text-center">
                        Scan this QR code with your banking app to transfer the payment
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Submission Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Submit Payment Proof
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Your Account Name</Label>
                      <Input
                        id="accountName"
                        placeholder="Enter the name on your account (optional)"
                        value={paymentData.accountName}
                        onChange={(e) => setPaymentData({ ...paymentData, accountName: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the name associated with the account you used for payment
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transactionId">Transaction ID</Label>
                      <Input
                        id="transactionId"
                        placeholder="Enter transaction ID or reference number (optional)"
                        value={paymentData.transactionId}
                        onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the transaction ID or reference number from your payment receipt
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="screenshot">Payment Screenshot *</Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <Label
                            htmlFor="screenshot-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            {screenshotPreview ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={screenshotPreview}
                                  alt="Screenshot Preview"
                                  className="w-full h-32 object-contain rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setScreenshotPreview("");
                                    setScreenshotFile(null);
                                    const input = document.getElementById('screenshot-upload') as HTMLInputElement;
                                    if (input) input.value = '';
                                  }}
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-6">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PNG, JPG (MAX. 5MB)
                                </p>
                              </div>
                            )}
                            <input
                              id="screenshot-upload"
                              type="file"
                              className="hidden"
                              accept="image/jpeg,image/jpg,image/png"
                              onChange={handleScreenshotUpload}
                              disabled={submitting}
                            />
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Upload a clear screenshot of your payment confirmation or receipt
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-emerald"
                      size="lg"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Submit Payment Proof
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" />
                      Your payment will be verified manually by our team
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;

