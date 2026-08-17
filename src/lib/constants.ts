export const BRAND = {
  name: "LIVA",
  collection: "NEW SEASON 01",
  slogan: "Vista o seu agora.",
  headline: "New season. New you.",
  supporting: "Peças para acompanhar o seu agora.",
} as const;

export const FREE_SHIPPING_THRESHOLD = 299;

export type CategorySlug =
  | "tops"
  | "blusas"
  | "calcas"
  | "shorts"
  | "vestidos"
  | "conjuntos";

export const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: "tops", label: "Tops" },
  { slug: "blusas", label: "Blusas" },
  { slug: "calcas", label: "Calças" },
  { slug: "shorts", label: "Shorts" },
  { slug: "vestidos", label: "Vestidos" },
  { slug: "conjuntos", label: "Conjuntos" },
];

export const NAV_LINKS = [
  { label: "Novidades", href: "/novidades" },
  {
    label: "Roupas",
    href: "/roupas",
    children: CATEGORIES.map((c) => ({ label: c.label, href: `/roupas/${c.slug}` })),
  },
  { label: "Promoções", href: "/promocoes" },
];

export const CLOTHING_SIZES = ["PP", "P", "M", "G", "GG"] as const;
export const NUMERIC_SIZES = ["34", "36", "38", "40", "42"] as const;

export const COUPONS = {
  BEMVINDALIVA: { type: "percent", value: 15, firstPurchaseOnly: true },
  LIVA10: { type: "percent", value: 10, firstPurchaseOnly: false },
  PRIMEIRACOMPRA: { type: "percent", value: 10, firstPurchaseOnly: true },
  FRETEGRATIS: { type: "shipping", value: 100, firstPurchaseOnly: false },
} as const;

export const FULFILLMENT_STEPS = [
  { key: "pedido_realizado", label: "Pedido realizado" },
  { key: "pagamento_aprovado", label: "Pagamento aprovado" },
  { key: "preparando", label: "Preparando pedido" },
  { key: "enviado", label: "Pedido enviado" },
  { key: "transito", label: "Em trânsito" },
  { key: "entregue", label: "Entregue" },
] as const;

export const FOOTER_LINKS = {
  atendimento: [
    { label: "Fale conosco", href: "/atendimento/fale-conosco" },
    { label: "WhatsApp", href: "/atendimento/whatsapp" },
    { label: "FAQ", href: "/atendimento/faq" },
  ],
  comprar: [
    { label: "Novidades", href: "/novidades" },
    { label: "Categorias", href: "/roupas" },
    { label: "Promoções", href: "/promocoes" },
  ],
  institucional: [
    { label: "Sobre a LIVA", href: "/institucional/sobre" },
    { label: "Trocas e devoluções", href: "/institucional/trocas-e-devolucoes" },
    { label: "Privacidade", href: "/institucional/privacidade" },
    { label: "Termos", href: "/institucional/termos" },
  ],
};
