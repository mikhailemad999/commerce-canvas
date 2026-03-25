import { useCategories } from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CategorySidebar = ({ selectedCategory, onSelectCategory, isOpen, onClose }: CategorySidebarProps) => {
  const { data: categories = [] } = useCategories();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-0 h-full lg:h-[calc(100vh-4rem)] w-64 bg-surface-elevated lg:bg-transparent border-r border-border p-4 transition-transform duration-300 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="font-display text-lg text-gold">Categories</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="font-display text-lg text-gold mb-4 hidden lg:block">Categories</h2>

        <nav className="space-y-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors",
              selectedCategory === null
                ? "bg-primary/10 text-gold font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2",
                selectedCategory === cat.id
                  ? "bg-primary/10 text-gold font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="font-display text-sm text-gold mb-3">Quick Filters</h3>
          <div className="space-y-1">
            {["Under $100", "$100 – $500", "$500 – $1000", "Over $1000"].map((label) => (
              <button
                key={label}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default CategorySidebar;
