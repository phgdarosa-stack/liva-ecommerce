import { Truck, ShieldCheck, RefreshCcw, Headset } from "lucide-react";

const BENEFITS = [
  { icon: Truck, label: "Frete grátis acima de R$299" },
  { icon: ShieldCheck, label: "Pagamento seguro" },
  { icon: RefreshCcw, label: "Troca fácil" },
  { icon: Headset, label: "Atendimento rápido" },
];

export default function BrandBenefits() {
  return (
    <section className="border-y border-black/10 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 text-center md:text-left">
              <Icon size={22} strokeWidth={1.25} className="text-olive shrink-0" />
              <span className="text-xs md:text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
