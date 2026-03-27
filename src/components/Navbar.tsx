import { Search, ShoppingCart, User, Menu, Heart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onSearch: (query: string) => void;
  onCartOpen: () => void;
  onMenuToggle: () => void;
}

const Navbar = ({ onSearch, onCartOpen, onMenuToggle }: NavbarProps) => {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-elevated border-b border-border backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-xl md:text-2xl font-bold text-gold tracking-wide">LUXE</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:flex">
            <div className="relative w-full">
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                placeholder="Search premium products..."
                className="w-full bg-secondary border-border pl-4 pr-10 h-10 text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold/20"
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 text-muted-foreground hover:text-gold">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-1">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-gold hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {user ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="text-gold hover:text-gold/80">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-gold">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-gold" onClick={onCartOpen}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="sm:hidden pb-3">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              placeholder="Search..."
              className="w-full bg-secondary border-border pl-4 pr-10 h-9 text-foreground placeholder:text-muted-foreground"
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-9 text-muted-foreground">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Navbar;
