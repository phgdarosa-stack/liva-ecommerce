import type { Metadata } from "next";
import ContentPage from "@/components/ui/ContentPage";

export const metadata: Metadata = { title: "Termos de uso — LIVA" };

export default function TermosPage() {
  return (
    <ContentPage title="Termos de uso">
      <p>
        Ao navegar e comprar no site da LIVA, você concorda com os termos descritos a seguir. Leia
        com atenção antes de finalizar seu pedido.
      </p>
      <h2 className="text-black font-medium text-base pt-2">Cadastro e conta</h2>
      <p>
        Para finalizar uma compra, é necessário criar uma conta com dados verdadeiros e atualizados.
        Você é responsável por manter a confidencialidade da sua senha.
      </p>
      <h2 className="text-black font-medium text-base pt-2">Preços e disponibilidade</h2>
      <p>
        Preços, estoque e condições de promoções podem ser alterados sem aviso prévio. O valor
        cobrado será sempre o exibido no momento da finalização da compra.
      </p>
      <h2 className="text-black font-medium text-base pt-2">Pagamento e entrega</h2>
      <p>
        Pedidos são processados após a confirmação do pagamento. Prazos de entrega são estimativas e
        podem variar conforme a região de destino.
      </p>
    </ContentPage>
  );
}
