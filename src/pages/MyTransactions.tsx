import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Receipt,
  Download,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Payment {
  _id: string;
  bookingId: string;
  productId: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  accountName?: string;
  transactionId?: string;
  screenshot: string;
  amount: number;
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
}

const MyTransactions = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewReceiptOpen, setViewReceiptOpen] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string>("");
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  // Check for new payment status updates periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchTransactions(true); // Pass true to show notifications
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchTransactions = async (showNotifications = false) => {
    try {
      const wasLoading = loading;
      if (wasLoading) setLoading(true);
      
      const response = await fetch(`${API_URL}/payments/my-transactions`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const newPayments = data.payments || [];
        
        // Check for status changes if we already have payments (not initial load)
        if (showNotifications && payments.length > 0) {
          newPayments.forEach((newPayment: Payment) => {
            const oldPayment = payments.find(p => p._id === newPayment._id);
            if (oldPayment && oldPayment.status !== newPayment.status) {
              if (newPayment.status === 'verified') {
                toast({
                  title: "Payment Accepted! 🎉",
                  description: `Your payment of $${newPayment.amount.toLocaleString()} for ${newPayment.productId?.name} has been verified successfully.`,
                  duration: 5000,
                });
              } else if (newPayment.status === 'rejected') {
                toast({
                  title: "Payment Rejected",
                  description: `Your payment request has been rejected. ${newPayment.notes ? `Reason: ${newPayment.notes}` : ''}`,
                  variant: "destructive",
                  duration: 5000,
                });
              }
            }
          });
        }
        
        setPayments(newPayments);
      } else {
        if (!wasLoading) {
          toast({
            title: "Error",
            description: "Failed to fetch transactions",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (!loading) {
        toast({
          title: "Error",
          description: "Failed to fetch transactions",
          variant: "destructive",
        });
      }
    } finally {
      if (loading) setLoading(false);
    }
  };

  const handleViewReceipt = (payment: Payment) => {
    // Only allow viewing receipt for verified payments
    if (payment.status === 'verified') {
      const imageUrl = `${API_URL.replace('/api', '')}${payment.screenshot}`;
      setReceiptImage(imageUrl);
      setSelectedReceiptPayment(payment);
      setViewReceiptOpen(true);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!selectedReceiptPayment) return;

    try {
      // Dynamic import of jsPDF
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Company Header
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129); // Emerald color
      doc.text('VitalGeo Naturals', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Transaction Receipt', 105, 30, { align: 'center' });
      
      // Line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      let yPos = 45;

      // Booking ID
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text('Booking ID:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.setFont('courier', 'normal');
      doc.text(selectedReceiptPayment.bookingId, 70, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 10;

      // Product Name
      doc.setFont(undefined, 'bold');
      doc.text('Product:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(selectedReceiptPayment.productId?.name || 'N/A', 70, yPos);
      yPos += 10;

      // Amount Paid
      doc.setFont(undefined, 'bold');
      doc.text('Amount Paid:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(14);
      doc.text(`$${selectedReceiptPayment.amount.toLocaleString()}`, 70, yPos);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPos += 10;

      // Transaction ID (if available)
      if (selectedReceiptPayment.transactionId) {
        doc.setFont(undefined, 'bold');
        doc.text('Transaction ID:', 20, yPos);
        doc.setFont(undefined, 'normal');
        doc.setFont('courier', 'normal');
        doc.text(selectedReceiptPayment.transactionId, 70, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += 10;
      }

      // Account Name (if available)
      if (selectedReceiptPayment.accountName) {
        doc.setFont(undefined, 'bold');
        doc.text('Account Name:', 20, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(selectedReceiptPayment.accountName, 70, yPos);
        yPos += 10;
      }

      // Payment Date
      doc.setFont(undefined, 'bold');
      doc.text('Payment Date:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(
        new Date(selectedReceiptPayment.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        70,
        yPos
      );
      yPos += 10;

      // Verified Date (if available)
      if (selectedReceiptPayment.verifiedAt) {
        doc.setFont(undefined, 'bold');
        doc.text('Verified Date:', 20, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(
          new Date(selectedReceiptPayment.verifiedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          70,
          yPos
        );
        yPos += 10;
      }

      yPos += 10;

      // Status Badge
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(34, 197, 94); // Green
      doc.roundedRect(20, yPos - 5, 40, 8, 2, 2, 'F');
      doc.text('VERIFIED', 40, yPos, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      yPos += 15;

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('This is a computer-generated receipt.', 105, 280, { align: 'center' });
      doc.text('For inquiries, please contact VitalGeo Naturals.', 105, 285, { align: 'center' });

      // Generate filename
      const filename = `Receipt-${selectedReceiptPayment.bookingId}-${new Date().toISOString().split('T')[0]}.pdf`;

      // Save the PDF
      doc.save(filename);

      toast({
        title: "Receipt Downloaded",
        description: "Your receipt has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Successful
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const filteredPayments = statusFilter === "all"
    ? payments
    : payments.filter((payment) => payment.status === statusFilter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Please login to view your transactions</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </main>
        <Footer />
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

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Transactions</h1>
            <p className="text-muted-foreground">
              View all your payment requests and their status
            </p>
          </div>

          {/* Filter */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Successful</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center">
                <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-lg text-muted-foreground mb-2">No transactions found</p>
                <p className="text-sm text-muted-foreground">
                  {statusFilter === "all"
                    ? "You haven't made any payments yet"
                    : `No ${statusFilter} transactions found`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <Card key={payment._id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={payment.productId?.image}
                          alt={payment.productId?.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">
                            {payment.productId?.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              Amount: <span className="font-semibold text-foreground">${payment.amount.toLocaleString()}</span>
                            </span>
                            <span>•</span>
                            <span>
                              Date: {new Date(payment.createdAt).toLocaleDateString()}
                            </span>
                            {payment.transactionId && (
                              <>
                                <span>•</span>
                                <span>
                                  Txn ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{payment.transactionId}</code>
                                </span>
                              </>
                            )}
                          </div>
                          {payment.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Note: {payment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {getStatusBadge(payment.status)}
                          {payment.verifiedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(payment.verifiedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {payment.status === 'verified' && (
                          <Button
                            variant="outline"
                            onClick={() => handleViewReceipt(payment)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* View Receipt Dialog */}
      <AlertDialog open={viewReceiptOpen} onOpenChange={setViewReceiptOpen}>
        <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <Receipt className="w-6 h-6 text-primary" />
              Transaction Receipt
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your payment has been verified successfully
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-4 space-y-6">
            {selectedReceiptPayment && (
              <>
                {/* Order Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Booking ID</p>
                        <p className="font-mono font-semibold text-primary">
                          {selectedReceiptPayment.bookingId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Product</p>
                        <p className="font-semibold">
                          {selectedReceiptPayment.productId?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount Paid</p>
                        <p className="font-semibold text-lg text-primary">
                          ${selectedReceiptPayment.amount.toLocaleString()}
                        </p>
                      </div>
                      {selectedReceiptPayment.transactionId && (
                        <div>
                          <p className="text-sm text-muted-foreground">Transaction ID</p>
                          <p className="font-mono text-sm">
                            {selectedReceiptPayment.transactionId}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Date</p>
                        <p className="font-semibold">
                          {new Date(selectedReceiptPayment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      {selectedReceiptPayment.verifiedAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Verified Date</p>
                          <p className="font-semibold">
                            {new Date(selectedReceiptPayment.verifiedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                      {selectedReceiptPayment.accountName && (
                        <div>
                          <p className="text-sm text-muted-foreground">Account Name</p>
                          <p className="font-semibold">
                            {selectedReceiptPayment.accountName}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Screenshot */}
                {receiptImage && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Screenshot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={receiptImage}
                        alt="Payment Receipt"
                        className="w-full h-auto rounded-lg border"
                        onError={(e) => {
                          console.error('Failed to load receipt image');
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
          <AlertDialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt (PDF)
            </Button>
            <AlertDialogCancel onClick={() => {
              setViewReceiptOpen(false);
              setReceiptImage("");
              setSelectedReceiptPayment(null);
            }}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyTransactions;

