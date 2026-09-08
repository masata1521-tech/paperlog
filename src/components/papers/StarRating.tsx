import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number | null }) {
  if (!rating) {
    return <span className="text-xs text-neutral-400 dark:text-neutral-500">未評価</span>;
  }
  return (
    <div className="flex items-center gap-0.5" aria-label={`関連度 ${rating} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-amber-400 text-amber-400 dark:text-amber-300" : "text-neutral-300 dark:text-neutral-600"}
        />
      ))}
    </div>
  );
}
