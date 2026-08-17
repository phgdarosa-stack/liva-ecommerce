import { cn } from "@/lib/utils";

type Tone = "black" | "olive" | "error" | "outline";

const toneClasses: Record<Tone, string> = {
  black: "bg-black text-white",
  olive: "bg-olive text-white",
  error: "bg-error text-white",
  outline: "border border-black/30 text-black bg-white/80",
};

export default function Badge({
  children,
  tone = "black",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
