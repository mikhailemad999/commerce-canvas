import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, ArrowLeft, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product_id: string;
  products: { name: string; images: string[] } | null;
}

interface Order {
  id: string;
  total: number;
  status: string;
  payment_status: string;
  shipping_name: string;
  shipping_city: string;
  created_at: string;
  order_items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, images))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Order[];
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => navigate("/")} onCartOpen={() => setCartOpen(true)} onMenuToggle={() => {}} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-4 text-muted-foreground" onClick={() => navigate("/profile")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
        </Button>

        <h1 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          Order History
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse h-32" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), "MMM d, yyyy · h:mm a")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ship to: {order.shipping_name}, {order.shipping_city}
                    </p>
                  </div>
                  <Badge variant="outline" className={statusColors[order.status] || ""}>
                    {order.status}
                  </Badge>
                </div>

                <Separator className="bg-border mb-3" />

                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded overflow-hidden shrink-0">
                        {item.products?.images?.[0] && (
                          <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.products?.name ?? "Product"}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="bg-border my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-lg text-primary">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default OrdersPage;
