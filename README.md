# Elite Web Designer

Site institucional da agência — Vue 3 + TypeScript + Vite + Tailwind CSS v4.
Página única com navegação por âncoras, construída sobre a direção visual
preto-e-dourado de `opcao_L_luxo_dourado.png`.

## Comandos

```bash
npm install
npm run dev          # servidor de desenvolvimento
npm run build        # type-check (vue-tsc) + build de produção
npm run preview      # serve o build
npm run type-check   # apenas o type-check
npm run assets       # regenera src/assets/** e public/** a partir da arte original
```

## Onde mexer

| Preciso mudar…                    | Arquivo                       |
| --------------------------------- | ----------------------------- |
| Telefone, e-mail, WhatsApp, redes | `src/data/site.ts`            |
| Itens do menu                     | `src/data/navigation.ts`      |
| Os três pilares de serviço        | `src/data/services.ts`        |
| Projetos do portfólio             | `src/data/portfolio.ts`       |
| Métricas                          | `src/data/stats.ts`           |
| Colunas do rodapé                 | `src/data/footer.ts`          |
| Opções do campo "Tipo de projeto" | `src/data/projectTypes.ts`    |
| Cores, tipografia, espaçamentos   | `src/styles/main.css`         |

### Pendências de conteúdo

`src/data/site.ts` tem dois `TODO`:

- `WHATSAPP_E164` e `phoneDisplay` estão com número de exemplo.
- `socialLinks` de Instagram e LinkedIn estão com `href: ''`. Enquanto vazios,
  o ícone não é renderizado — assim o rodapé nunca publica um link quebrado.

## Supabase

O portfólio pode ser gerenciado pelo painel em `/admin`, com os dados no Supabase.

**Configuração (uma vez):**

1. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_PUBLISHABLE_KEY` (Settings → Data API).
2. Rode [`supabase/schema.sql`](supabase/schema.sql) no SQL Editor. Ele cria a
   tabela `projects`, o bucket `portfolio` e as políticas de RLS.
3. Crie o usuário administrador em Authentication → Users → Add user.

> **A secret key (`sb_secret_…`) nunca entra neste projeto.** Ela ignora as
> políticas de RLS, e qualquer variável `VITE_*` é compilada dentro do bundle
> público. Só a publishable key é usada aqui.

**Como o acesso funciona:** a RLS decide tudo. Visitante anônimo lê apenas
projetos com `active = true`; criar, editar e apagar exige sessão autenticada.
A publishable key sozinha não escreve nada.

**Divisão de bundle:** a home lê os projetos com um `fetch` simples na API REST
(~0 kB extra). O SDK do Supabase e o painel inteiro ficam num chunk separado,
baixado só quem abre `/admin`.

**Sem Supabase configurado** o site funciona normalmente com o portfólio
estático de `src/data/portfolio.ts` — o mesmo vale se a API estiver fora do ar.

## Formulário de contato

Sem configuração, o envio abre o cliente de e-mail do visitante com a
solicitação já formatada. Para enviar via API, defina o endpoint:

```bash
# .env.local
VITE_CONTACT_ENDPOINT=https://api.exemplo.com/contato
```

O endpoint recebe `POST` com `{ name, email, whatsapp, projectType, message }`.
Um honeypot (`company`) descarta envios automatizados antes da requisição.

## Assets

As imagens de produção são derivadas da arte original por `npm run assets`
(`scripts/prepare-assets.mjs`, usando `sharp`):

- `src/assets/portfolio/` — recorte acima do título gravado nas composições de
  `/images`, exportado em 600/900/1400 px para `srcset`.
- `src/assets/hero/` — notebook do Projeto MRV (elemento LCP, sem lazy-load).
- `src/assets/decorative/` — mármore preto com veios dourados, recortado de uma
  área limpa da arte; serve de fundo do hero e da frase de marca.
- `src/assets/brand/` — monograma WD.
- `public/` — favicons, `og-image.jpg`, `robots.txt`, `sitemap.xml`.

Nada em `EliteWebDesigner_AssetPack/`, `images/` ou o PNG de referência foi
modificado — são as fontes de origem.

Antes de publicar, troque o domínio `elitewebdesigner.com.br` em `index.html`
(canonical, Open Graph, JSON-LD) e em `public/sitemap.xml` / `public/robots.txt`.
