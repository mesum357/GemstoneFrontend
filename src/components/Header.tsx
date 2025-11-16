import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingBag, User, Heart, Menu, LogOut, Settings, X, Receipt } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductCard from "./ProductCard";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, cartCount, removeFromCart, totalPrice } = useCart();
  const { likedProducts } = useLikes();
  const { toast } = useToast();
  const { pkrToUsd, formatPKR, formatUSD } = useCurrency();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-luxury text-2xl text-primary">
              Vital<span className="text-accent">Geo</span> Naturals
            </h1>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-elegant hover:text-primary transition-colors">
              Gemstones
            </Link>
            <Link to="/shilajit" className="text-elegant hover:text-primary transition-colors">
              Shilajit
            </Link>
            <Link to="/about" className="text-elegant hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-elegant hover:text-primary transition-colors">
              Contact
            </Link>
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
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => setShowLikesModal(true)}
            >
              <Heart className="w-5 h-5" />
              {likedProducts.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {likedProducts.length}
                </Badge>
              )}
            </Button>

            {/* Authentication Section */}
            {isAuthenticated && user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => setShowCartModal(true)}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={user.email} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-transactions" className="cursor-pointer">
                        <Receipt className="mr-2 h-4 w-4" />
                        <span>My Transactions</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => setShowCartModal(true)}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
                
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button className="btn-emerald" asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              </>
            )}
            
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
              <Link to="/" className="text-elegant hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Gemstones
              </Link>
              <Link to="/shilajit" className="text-elegant hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Shilajit
              </Link>
              <Link to="/about" className="text-elegant hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="text-elegant hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="text-elegant hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="text-elegant hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
              {isAuthenticated && user && (
                <>
                  <Link to="/profile" className="text-elegant hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-elegant hover:text-primary transition-colors py-2"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}

        {/* Likes Modal */}
        <Dialog open={showLikesModal} onOpenChange={setShowLikesModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                Liked Gemstones
              </DialogTitle>
              <DialogDescription>
                Your favorite gemstones collection
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {likedProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No liked gemstones yet</p>
                  <p className="text-sm">Start liking gemstones to see them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {likedProducts.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Cart Modal */}
        <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Shopping Cart
              </DialogTitle>
              <DialogDescription>
                Review your selected gemstones
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Your cart is empty</p>
                  <p className="text-sm">Add gemstones to your cart to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div 
                        key={item._id || item.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.productType} • {item.category}
                          </p>
                          {item.price && item.price > 0 && (
                            <div className="mt-1">
                              <p className="text-lg font-bold text-primary">
                                {formatPKR(item.price)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatUSD(pkrToUsd(item.price))}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.quantity || 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item._id || item.id || '')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center text-lg font-semibold mb-4">
                      <span>Total:</span>
                      <span className="text-2xl text-primary">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <Button className="w-full btn-emerald" size="lg">
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;