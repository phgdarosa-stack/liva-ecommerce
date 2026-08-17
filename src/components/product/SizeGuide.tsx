"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const CLOTHING_TABLE = [
  { size: "PP", bust: "78-82", waist: "60-64", hip: "86-90" },
  { size: "P", bust: "83-87", waist: "65-69", hip: "91-95" },
  { size: "M", bust: "88-93", waist: "70-75", hip: "96-101" },
  { size: "G", bust: "94-99", waist: "76-81", hip: "102-107" },
  { size: "GG", bust: "100-106", waist: "82-88", hip: "108-114" },
];

const NUMERIC_TABLE = [
  { size: "34", waist: "62-65", hip: "88-91" },
  { size: "36", waist: "66-69", hip: "92-95" },
  { size: "38", waist: "70-73", hip: "96-99" },
  { size: "40", waist: "74-78", hip: "100-104" },
  { size: "42", waist: "79-83", hip: "105-109" },
];

export default function SizeGuide() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="text-xs underline underline-offset-4 hover:text-olive">
          Guia de medidas
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[92vw] max-w-lg max-h-[85vh] overflow-y-auto p-6 md:p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="font-serif-editorial text-2xl">Guia de medidas</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Fechar" className="p-1">
                <X size={20} strokeWidth={1.5} />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-xs text-black/60 mb-2">Medidas em centímetros (corpo).</p>
          <h3 className="text-sm font-medium mt-4 mb-2">Tops, blusas, vestidos e conjuntos</h3>
          <table className="w-full text-sm border-collapse mb-6">
            <thead>
              <tr className="border-b border-black/15 text-left text-xs uppercase tracking-wider text-black/50">
                <th className="py-2">Tam.</th>
                <th className="py-2">Busto</th>
                <th className="py-2">Cintura</th>
                <th className="py-2">Quadril</th>
              </tr>
            </thead>
            <tbody>
              {CLOTHING_TABLE.map((row) => (
                <tr key={row.size} className="border-b border-black/5">
                  <td className="py-2 font-medium">{row.size}</td>
                  <td className="py-2">{row.bust}</td>
                  <td className="py-2">{row.waist}</td>
                  <td className="py-2">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-sm font-medium mb-2">Calças e shorts</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/15 text-left text-xs uppercase tracking-wider text-black/50">
                <th className="py-2">Tam.</th>
                <th className="py-2">Cintura</th>
                <th className="py-2">Quadril</th>
              </tr>
            </thead>
            <tbody>
              {NUMERIC_TABLE.map((row) => (
                <tr key={row.size} className="border-b border-black/5">
                  <td className="py-2 font-medium">{row.size}</td>
                  <td className="py-2">{row.waist}</td>
                  <td className="py-2">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
