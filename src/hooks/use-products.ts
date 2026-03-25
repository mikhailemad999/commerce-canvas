import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Category } from "@/lib/types";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
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
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        discount: data.discount,
        category: data.category ?? "",
        brand: data.brand,
        stock: data.stock,
        rating: Number(data.rating),
        reviewCount: data.review_count,
        images: data.images ?? ["/placeholder.svg"],
      };
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
}
