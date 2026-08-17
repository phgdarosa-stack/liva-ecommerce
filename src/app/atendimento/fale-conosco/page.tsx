import type { Metadata } from "next";
import ContentPage from "@/components/ui/ContentPage";

export const metadata: Metadata = { title: "Fale conosco — LIVA" };

export default function FaleConoscoPage() {
  return (
    <ContentPage title="Fale conosco">
      <p>
        Nosso time de atendimento responde de segunda a sexta, das 9h às 18h, e aos sábados das 9h
        às 13h.
      </p>
      <div className="not-prose space-y-1.5 pt-2">
        <p>
          <strong className="text-black">E-mail:</strong> atendimento@liva.com.br
        </p>
        <p>
          <strong className="text-black">WhatsApp:</strong> (11) 4000-1234
        </p>
      </div>
      <p className="pt-2">
        Para dúvidas sobre um pedido específico, tenha em mãos o número do pedido — você encontra
        em <strong>Minha Conta &gt; Pedidos</strong>.
      </p>
    </ContentPage>
  );
}
