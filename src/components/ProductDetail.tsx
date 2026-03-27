import { Product } from "@/lib/types";
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReviewSection from "@/components/ReviewSection";
import { useState } from "react";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail = ({ product, onBack }: ProductDetailProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const discountedPrice = product.price * (1 - product.discount / 100);
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-gold mb-6 inline-flex items-center gap-1 transition-colors">
        ← Back to products
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-card border border-border rounded-lg overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gold-muted uppercase tracking-widest mb-2">{product.brand}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-muted-foreground"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-6">
            <span className="font-display text-3xl font-bold text-gold">${discountedPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                <span className="bg-primary/10 text-gold text-sm font-medium px-2 py-0.5 rounded">Save {product.discount}%</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground mt-6 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <p className={`text-sm mt-4 ${product.stock > 10 ? "text-green-400" : "text-destructive"}`}>
            {product.stock > 10 ? `In Stock (${product.stock} available)` : `Only ${product.stock} left!`}
          </p>

          {/* Quantity & Add to cart */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-border rounded-md">
              <button className="px-3 py-2 text-foreground hover:bg-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span className="px-4 py-2 text-sm border-x border-border">{quantity}</span>
              <button className="px-3 py-2 text-foreground hover:bg-secondary" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold" onClick={() => addToCart(product, quantity)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-11 w-11 border-border hover:border-gold ${wishlisted ? "text-destructive border-destructive" : "text-muted-foreground hover:text-gold"}`}
              onClick={() => {
                if (!user) { navigate("/login"); return; }
                toggleWishlist(product.id);
              }}
            >
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-destructive" : ""}`} />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-border">
            {[
              { icon: Truck, label: "Free Shipping" },
              { icon: Shield, label: "2 Year Warranty" },
              { icon: RotateCcw, label: "30-Day Returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center">
                <Icon className="h-5 w-5 mx-auto text-gold-muted mb-1" />
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} />
    </div>
  );
};

export default ProductDetail;
