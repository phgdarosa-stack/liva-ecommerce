import type { CategorySlug } from "@/lib/constants";

export interface RawVariant {
  color: string;
  sizes: { size: string; stock: number }[];
}

export interface RawProduct {
  slug: string;
  sku: string;
  name: string;
  category: CategorySlug;
  price: number;
  promoPrice?: number;
  description: string;
  composition: string;
  care: string;
  colors: string[];
  sizes: readonly string[];
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  bundleGroup?: string;
}

const TOPS_IMG = { front: "/images/campaign/tops-model.jpg", detail: "/images/campaign/tops-detail.jpg" };
const BLUSAS_IMG = { front: "/images/campaign/blusas-model.jpg", detail: "/images/campaign/blusas-detail.jpg" };
const CALCAS_IMG = { front: "/images/campaign/calcas-model.jpg", detail: "/images/campaign/calcas-detail.jpg" };
const SHORTS_IMG = { front: "/images/campaign/shorts-model.jpg", detail: "/images/campaign/shorts-detail.jpg" };
const VESTIDOS_IMG = { front: "/images/campaign/vestidos-model.jpg", detail: "/images/campaign/vestidos-detail.jpg" };
const CONJUNTOS_IMG = { front: "/images/campaign/conjuntos-model.jpg", detail: "/images/campaign/conjuntos-detail.jpg" };

export const CATEGORY_IMAGES: Record<CategorySlug, { front: string; detail: string }> = {
  tops: TOPS_IMG,
  blusas: BLUSAS_IMG,
  calcas: CALCAS_IMG,
  shorts: SHORTS_IMG,
  vestidos: VESTIDOS_IMG,
  conjuntos: CONJUNTOS_IMG,
};

const CLOTHING_SIZES = ["PP", "P", "M", "G", "GG"] as const;
const NUMERIC_SIZES = ["34", "36", "38", "40", "42"] as const;

export const PRODUCTS: RawProduct[] = [
  // ---- TOPS & T-SHIRTS ----
  {
    slug: "essential-tee",
    sku: "LV-TOP-001",
    name: "Essential Tee",
    category: "tops",
    price: 89.9,
    description:
      "A camiseta que resolve o dia a dia sem esforço. Algodão penteado 100%, gramatura média, caimento reto e leve — não marca o corpo e não perde a forma na lavagem. Ideal para usar sozinha ou por baixo de camadas.",
    composition: "100% algodão penteado.",
    care: "Lavar à máquina com água fria, cores semelhantes. Não usar alvejante. Secar à sombra.",
    colors: ["Off White", "Preto", "Cinza"],
    sizes: CLOTHING_SIZES,
    newArrival: true,
    bestseller: true,
    bundleGroup: "camisetas",
  },
  {
    slug: "soft-tee",
    sku: "LV-TOP-002",
    name: "Soft Tee",
    category: "tops",
    price: 79.9,
    promoPrice: 64.9,
    description:
      "Versão mais leve da camiseta clássica LIVA. Malha macia com leve elasticidade, gola canelada e caimento solto — a camiseta que vira base de qualquer produção.",
    composition: "95% algodão, 5% elastano.",
    care: "Lavar à mão ou máquina em ciclo suave, água fria. Não torcer.",
    colors: ["Branco", "Preto", "Verde Oliva"],
    sizes: CLOTHING_SIZES,
    bundleGroup: "camisetas",
  },
  {
    slug: "ribbed-top",
    sku: "LV-TOP-003",
    name: "Ribbed Top",
    category: "tops",
    price: 69.9,
    promoPrice: 59.9,
    description:
      "Top canelado com caimento colado ao corpo, alcinhas ajustáveis e acabamento em ribana. Perfeito para compor looks em camadas ou usar sozinho no calor.",
    composition: "92% poliéster, 8% elastano (ribana).",
    care: "Lavar à mão, não torcer, secar à sombra em superfície plana.",
    colors: ["Preto", "Off White", "Marrom"],
    sizes: ["PP", "P", "M", "G"],
  },
  {
    slug: "one-shoulder-top",
    sku: "LV-TOP-004",
    name: "One Shoulder Top",
    category: "tops",
    price: 99.9,
    description:
      "Top de um ombro só com modelagem assimétrica e tecido com leve brilho. Peça statement para dar contraste a looks minimalistas.",
    composition: "88% poliamida, 12% elastano.",
    care: "Lavar à mão com água fria. Não usar secadora.",
    colors: ["Preto", "Off White"],
    sizes: ["PP", "P", "M", "G"],
    newArrival: true,
  },
  {
    slug: "basic-cropped",
    sku: "LV-TOP-005",
    name: "Basic Cropped",
    category: "tops",
    price: 74.9,
    description:
      "Cropped de algodão com barra reta e caimento levemente solto. Comprimento pensado para combinar com calças de cintura alta sem esforço.",
    composition: "100% algodão.",
    care: "Lavar à máquina, água fria, avesso. Não usar secadora.",
    colors: ["Branco", "Preto", "Cinza"],
    sizes: ["PP", "P", "M", "G"],
  },

  // ---- BLOUSES & SHIRTS ----
  {
    slug: "linen-shirt",
    sku: "LV-BLU-001",
    name: "Linen Shirt",
    category: "blusas",
    price: 169.9,
    description:
      "Camisa de linho puro com caimento solto e mangas longas dobráveis. Tecido respirável, textura natural e aquele amassadinho que já faz parte do visual.",
    composition: "100% linho.",
    care: "Lavar à máquina, ciclo delicado. Passar com o tecido levemente úmido.",
    colors: ["Off White", "Bege", "Verde Oliva"],
    sizes: ["P", "M", "G", "GG"],
    bestseller: true,
  },
  {
    slug: "soft-blouse",
    sku: "LV-BLU-002",
    name: "Soft Blouse",
    category: "blusas",
    price: 129.9,
    description:
      "Blusa fluida em viscose com caimento leve e botões forrados. Discreta o suficiente para o trabalho, bonita o suficiente para sair direto depois.",
    composition: "100% viscose.",
    care: "Lavar à mão, água fria. Secar à sombra, pendurada.",
    colors: ["Off White", "Preto"],
    sizes: CLOTHING_SIZES,
  },
  {
    slug: "essential-shirt",
    sku: "LV-BLU-003",
    name: "Essential Shirt",
    category: "blusas",
    price: 149.9,
    description:
      "Camisa clássica em tricoline de algodão, corte reto e colarinho estruturado. A camisa que nunca sai de moda — de reunião a happy hour.",
    composition: "100% algodão (tricoline).",
    care: "Lavar à máquina, água fria. Passar ainda úmida para facilitar.",
    colors: ["Branco", "Azul Claro"],
    sizes: ["P", "M", "G", "GG"],
  },
  {
    slug: "ribbed-long-sleeve",
    sku: "LV-BLU-004",
    name: "Ribbed Long Sleeve",
    category: "blusas",
    price: 119.9,
    description:
      "Blusa de manga longa em malha canelada, gola careca e caimento justo ao corpo. Base perfeita para as estações mais frias, sozinha ou em camadas.",
    composition: "94% viscose, 6% elastano.",
    care: "Lavar à mão. Não torcer, secar em superfície plana.",
    colors: ["Preto", "Marrom", "Off White"],
    sizes: ["PP", "P", "M", "G"],
  },
  {
    slug: "satin-blouse",
    sku: "LV-BLU-005",
    name: "Satin Blouse",
    category: "blusas",
    price: 159.9,
    description:
      "Blusa em cetim fluido com caimento leve e brilho suave. Direto do dia para a noite sem trocar de roupa.",
    composition: "100% poliéster (cetim).",
    care: "Lavar à mão, água fria. Não torcer. Passar a ferro baixo, pelo avesso.",
    colors: ["Champagne", "Preto", "Vinho"],
    sizes: ["PP", "P", "M", "G"],
    newArrival: true,
  },

  // ---- PANTS ----
  {
    slug: "wide-leg-pants",
    sku: "LV-CAL-001",
    name: "Wide Leg Pants",
    category: "calcas",
    price: 199.9,
    promoPrice: 169.9,
    description:
      "Calça pantalona de alfaiataria com cintura alta e caimento fluido. Alonga a silhueta e combina com tudo, do tênis ao salto.",
    composition: "68% poliéster, 30% viscose, 2% elastano.",
    care: "Lavar à máquina, ciclo delicado, pelo avesso. Passar a ferro morno.",
    colors: ["Preto", "Bege"],
    sizes: NUMERIC_SIZES,
    bestseller: true,
  },
  {
    slug: "straight-jeans",
    sku: "LV-CAL-002",
    name: "Straight Jeans",
    category: "calcas",
    price: 229.9,
    description:
      "Jeans de caimento reto, cintura média e lavagem que não desbota fácil. O básico definitivo do guarda-roupa.",
    composition: "98% algodão, 2% elastano.",
    care: "Lavar à máquina, pelo avesso, água fria. Não usar secadora.",
    colors: ["Azul Claro", "Azul Médio", "Preto"],
    sizes: NUMERIC_SIZES,
    bestseller: true,
  },
  {
    slug: "tailored-pants",
    sku: "LV-CAL-003",
    name: "Tailored Pants",
    category: "calcas",
    price: 219.9,
    description:
      "Calça de alfaiataria com corte reto, vinco frontal e cós alto. Estrutura que não perde a forma o dia inteiro.",
    composition: "72% poliéster, 26% viscose, 2% elastano.",
    care: "Lavagem a seco recomendada, ou máquina em ciclo delicado, pelo avesso.",
    colors: ["Preto", "Cinza", "Bege"],
    sizes: NUMERIC_SIZES,
  },

  // ---- SHORTS ----
  {
    slug: "linen-shorts",
    sku: "LV-SHO-001",
    name: "Linen Shorts",
    category: "shorts",
    price: 119.9,
    description:
      "Short de linho com cintura alta e caimento reto. Leve, fresco e com aquela textura natural que só o linho tem.",
    composition: "100% linho.",
    care: "Lavar à máquina, ciclo delicado. Passar levemente úmido.",
    colors: ["Bege", "Off White", "Preto"],
    sizes: ["34", "36", "38", "40"],
  },
  {
    slug: "denim-shorts",
    sku: "LV-SHO-002",
    name: "Denim Shorts",
    category: "shorts",
    price: 139.9,
    promoPrice: 119.9,
    description:
      "Short jeans de cintura alta com barra desfiada. Clássico de verão que não sai de moda.",
    composition: "99% algodão, 1% elastano.",
    care: "Lavar à máquina, pelo avesso, água fria.",
    colors: ["Azul Claro", "Azul Médio"],
    sizes: ["34", "36", "38", "40"],
    newArrival: true,
  },

  // ---- DRESSES ----
  {
    slug: "essential-dress",
    sku: "LV-VES-001",
    name: "Essential Dress",
    category: "vestidos",
    price: 189.9,
    description:
      "Vestido de caimento reto e comprimento midi, em malha estruturada que não marca o corpo. Um só vestido, mil ocasiões.",
    composition: "95% viscose, 5% elastano.",
    care: "Lavar à mão, água fria. Secar pendurado à sombra.",
    colors: ["Preto", "Off White", "Verde Oliva"],
    sizes: CLOTHING_SIZES,
    bestseller: true,
  },
  {
    slug: "slip-dress",
    sku: "LV-VES-002",
    name: "Slip Dress",
    category: "vestidos",
    price: 219.9,
    description:
      "Vestido slip em cetim fluido com alcinhas finas ajustáveis e caimento na diagonal. Peça statement para os dias em que o look precisa fazer o trabalho todo.",
    composition: "100% poliéster (cetim).",
    care: "Lavar à mão, água fria. Não torcer. Passar a ferro baixo, pelo avesso.",
    colors: ["Preto", "Champagne", "Vinho"],
    sizes: CLOTHING_SIZES,
    featured: true,
  },
  {
    slug: "everyday-dress",
    sku: "LV-VES-003",
    name: "Everyday Dress",
    category: "vestidos",
    price: 159.9,
    promoPrice: 134.9,
    description:
      "Vestido curto de algodão com botões frontais funcionais e cinto para marcar a cintura. Veste em trinta segundos, resolve o look inteiro.",
    composition: "97% algodão, 3% elastano.",
    care: "Lavar à máquina, água fria, pelo avesso.",
    colors: ["Preto", "Bege", "Verde Oliva"],
    sizes: CLOTHING_SIZES,
  },

  // ---- SETS ----
  {
    slug: "linen-set",
    sku: "LV-CON-001",
    name: "Linen Set",
    category: "conjuntos",
    price: 269.9,
    promoPrice: 249.9,
    description:
      "Conjunto de linho com blusa e calça pantalona no mesmo tecido. Use junto para o efeito monocromático ou separe as peças — funcionam dos dois jeitos.",
    composition: "100% linho.",
    care: "Lavar à máquina, ciclo delicado. Passar levemente úmido.",
    colors: ["Off White", "Bege", "Verde Oliva"],
    sizes: ["P", "M", "G"],
    featured: true,
    newArrival: true,
  },
  {
    slug: "tailored-set",
    sku: "LV-CON-002",
    name: "Tailored Set",
    category: "conjuntos",
    price: 399.9,
    description:
      "Conjunto de alfaiataria com blazer estruturado e calça reta a jogo. Para quando o look precisa comunicar antes de você abrir a boca.",
    composition: "70% poliéster, 28% viscose, 2% elastano.",
    care: "Lavagem a seco recomendada, ou máquina delicada, pelo avesso.",
    colors: ["Preto", "Cinza", "Bege"],
    sizes: ["P", "M", "G"],
    bestseller: true,
    featured: true,
  },
];
