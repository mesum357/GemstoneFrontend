import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import { getImageUrl } from "@/utils/api";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  productType?: 'Shilajit' | 'Gemstone';
  image: string;
  price?: number;
  category?: string;
  description?: string;
}

interface PaymentModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentModal = ({ product, open, onOpenChange }: PaymentModalProps) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
    phone: "",
    address: "",
  });
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { pkrToUsd, formatPKR, formatUSD } = useCurrency();

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful",
        description: `Your order for ${product.name} has been placed!`,
      });
      
      onOpenChange(false);
      // Reset form
      setPaymentData({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Review your gemstone and complete the payment
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <div className="border rounded-lg p-4 space-y-4">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div>
                  <h4 className="text-xl font-semibold">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.productType} • {product.category}
                  </p>
                </div>
                {product.description && (
                  <div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
                {product.price && product.price > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
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
                )}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={paymentData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                      setPaymentData({ ...paymentData, cardNumber: value });
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name *</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={paymentData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setPaymentData({ ...paymentData, expiryDate: value });
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      maxLength={4}
                      value={paymentData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPaymentData({ ...paymentData, cvv: value });
                      }}
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={paymentData.email}
                    onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={paymentData.phone}
                    onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, Country"
                    value={paymentData.address}
                    onChange={(e) => setPaymentData({ ...paymentData, address: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-emerald"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Lock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ${product.price?.toLocaleString() || '0'}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Secure payment encrypted with SSL
                </p>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

