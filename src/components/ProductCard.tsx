import { Product } from "@/lib/types";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const discountedPrice = product.price * (1 - product.discount / 100);
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden card-hover">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-secondary overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!user) { navigate("/login"); return; }
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm p-1.5 rounded-full transition-colors hover:bg-background/90"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "text-destructive fill-destructive" : "text-foreground"}`} />
        </button>
        {product.stock < 10 && (
          <span className="absolute bottom-3 right-3 bg-destructive/90 text-destructive-foreground text-xs px-2 py-1 rounded-full">
            Low stock
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-body text-sm font-medium text-foreground leading-tight line-clamp-2 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-lg font-semibold text-gold">${discountedPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
          )}
        </div>

        {/* Add to cart */}
        <Button
          onClick={() => addToCart(product)}
          className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-1.5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
