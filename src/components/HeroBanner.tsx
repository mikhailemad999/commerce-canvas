import { Sparkles } from "lucide-react";

const HeroBanner = () => (
  <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-card via-secondary to-card border border-border p-6 md:p-10 mb-8">
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-gold" />
        <span className="text-xs text-gold uppercase tracking-widest font-medium">Premium Collection</span>
      </div>
      <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground leading-tight">
        Discover <span className="text-gold">Luxury</span> Redefined
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm md:text-base">
        Curated selection of premium products crafted for those who appreciate the finer things in life.
      </p>
    </div>
    {/* Decorative */}
    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute -right-5 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
  </div>
);

export default HeroBanner;
