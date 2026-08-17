# LIVA — New Season 01

E-commerce completo para a LIVA, marca brasileira de moda feminina contemporânea. Loja com
catálogo, carrinho, checkout, contas de cliente e um painel administrativo protegido, construída
como projeto de portfólio full-stack.

**Vista o seu agora.**

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** — tema da marca definido em `src/app/globals.css`
- **Prisma + SQLite** — banco de dados local (`prisma/schema.prisma`)
- **NextAuth v5 (Credentials)** — autenticação por e-mail/senha com papéis `CUSTOMER` / `ADMIN`
- **Zustand** — carrinho e favoritos (persistidos no `localStorage` para visitantes)
- **Radix UI** — dialogs, accordion, tabs (acessíveis por padrão)

## Como rodar localmente

```bash
npm install
cp .env.example .env      # ajuste AUTH_SECRET se preferir
npm run db:push           # cria o banco SQLite a partir do schema
npm run db:seed           # popular com os 20 produtos, cupons e usuários demo
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Contas de demonstração

| Papel     | E-mail               | Senha             |
| --------- | --------------------- | ----------------- |
| Cliente   | cliente@liva.com.br   | Liva@Cliente123    |
| Admin     | admin@liva.com.br     | Liva@Admin123       |

O painel administrativo fica em `/admin` e é protegido em nível de servidor (middleware +
verificação de papel em cada rota de API) — não depende de esconder links no frontend.

### Cupons ativos

`BEMVINDALIVA` (15% na primeira compra) · `LIVA10` (10%) · `PRIMEIRACOMPRA` (10% na primeira
compra) · `FRETEGRATIS` (frete grátis)

## Scripts

| Comando               | Descrição                                            |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento                           |
| `npm run build`         | Build de produção                                     |
| `npm run db:push`       | Sincroniza o schema Prisma com o banco SQLite          |
| `npm run db:seed`       | Popula o banco com produtos, cupons e usuários demo   |
| `npm run db:reset`      | Reseta o banco do zero e roda o seed novamente         |
| `npm run lint`          | ESLint                                                 |

## Estrutura do projeto

```
prisma/                  schema.prisma + seed.ts
src/
  app/                    rotas (App Router) — loja, conta, checkout, admin, APIs
  components/
    layout/               header, footer, promo strip, busca, chrome condicional (loja x admin)
    home/                 seções da home
    product/              card, galeria, seletor de variação, avaliações
    cart/                 drawer, item, cupom, barra de frete grátis
    catalog/              filtros, ordenação, bottom sheet mobile
    checkout/              stepper e as 3 etapas (entrega, pagamento, revisão)
    account/               sidebar, endereços, pedidos, rastreio
    admin/                 sidebar, formulário de produto, gestão de pedidos/cupons/estoque
    ui/                    primitivos (Button, Badge, Price, Rating, EmptyState...)
  lib/                    Prisma client, auth (NextAuth), regras de negócio (frete, cupons,
                          cálculo de carrinho), validação (zod)
  store/                  Zustand — carrinho e favoritos
  data/                   dados brutos dos 20 produtos (usados no seed)
  types/                  tipos compartilhados
public/images/campaign/  fotografia de campanha gerada para a coleção NEW SEASON 01
```

## Decisões de escopo (projeto de demonstração)

- **Pagamento**: simulado. Nenhum dado de cartão é processado ou armazenado; nenhum gateway real é
  chamado.
- **Frete**: calculado com uma fórmula determinística baseada no CEP (sem integração com Correios).
- **Imagens de produto**: reaproveitam a fotografia de campanha por categoria (gerada por IA) —
  cada produto tem uma foto de modelo e uma foto de detalhe/still life, mantendo a identidade
  visual da marca consistente.
- **Preços e estoque no checkout** são sempre recalculados a partir do banco de dados no servidor,
  nunca confiando no valor enviado pelo cliente.
