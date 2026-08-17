import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(value);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-black text-black" : "fill-none text-black/25"}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      <span className="sr-only">{value.toFixed(1)} de 5 estrelas</span>
      <span className="text-xs text-black/60">
        {value.toFixed(1)}
        {count !== undefined ? ` (${count})` : ""}
      </span>
    </div>
  );
}
