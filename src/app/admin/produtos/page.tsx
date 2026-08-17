import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { order: "asc" }, take: 1 }, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Produtos</h1>
          <p className="text-sm text-gray-500">{products.length} produtos cadastrados</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <Plus size={15} /> Novo produto
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 font-normal">Produto</th>
              <th className="px-5 py-3 font-normal">SKU</th>
              <th className="px-5 py-3 font-normal">Categoria</th>
              <th className="px-5 py-3 font-normal">Preço</th>
              <th className="px-5 py-3 font-normal">Estoque</th>
              <th className="px-5 py-3 font-normal">Destaques</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/produtos/${p.id}`} className="flex items-center gap-3">
                      {p.images[0] && (
                        <div className="relative w-9 h-11 shrink-0 bg-gray-100 rounded overflow-hidden">
                          <Image src={p.images[0].url} alt="" fill sizes="40px" className="object-cover" />
                        </div>
                      )}
                      <span className="hover:underline">{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.sku}</td>
                  <td className="px-5 py-3 text-gray-500 capitalize">{p.category}</td>
                  <td className="px-5 py-3">
                    {formatPrice(p.promoPrice ?? p.price)}
                    {p.promoPrice && (
                      <span className="text-gray-400 line-through ml-1.5 text-xs">
                        {formatPrice(p.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={stock === 0 ? "text-red-600" : stock <= 10 ? "text-amber-600" : "text-gray-600"}>
                      {stock} un.
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {[p.featured && "Destaque", p.bestseller && "Mais vendido", p.newArrival && "Novidade"]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
