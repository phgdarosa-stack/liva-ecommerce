import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function Price({
  price,
  promoPrice,
  size = "md",
  className,
}: {
  price: number;
  promoPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const hasPromo = promoPrice != null && promoPrice < price;
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl md:text-2xl",
  }[size];

  if (!hasPromo) {
    return <span className={cn(sizeClasses, "font-medium", className)}>{formatPrice(price)}</span>;
  }

  return (
    <span className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn(sizeClasses, "font-medium text-error")}>{formatPrice(promoPrice!)}</span>
      <span className="text-xs text-black/45 line-through">{formatPrice(price)}</span>
    </span>
  );
}
