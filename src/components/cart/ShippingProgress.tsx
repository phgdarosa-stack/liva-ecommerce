import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const achieved = remaining === 0;

  return (
    <div>
      <p className="text-xs mb-2" role="status">
        {achieved ? (
          <span className="text-success font-medium">Você ganhou frete grátis.</span>
        ) : (
          <>
            Faltam <span className="font-medium">{formatPrice(remaining)}</span> para você ganhar
            frete grátis.
          </>
        )}
      </p>
      <div className="h-1 bg-black/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-olive transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
