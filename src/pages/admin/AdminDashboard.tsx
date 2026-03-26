import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subDays } from "date-fns";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, total, created_at, status"),
      ]);

      const orders = ordersRes.data ?? [];
      const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
      const pendingOrders = orders.filter((o) => o.status === "pending").length;

      // Last 7 days revenue
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayStr = format(date, "yyyy-MM-dd");
        const label = format(date, "MMM d");
        const dayRevenue = orders
          .filter((o) => o.created_at.startsWith(dayStr))
          .reduce((s, o) => s + Number(o.total), 0);
        return { day: label, revenue: dayRevenue };
      });

      return {
        totalProducts: productsRes.count ?? 0,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        revenueChart: last7,
      };
    },
  });

  const cards = [
    { label: "Total Products", value: stats?.totalProducts ?? 0, icon: Package, fmt: (v: number) => v.toString() },
    { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingCart, fmt: (v: number) => v.toString() },
    { label: "Revenue", value: stats?.totalRevenue ?? 0, icon: DollarSign, fmt: (v: number) => `$${v.toFixed(2)}` },
    { label: "Pending", value: stats?.pendingOrders ?? 0, icon: TrendingUp, fmt: (v: number) => v.toString() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, fmt }) => (
          <Card key={label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-display font-bold text-foreground">{fmt(value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.revenueChart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
