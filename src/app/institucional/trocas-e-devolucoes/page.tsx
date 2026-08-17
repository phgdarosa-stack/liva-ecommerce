import type { Metadata } from "next";
import ContentPage from "@/components/ui/ContentPage";

export const metadata: Metadata = { title: "Trocas e devoluções — LIVA" };

export default function TrocasPage() {
  return (
    <ContentPage title="Trocas e devoluções">
      <p>
        Você tem até <strong>30 dias corridos</strong> após o recebimento do pedido para solicitar
        troca ou devolução, sem custo adicional.
      </p>
      <p>Para que a solicitação seja aceita, o produto precisa:</p>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Estar sem uso, sem lavagem e sem sinais de utilização.</li>
        <li>Vir com a etiqueta original ainda presa à peça.</li>
        <li>Estar na embalagem original, sempre que possível.</li>
      </ul>
      <p>
        Para iniciar uma troca ou devolução, acesse{" "}
        <strong>Minha Conta &gt; Pedidos</strong>, selecione o pedido desejado e siga as instruções.
        Após a aprovação, você recebe um código de postagem gratuito para envio.
      </p>
      <p>
        Reembolsos são processados em até 7 dias úteis após o recebimento e conferência do produto
        devolvido, na mesma forma de pagamento utilizada na compra.
      </p>
    </ContentPage>
  );
}
