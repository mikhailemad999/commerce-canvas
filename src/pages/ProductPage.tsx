import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/lib/data";
import ProductDetail from "@/components/ProductDetail";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { useState } from "react";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => navigate("/")} onCartOpen={() => setCartOpen(true)} onMenuToggle={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <ProductDetail product={product} onBack={() => navigate("/")} />
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ProductPage;
