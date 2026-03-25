import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, LogOut, Package } from "lucide-react";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setFullName(data.full_name);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => navigate("/")} onCartOpen={() => setCartOpen(true)} onMenuToggle={() => {}} />

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="font-display text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
          <User className="h-6 w-6 text-gold" />
          My Profile
        </h1>

        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div>
            <Label className="text-sm text-muted-foreground">Email</Label>
            <Input value={user?.email ?? ""} disabled className="mt-1 bg-secondary border-border opacity-60" />
          </div>

          <div>
            <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 bg-secondary border-border focus:border-gold focus:ring-gold/20"
              maxLength={100}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 font-semibold"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            variant="outline"
            className="w-full border-border text-muted-foreground hover:text-foreground h-10"
            onClick={() => navigate("/orders")}
          >
            <Package className="h-4 w-4 mr-2" />
            Order History
          </Button>

          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </main>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ProfilePage;
