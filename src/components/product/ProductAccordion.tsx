"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import ShippingCalculator from "@/components/product/ShippingCalculator";

const EXCHANGE_TEXT =
  "Você tem até 30 dias corridos após o recebimento para solicitar troca ou devolução, sem custo adicional. O produto deve estar sem uso, com etiquetas e embalagem originais. Inicie a solicitação em Minha Conta > Pedidos.";

export default function ProductAccordion({
  description,
  composition,
  care,
  price,
}: {
  description: string;
  composition: string;
  care: string;
  price: number;
}) {
  return (
    <Accordion.Root type="multiple" defaultValue={["descricao"]} className="border-t border-black/10">
      <Item value="descricao" title="Descrição">
        <p className="text-sm text-black/70 leading-relaxed">{description}</p>
      </Item>
      <Item value="composicao" title="Composição e cuidados">
        <p className="text-sm text-black/70 leading-relaxed">
          <strong className="text-black">Composição:</strong> {composition}
        </p>
        <p className="text-sm text-black/70 leading-relaxed mt-2">
          <strong className="text-black">Cuidados:</strong> {care}
        </p>
      </Item>
      <Item value="frete" title="Calcular frete">
        <ShippingCalculator subtotal={price} />
      </Item>
      <Item value="trocas" title="Trocas e devoluções">
        <p className="text-sm text-black/70 leading-relaxed">{EXCHANGE_TEXT}</p>
      </Item>
    </Accordion.Root>
  );
}

function Item({ value, title, children }: { value: string; title: string; children: React.ReactNode }) {
  return (
    <Accordion.Item value={value} className="border-b border-black/10">
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-sm font-medium">
          {title}
          <ChevronDown size={16} strokeWidth={1.5} className="transition-transform group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="pb-5 overflow-hidden data-[state=open]:animate-slide-up">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
}
