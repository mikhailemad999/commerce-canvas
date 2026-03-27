import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profile?: { full_name: string | null };
}

export function useReviews(productId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    enabled: !!productId,
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profile:profiles(full_name)")
        .eq("product_id", productId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        ...r,
        profile: r.profile ?? { full_name: null },
      }));
    },
  });

  const submitReview = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      if (!user) throw new Error("Must be logged in");
      const { error } = await supabase.from("reviews").upsert(
        { user_id: user.id, product_id: productId!, rating, comment },
        { onConflict: "user_id,product_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast.success("Review submitted!");
    },
    onError: () => toast.error("Failed to submit review"),
  });

  const userReview = reviews.find((r) => r.user_id === user?.id);

  return {
    reviews,
    isLoading,
    submitReview: submitReview.mutate,
    isSubmitting: submitReview.isPending,
    userReview,
  };
}
