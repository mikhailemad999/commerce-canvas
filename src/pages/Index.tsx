import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import CartDrawer from "@/components/CartDrawer";
import HeroBanner from "@/components/HeroBanner";
import { useProducts } from "@/hooks/use-products";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: products = [], isLoading } = useProducts();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory, products]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onSearch={setSearchQuery}
        onCartOpen={() => setCartOpen(true)}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <CategorySidebar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <HeroBanner />

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              {selectedCategory && <span className="text-gold"> in {selectedCategory}</span>}
              {searchQuery && <span> matching "<span className="text-gold">{searchQuery}</span>"</span>}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((product, i) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p className="text-lg">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Index;
