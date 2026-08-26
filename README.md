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
npm run supabase:check # verifica schema, bucket e políticas de RLS
npm run video        # transcodifica o filme da marca (requer ffmpeg no PATH)
npm run fonts        # rebaixa as fontes do Google para public/fonts
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
4. Confira tudo com `npm run supabase:check` — ele verifica, usando só a chave
   pública, se a tabela e o bucket existem e se a RLS realmente barra escrita
   anônima.

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

**Para onde vai a solicitação**, em ordem de precedência:

1. **`VITE_CONTACT_ENDPOINT`**, se definida em `.env.local` — `POST` com
   `{ name, email, whatsapp, projectType, message }`. Use para mandar direto a
   um CRM ou automação.
2. **Supabase** (padrão) — grava na tabela `leads` e aparece em `/admin` →
   **Solicitações**.
3. **`mailto:`** — último recurso, só quando não há banco configurado.

> A tela de sucesso **só aparece quando a gravação confirma**. Antes disso o
> formulário abria um `mailto:` e declarava "Solicitação registrada" logo em
> seguida — mas `mailto:` não confirma nada: no celular frequentemente não abre
> app nenhum, e mesmo abrindo a pessoa ainda precisa apertar "enviar". Leads
> eram perdidos sem deixar rastro.

Um honeypot (`company`) descarta envios automatizados antes da requisição.

**Privacidade:** a política de RLS permite que qualquer visitante *escreva* um
lead (é ele quem preenche o formulário) mas **nenhuma política de SELECT existe
para anônimos** — os contatos não podem ser lidos de volta pela chave pública.
Só administradores leem.

## Meta Pixel (Facebook/Instagram Ads)

**Configuração:**

1. No Gerenciador de Eventos (business.facebook.com/events_manager2), pegue o
   ID do pixel — um número com ~16 dígitos.
2. Adicione em `.env.local`:
   ```bash
   VITE_META_PIXEL_ID=1234567890123456
   ```
3. `npm run build` (ou redeploy). **Sem esta variável, nada é carregado** —
   nenhum script, nenhuma requisição ao Facebook.

**Eventos que o site envia sozinho**, sem precisar tocar em cada botão:

| Evento | Quando dispara | Onde no código |
|---|---|---|
| `PageView` | Toda visita | automático |
| `Lead` | Formulário de contato enviado com sucesso | `useContactForm.ts` |
| `ViewContent` | Visitante abre um projeto do portfólio | `PortfolioSection.vue` |
| `Contact` | Clique em qualquer link do WhatsApp | automático (delegação de evento) |
| `AssistiuFilme` *(custom)* | Clique em play no filme da marca | `ShowreelSection.vue` |

No Gerenciador de Eventos, `AssistiuFilme` aparece em "Eventos personalizados"
— para usá-lo em públicos ou otimização de campanha, crie um evento
personalizado apontando para ele.

**Correspondência avançada:** ao enviar o `Lead`, o e-mail e o WhatsApp que a
pessoa acabou de digitar são normalizados e reenviados (`identify()` em
`metaPixel.ts`) — é o que mais pesa na nota de "qualidade da correspondência"
do Meta. O hash desses dados é feito pelo próprio script do Facebook, nunca
pelo nosso código.

**Deduplicação:** todo evento leva um `eventID` próprio (`crypto.randomUUID`).
Se no futuro a API de Conversões (server-side) for adicionada, é esse ID que
evita contar o mesmo Lead duas vezes — uma vinda do navegador, outra do
servidor.

**Performance:** o script do Meta (~70 kB) só é buscado depois que a página
termina de carregar (`requestIdleCallback`, com um limite de 1,5 s de
segurança) — nunca disputa banda com o LCP. Verificado: a requisição sai
centenas de ms depois do evento `load`.

**Teste:** instale a extensão [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
e abra o site — ela mostra os eventos capturados e sinaliza a nota de qualidade
de cada um.

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
