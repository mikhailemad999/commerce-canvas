const ProductSkeleton = () => (
  <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
    <div className="aspect-square bg-secondary" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-secondary rounded w-1/3" />
      <div className="h-4 bg-secondary rounded w-full" />
      <div className="h-4 bg-secondary rounded w-2/3" />
      <div className="h-3 bg-secondary rounded w-1/4" />
      <div className="h-5 bg-secondary rounded w-1/3" />
      <div className="h-9 bg-secondary rounded w-full" />
    </div>
  </div>
);

export default ProductSkeleton;
