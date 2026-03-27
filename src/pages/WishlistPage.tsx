import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";

const WishlistPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["wishlist-products", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Product[]> => {
      const { data: wishlist, error: wErr } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user!.id);
      if (wErr) throw wErr;
      if (!wishlist.length) return [];

      const ids = wishlist.map((w) => w.product_id);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);
      if (error) throw error;
      return (data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        discount: p.discount,
        category: p.category ?? "",
        brand: p.brand,
        stock: p.stock,
        rating: Number(p.rating),
        reviewCount: p.review_count,
        images: p.images ?? ["/placeholder.svg"],
      }));
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => navigate("/")} onCartOpen={() => setCartOpen(true)} onMenuToggle={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-gold" />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">My Wishlist</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Heart className="h-12 w-12 mb-4" />
            <p className="text-lg">Your wishlist is empty</p>
            <p className="text-sm mt-1">Browse products and click the heart to save them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default WishlistPage;
