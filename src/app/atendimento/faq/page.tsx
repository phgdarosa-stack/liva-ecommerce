import type { Metadata } from "next";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = { title: "Perguntas frequentes — LIVA" };

const FAQ = [
  {
    q: "Qual o prazo de entrega?",
    a: "O prazo varia conforme o CEP de destino, entre 3 e 12 dias úteis. Você pode simular o prazo exato na página do produto ou no carrinho, informando seu CEP.",
  },
  {
    q: "Como funciona o frete grátis?",
    a: "Pedidos acima de R$299 têm frete grátis automaticamente. Abaixo desse valor, o frete é calculado com base no seu CEP.",
  },
  {
    q: "Posso trocar o tamanho depois de comprar?",
    a: "Sim. Você tem até 30 dias corridos após o recebimento para solicitar troca, direto em Minha Conta > Pedidos.",
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Pix (aprovação imediata), cartão de crédito (em até 3x sem juros) e boleto bancário (aprovação em até 2 dias úteis).",
  },
  {
    q: "Preciso criar uma conta para comprar?",
    a: "Você pode navegar, buscar e adicionar produtos ao carrinho sem login. A conta é solicitada apenas na etapa final do checkout.",
  },
  {
    q: "Como uso um cupom de desconto?",
    a: "Insira o código no campo de cupom, disponível no carrinho e no checkout. O desconto é aplicado automaticamente ao total do pedido.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
      <h1 className="font-serif-editorial text-3xl md:text-4xl mb-8">Perguntas frequentes</h1>
      <Accordion.Root type="multiple" className="border-t border-black/10">
        {FAQ.map((item) => (
          <Accordion.Item key={item.q} value={item.q} className="border-b border-black/10">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-sm font-medium text-left">
                {item.q}
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  className="shrink-0 ml-4 transition-transform group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pb-5 text-sm text-black/65 leading-relaxed">
              {item.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
