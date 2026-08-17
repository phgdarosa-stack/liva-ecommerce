import { Compass } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16">
      <EmptyState
        icon={<Compass size={40} strokeWidth={1} />}
        title="Essa página não existe."
        description="O link pode estar quebrado ou a página pode ter sido movida."
        ctaLabel="Voltar para a loja"
        ctaHref="/"
      />
    </div>
  );
}
