import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import ContentPage from "@/components/ui/ContentPage";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "WhatsApp — LIVA" };

export default function WhatsappPage() {
  return (
    <ContentPage title="Fale pelo WhatsApp">
      <p>
        Prefere resolver tudo por mensagem? Nosso time responde pelo WhatsApp de segunda a sexta,
        das 9h às 18h.
      </p>
      <div className="not-prose pt-4">
        <Button
          href="https://wa.me/5511400012340"
          className="inline-flex items-center gap-2"
        >
          <MessageCircle size={16} strokeWidth={1.5} />
          Conversar no WhatsApp
        </Button>
      </div>
    </ContentPage>
  );
}
