import type { Metadata } from "next";
import ContentPage from "@/components/ui/ContentPage";

export const metadata: Metadata = { title: "Privacidade — LIVA" };

export default function PrivacidadePage() {
  return (
    <ContentPage title="Política de privacidade">
      <p>
        Este documento explica, de forma simples, como a LIVA trata os dados pessoais coletados
        durante a navegação e a compra no nosso site, em conformidade com a Lei Geral de Proteção
        de Dados (LGPD).
      </p>
      <h2 className="text-black font-medium text-base pt-2">Quais dados coletamos</h2>
      <p>
        Nome, e-mail, telefone, CPF e endereço, informados no momento do cadastro ou checkout, além
        de dados de navegação (páginas visitadas, produtos favoritados e itens no carrinho) usados
        para melhorar sua experiência de compra.
      </p>
      <h2 className="text-black font-medium text-base pt-2">Como usamos seus dados</h2>
      <p>
        Utilizamos essas informações exclusivamente para processar pedidos, calcular frete, emitir
        nota fiscal, comunicar o status da sua compra e, caso você autorize, enviar novidades por
        e-mail.
      </p>
      <h2 className="text-black font-medium text-base pt-2">Seus direitos</h2>
      <p>
        Você pode solicitar a qualquer momento a atualização, exportação ou exclusão dos seus dados
        pessoais entrando em contato pelo nosso canal de atendimento.
      </p>
    </ContentPage>
  );
}
