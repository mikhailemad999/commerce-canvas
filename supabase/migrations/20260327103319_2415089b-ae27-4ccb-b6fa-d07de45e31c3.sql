
-- Wishlists table
CREATE TABLE public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wishlist" ON public.wishlists
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist" ON public.wishlists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist" ON public.wishlists
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Users can insert own reviews" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
