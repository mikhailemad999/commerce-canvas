import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";

const shippingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  address: z.string().trim().min(1, "Address is required").max(200),
  city: z.string().trim().min(1, "City is required").max(100),
  zip: z.string().trim().min(1, "ZIP code is required").max(20),
  country: z.string().trim().min(1, "Country is required").max(100),
});

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "US",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePlaceOrder = async () => {
    const result = shippingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!user || items.length === 0) return;

    setPlacing(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total: totalPrice,
          shipping_name: result.data.name,
          shipping_address: result.data.address,
          shipping_city: result.data.city,
          shipping_zip: result.data.zip,
          shipping_country: result.data.country,
        })
        .select("id")
        .single();

      if (orderError || !order) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price * (1 - item.product.discount / 100),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={() => navigate("/")} onCartOpen={() => {}} onMenuToggle={() => {}} />
        <main className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
          <h1 className="font-display text-xl text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground text-sm mb-6">Add some items before checking out.</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
          </Button>
        </main>
      </div>
    );
  }

  const fields = [
    { key: "name", label: "Full Name", placeholder: "John Doe" },
    { key: "address", label: "Address", placeholder: "123 Main St" },
    { key: "city", label: "City", placeholder: "New York" },
    { key: "zip", label: "ZIP Code", placeholder: "10001" },
    { key: "country", label: "Country", placeholder: "US" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => navigate("/")} onCartOpen={() => {}} onMenuToggle={() => {}} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-4 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Checkout</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Shipping Form */}
          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h2 className="font-display text-lg text-primary">Shipping Details</h2>
            {fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label htmlFor={key} className="text-sm text-muted-foreground">{label}</Label>
                <Input
                  id={key}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  className="mt-1 bg-secondary border-border focus:border-primary focus:ring-primary/20"
                />
                {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-5 space-y-4 h-fit">
            <h2 className="font-display text-lg text-primary">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const discounted = item.product.price * (1 - item.product.discount / 100);
                return (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-foreground truncate mr-2">
                      {item.product.name} <span className="text-muted-foreground">×{item.quantity}</span>
                    </span>
                    <span className="text-foreground font-medium shrink-0">
                      ${(discounted * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            <Separator className="bg-border" />
            <div className="flex justify-between">
              <span className="font-medium text-foreground">Total</span>
              <span className="font-display text-xl text-primary">${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              className="w-full h-11 font-semibold"
              disabled={placing}
              onClick={handlePlaceOrder}
            >
              {placing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Placing Order...</> : "Place Order"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
