import ProductForm from "@/components/admin/ProductForm";

export default function NovoProdutoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Novo produto</h1>
      <ProductForm
        initial={{
          name: "",
          sku: "",
          category: "tops",
          description: "",
          composition: "",
          care: "",
          price: 0,
          promoPrice: null,
          featured: false,
          bestseller: false,
          newArrival: false,
          variants: [{ color: "Preto", colorHex: "#111111", size: "M", stock: 10 }],
          images: [{ url: "/images/campaign/tops-model.jpg", type: "front" }],
        }}
      />
    </div>
  );
}
