import type { Metadata } from "next";
import ContentPage from "@/components/ui/ContentPage";

export const metadata: Metadata = { title: "Sobre a LIVA" };

export default function SobrePage() {
  return (
    <ContentPage title="Sobre a LIVA">
      <p>
        LIVA nasceu para vestir mulheres que não têm tempo a perder com roupa que não funciona no
        corre do dia a dia. Somos uma marca brasileira de moda contemporânea, feita para quem
        transita entre o trabalho, os compromissos e a vida social sem precisar trocar de roupa —
        ou de personalidade — no meio do caminho.
      </p>
      <p>
        A <strong>NEW SEASON 01</strong> é a nossa primeira coleção grande: peças essenciais com um
        toque fashion-forward, pensadas em tecidos confortáveis e cores que combinam entre si. Nada
        de peça que só serve para uma ocasião — aqui, tudo se mistura.
      </p>
      <p>
        Trabalhamos com produção nacional, fornecedores de confiança e um time pequeno e dedicado
        que revisa cada detalhe antes de qualquer peça chegar até você.
      </p>
    </ContentPage>
  );
}
