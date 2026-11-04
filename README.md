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

## Deploy

O site é hospedado no **Cloudflare Pages**, projeto `elite-web-designer`, nos
domínios `elitewebdesignn.com` e `www.elitewebdesignn.com`.

O deploy é por envio direto do build — não há integração com repositório Git,
então publicar é sempre um ato explícito:

```bash
npm run build
npx wrangler pages deploy dist --project-name elite-web-designer --branch main
```

Três coisas que o Cloudflare espera e que vivem no repositório:

| Arquivo | Para quê |
|---|---|
| [`functions/api/notify-lead.ts`](functions/api/notify-lead.ts) | Pages Function; vira o endpoint `/api/notify-lead` |
| [`public/_redirects`](public/_redirects) | entrega `index.html` com status 200 em rotas desconhecidas |
| [`public/_headers`](public/_headers) | cache dos assets e cabeçalhos de segurança |

As variáveis de servidor são **secrets do projeto**, não arquivos. E têm uma
armadilha que custa tempo: **um secret alterado só vale a partir do deploy
seguinte** — mudar o valor no painel não afeta o que já está publicado.

```bash
npx wrangler pages secret list --project-name elite-web-designer
npx wrangler pages secret put RESEND_API_KEY --project-name elite-web-designer
```

O prompt do `wrangler` não ecoa o que é digitado; se receber Enter vazio, ele
grava uma string vazia sem reclamar, e o secret passa a existir com valor em
branco. Para conferir sem expor nada, mande ao endpoint um corpo incompleto:
`400` significa que a chave chegou, `204` que ela está vazia ou ausente.

```bash
curl -s -o /dev/null -w "%{http_code}
" -X POST   -H "Content-Type: application/json" -d '{"name":"x"}'   https://elitewebdesignn.com/api/notify-lead
```

## Onde mexer

| Preciso mudar…                    | Arquivo                       |
| --------------------------------- | ----------------------------- |
| Telefone, e-mail, WhatsApp, redes | `src/data/site.ts`            |
| Itens do menu                     | `src/data/navigation.ts`      |
| Os três pilares de serviço        | `src/data/services.ts`        |
| Planos e preços                   | `src/data/plans.ts`           |
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
   `{ name, whatsapp, projectType, company, message, plan }`. `company` é
   opcional e `message` é um resumo gerado pelo site. Use para mandar direto a
   um CRM ou automação.
2. **Supabase** (padrão) — grava na tabela `leads` e aparece em `/admin` →
   **Solicitações**.
3. **`mailto:`** — último recurso, só quando não há banco configurado.

> A tela de sucesso **só aparece quando a gravação confirma**. Antes disso o
> formulário abria um `mailto:` e declarava "Solicitação registrada" logo em
> seguida — mas `mailto:` não confirma nada: no celular frequentemente não abre
> app nenhum, e mesmo abrindo a pessoa ainda precisa apertar "enviar". Leads
> eram perdidos sem deixar rastro.

Um honeypot (`website`) descarta envios automatizados antes da requisição.

**Vindo da seção de planos:** "Pedir orçamento" leva ao formulário compacto
já com o tipo de projeto selecionado. O plano escolhido segue no resumo interno
do lead, sem exigir que a pessoa escreva uma mensagem.

Cada plano tem também um **"Falar no WhatsApp"** como ação principal, que
abre a conversa com a mesma mensagem já escrita. É a via para quem não quer
preencher formulário: a conversa chega iniciada pelo cliente, com o plano
dentro, e não depende de API, número dedicado nem aprovação de modelo pela
Meta. O lead, nesse caminho, não passa pelo banco — existe só no WhatsApp.

**Privacidade:** a política de RLS permite que qualquer visitante *escreva* um
lead (é ele quem preenche o formulário) mas **nenhuma política de SELECT existe
para anônimos** — os contatos não podem ser lidos de volta pela chave pública.
Só administradores leem.

### Aviso por e-mail

Além de gravar no banco, o site pode avisar por e-mail a cada nova solicitação.
Isso roda numa função de servidor
([`functions/api/notify-lead.ts`](functions/api/notify-lead.ts))
porque a chave da API de e-mail **não pode ficar no frontend** — qualquer
variável `VITE_*` é compilada dentro do bundle público.

1. Crie uma conta gratuita em [resend.com](https://resend.com) (3.000 e-mails/mês).
2. Gere uma API key.
3. Cadastre como secrets do projeto no Cloudflare — **sem prefixo `VITE_`**,
   senão vazam para o navegador (veja [Deploy](#deploy)):

   | Nome | Valor |
   |---|---|
   | `RESEND_API_KEY` | `re_...` |
   | `LEAD_NOTIFY_TO` | o e-mail que recebe os avisos |
   | `LEAD_NOTIFY_FROM` | opcional; veja a limitação abaixo |

4. Publique de novo — sem um deploy novo, o secret não chega à função.

`elitewebdesignn.com` já está verificado no Resend (região `sa-east-1`, São
Paulo), e `LEAD_NOTIFY_FROM` aponta para `contato@elitewebdesignn.com`. Os
registros DKIM e SPF que sustentam isso vivem no DNS do domínio, no Cloudflare —
`resend._domainkey` (TXT), `send` (MX e TXT) e `rsend` (CNAME, **DNS only**).
Apagar qualquer um deles derruba a entrega sem aviso.

> **Limitação do plano gratuito:** *sem* um domínio verificado, o Resend só envia
> a partir de `onboarding@resend.dev` e **só para o e-mail dono da conta** — foi
> assim antes da verificação, e é o que acontece se o DNS for desfeito.

**O aviso é best-effort:** o lead é gravado no Supabase primeiro. Se o e-mail
falhar, o formulário **não** acusa erro — o cliente já cumpriu a parte dele, e
fazê-lo reenviar duplicaria o lead por um problema que não é dele. A solicitação
continua visível em `/admin`.

Sem `RESEND_API_KEY` configurada, a função responde 204 e nada acontece — o
site funciona igual, só sem aviso.

## Microsoft Clarity

O ID do projeto (`yngnnfl2fm`, em **Settings → Setup** no painel do Clarity)
já vem como padrão em `vite.config.ts`, então o código de gravação de sessões é
inserido no `<head>` de todo build sem configuração extra. Para usar outro
projeto, defina `VITE_CLARITY_PROJECT_ID`; para desligar num ambiente, defina a
variável vazia (`VITE_CLARITY_PROJECT_ID=`). A rota `/admin` nunca é gravada.

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

**Correspondência avançada:** ao enviar o `Lead`, o WhatsApp que a pessoa
acabou de digitar é normalizado e reenviado (`identify()` em
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
