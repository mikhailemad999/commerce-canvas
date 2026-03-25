import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/use-products";
import ProductDetail from "@/components/ProductDetail";
import ProductSkeleton from "@/components/ProductSkeleton";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { useState } from "react";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const { data: product, isLoading } = useProduct(id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => navigate("/")} onCartOpen={() => setCartOpen(true)} onMenuToggle={() => {}} />
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : product ? (
          <ProductDetail product={product} onBack={() => navigate("/")} />
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Product not found.</p>
          </div>
        )}
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ProductPage;
