import { cn } from "@/lib/utils";

const STEPS = [
  { key: "entrega", label: "Entrega" },
  { key: "pagamento", label: "Pagamento" },
  { key: "revisao", label: "Revisão" },
];

export default function Stepper({ current }: { current: string }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex items-center gap-2 mb-10" aria-label="Progresso do checkout">
      {STEPS.map((step, i) => (
        <li key={step.key} className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full text-xs shrink-0",
              i <= currentIndex ? "bg-black text-white" : "bg-black/10 text-black/40"
            )}
            aria-current={i === currentIndex ? "step" : undefined}
          >
            {i + 1}
          </span>
          <span className={cn("text-sm hidden sm:inline", i <= currentIndex ? "text-black" : "text-black/40")}>
            {step.label}
          </span>
          {i < STEPS.length - 1 && <span className="w-6 sm:w-10 h-px bg-black/15" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}
