import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().trim().min(1, "Required").max(200),
  price: z.coerce.number().positive("Must be positive"),
  discount: z.coerce.number().min(0).max(100),
  brand: z.string().trim().max(100),
  stock: z.coerce.number().int().min(0),
  description: z.string().trim().max(2000),
  category: z.string().nullable(),
  images: z.string().trim(),
});

type ProductForm = z.infer<typeof productSchema>;

const emptyForm: ProductForm = {
  name: "", price: 0, discount: 0, brand: "", stock: 0, description: "", category: null, images: "",
};

const AdminProducts = () => {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ProductForm & { id?: string }) => {
      const imagesArr = data.images.split(",").map((s) => s.trim()).filter(Boolean);
      const payload = {
        name: data.name,
        price: data.price,
        discount: data.discount,
        brand: data.brand,
        stock: data.stock,
        description: data.description,
        category: data.category || null,
        images: imagesArr,
      };

      if (data.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setDialogOpen(false);
      toast.success(editingId ? "Product updated" : "Product created");
    },
    onError: () => toast.error("Failed to save product"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (p: NonNullable<typeof products>[0]) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      discount: p.discount,
      brand: p.brand,
      stock: p.stock,
      description: p.description,
      category: p.category,
      images: (p.images ?? []).join(", "),
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = () => {
    const result = productSchema.safeParse(form);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.errors.forEach((e) => { fe[e.path[0] as string] = e.message; });
      setErrors(fe);
      return;
    }
    saveMutation.mutate({ ...result.data, id: editingId ?? undefined });
  };

  const update = (key: string, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
        <Button onClick={openNew} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : !products?.length ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No products</TableCell></TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground max-w-[200px] truncate">{p.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{p.brand}</TableCell>
                  <TableCell className="text-foreground">${Number(p.price).toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{p.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(p.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingId ? "Edit Product" : "New Product"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingId ? "Update the product details below." : "Fill in the details for the new product."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {[
              { key: "name", label: "Name", type: "text" },
              { key: "brand", label: "Brand", type: "text" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <Label className="text-sm text-muted-foreground">{label}</Label>
                <Input
                  type={type}
                  value={form[key as keyof ProductForm] as string}
                  onChange={(e) => update(key, e.target.value)}
                  className="mt-1 bg-secondary border-border"
                />
                {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
              </div>
            ))}

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "price", label: "Price" },
                { key: "discount", label: "Discount %" },
                { key: "stock", label: "Stock" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-sm text-muted-foreground">{label}</Label>
                  <Input
                    type="number"
                    value={form[key as keyof ProductForm] as number}
                    onChange={(e) => update(key, e.target.value)}
                    className="mt-1 bg-secondary border-border"
                  />
                  {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
                </div>
              ))}
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Category</Label>
              <select
                value={form.category ?? ""}
                onChange={(e) => update("category", e.target.value || null)}
                className="mt-1 w-full bg-secondary border border-border rounded-md h-10 px-3 text-foreground text-sm"
              >
                <option value="">None</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="mt-1 bg-secondary border-border min-h-[80px]"
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Image URLs (comma-separated)</Label>
              <Input
                value={form.images}
                onChange={(e) => update("images", e.target.value)}
                className="mt-1 bg-secondary border-border"
                placeholder="https://..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
