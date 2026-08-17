import { Check } from "lucide-react";
import { FULFILLMENT_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function OrderTracking({ status }: { status: string }) {
  const currentIndex = FULFILLMENT_STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="flex flex-col gap-0">
      {FULFILLMENT_STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === FULFILLMENT_STEPS.length - 1;
        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                  done ? "bg-olive text-white" : "bg-black/10 text-black/30"
                )}
              >
                {done && <Check size={13} strokeWidth={2.5} />}
              </span>
              {!isLast && <span className={cn("w-px flex-1 min-h-6", done ? "bg-olive" : "bg-black/10")} />}
            </div>
            <p className={cn("text-sm pb-6", done ? "text-black font-medium" : "text-black/40")}>
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
