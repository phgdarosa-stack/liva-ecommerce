"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import CatalogFilters, { type FilterValues } from "@/components/catalog/CatalogFilters";
import Button from "@/components/ui/Button";

export default function FilterBottomSheet({
  open,
  onClose,
  values,
  onChange,
  onClear,
  resultCount,
  showCategory,
}: {
  open: boolean;
  onClose: () => void;
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
  resultCount: number;
  showCategory: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-fade-in md:hidden" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 top-16 bg-ivory z-50 flex flex-col md:hidden animate-slide-up">
          <div className="flex items-center justify-between px-5 h-14 border-b border-black/10 shrink-0">
            <Dialog.Title className="text-sm font-medium uppercase tracking-wider">Filtros</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Fechar filtros" className="p-2 -mr-2">
                <X size={20} strokeWidth={1.5} />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <CatalogFilters values={values} onChange={onChange} showCategory={showCategory} />
          </div>
          <div className="shrink-0 border-t border-black/10 px-5 py-4 flex gap-3">
            <Button variant="outline" onClick={onClear} className="flex-1">
              Limpar
            </Button>
            <Button onClick={onClose} className="flex-1">
              Ver {resultCount} {resultCount === 1 ? "produto" : "produtos"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
