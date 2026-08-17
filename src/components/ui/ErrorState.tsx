"use client";

import Button from "@/components/ui/Button";

export default function ErrorState({
  reset,
  message = "Algo deu errado. Tente novamente.",
}: {
  reset?: () => void;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <p className="font-serif-editorial text-2xl mb-2">Ops.</p>
      <p className="text-sm text-black/55 max-w-sm mb-6">{message}</p>
      <div className="flex gap-3">
        {reset && (
          <Button variant="outline" onClick={reset}>
            Tentar novamente
          </Button>
        )}
        <Button href="/">Voltar para a loja</Button>
      </div>
    </div>
  );
}
