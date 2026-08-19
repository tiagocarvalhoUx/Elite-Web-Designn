# PROMPT MESTRE — REFATORAÇÃO PREMIUM DO ELITE WEB DESIGNER

## PAPEL

Atue como um **Engenheiro de Software Sênior, Arquiteto Front-end, Especialista em Vue.js, TypeScript, Vite, Tailwind CSS, UI/UX Designer, Product Designer, Especialista em Acessibilidade, Performance, SEO Técnico e CRO**.

Você está trabalhando em um **projeto existente**.

NÃO crie uma aplicação nova do zero.

NÃO descarte a estrutura existente sem necessidade.

NÃO remova funcionalidades, integrações, rotas, formulários, eventos, links, tracking, componentes ou regras de negócio que já funcionam.

Sua missão é **auditar, reorganizar e reconstruir toda a camada visual/front-end do projeto existente**, usando como principal referência o layout premium preto e dourado fornecido no projeto.

---

# 1. STACK DO PROJETO

Considere prioritariamente esta stack:

- Vue.js 3
- Composition API
- `<script setup>`
- TypeScript
- Vite
- Tailwind CSS
- HTML5 semântico
- CSS moderno
- JavaScript/TypeScript moderno
- Componentização reutilizável
- Mobile First

Antes de alterar qualquer arquivo, analise `package.json`, configuração do Vite, configuração do Tailwind, estrutura de `src`, rotas, componentes, assets, composables e dependências realmente instaladas.

Não instale bibliotecas sem necessidade.

Não substitua uma solução nativa simples por uma dependência pesada.

---

# 2. OBJETIVO PRINCIPAL

Refazer o layout atual do site para criar uma experiência visual de alto padrão inspirada na referência fornecida:

**Elite Web Designer — Presença Digital de Excelência**

A interface deve transmitir:

- luxo;
- sofisticação;
- exclusividade;
- autoridade;
- tecnologia;
- alto padrão;
- confiança;
- serviço personalizado.

A estética principal deve combinar:

- preto profundo;
- grafite;
- dourado;
- bronze;
- champagne;
- off-white;
- detalhes metálicos;
- iluminação cinematográfica extremamente sutil;
- textura premium semelhante a mármore preto com veios dourados.

O resultado não deve parecer um template genérico.

O site precisa ter aparência de uma agência digital premium.

---

# 3. REGRA CRÍTICA: TRABALHAR SOBRE O PROJETO EXISTENTE

Antes de escrever código:

1. Faça uma auditoria completa da estrutura atual.
2. Identifique quais componentes podem ser reaproveitados.
3. Identifique quais componentes precisam ser refatorados.
4. Identifique códigos duplicados.
5. Identifique estilos globais conflitantes.
6. Identifique funcionalidades que não podem ser quebradas.
7. Identifique rotas e anchors existentes.
8. Localize os assets disponíveis no projeto.
9. Localize o logo oficial.
10. Localize as imagens dos projetos/portfólio.
11. Localize formulários e integrações existentes.
12. Localize botões de WhatsApp, e-mail, orçamento ou contato.
13. Verifique responsividade atual.
14. Verifique acessibilidade.
15. Verifique performance.

Depois da auditoria, implemente a nova interface incrementalmente.

Não reescreva código que já está correto apenas por preferência pessoal.

---

# 4. REFERÊNCIA VISUAL

Use a imagem de referência disponibilizada no projeto como **direção visual principal**.

Não trate a imagem como um simples background.

Ela representa a direção de:

- composição;
- grid;
- hierarquia;
- ritmo vertical;
- proporções;
- espaçamento;
- tipografia;
- luxo visual;
- contraste;
- uso do dourado;
- apresentação de projetos;
- hero;
- serviços;
- métricas;
- formulário;
- footer.

Recrie a interface com HTML/CSS/Vue real.

Evite transformar grandes áreas da página em screenshots.

---

# 5. ASSETS

Procure primeiro os assets existentes no projeto.

Caso exista uma pasta de assets extraídos, reutilize os arquivos adequados, especialmente:

- logo WD;
- logo transparente;
- mockups;
- imagens dos projetos;
- screenshots;
- divisores;
- elementos dourados;
- imagens WebP;
- referências visuais.

Prefira:

```txt
src/
  assets/
    brand/
    hero/
    portfolio/
    decorative/
```

ou adapte a estrutura existente sem causar breaking changes.

Imagens de conteúdo devem ser carregadas pelo projeto.

Elementos de interface como botões, formulários e navegação devem ser criados em HTML/CSS, não como imagens.

---

# 6. ARQUITETURA FRONT-END

Organize a aplicação de forma escalável.

Uma estrutura recomendada é:

```txt
src/
├─ assets/
├─ components/
│  ├─ ui/
│  │  ├─ BaseButton.vue
│  │  ├─ SectionHeading.vue
│  │  ├─ GoldDivider.vue
│  │  ├─ Container.vue
│  │  └─ IconButton.vue
│  │
│  ├─ layout/
│  │  ├─ AppHeader.vue
│  │  ├─ MobileMenu.vue
│  │  └─ AppFooter.vue
│  │
│  └─ sections/
│     ├─ HeroSection.vue
│     ├─ ServicesSection.vue
│     ├─ PortfolioSection.vue
│     ├─ BrandStatementSection.vue
│     ├─ StatsSection.vue
│     └─ ContactSection.vue
│
├─ composables/
├─ data/
│  ├─ navigation.ts
│  ├─ services.ts
│  ├─ portfolio.ts
│  └─ stats.ts
│
├─ views/
├─ router/
├─ styles/
└─ App.vue
```

Esta estrutura é uma referência.

Adapte ao projeto existente.

Não faça reorganizações destrutivas sem benefício real.

---

# 7. CLEAN CODE E ARQUITETURA

Aplique:

- SOLID;
- DRY;
- Separation of Concerns;
- Single Responsibility;
- componentes pequenos e reutilizáveis;
- tipagem forte;
- nomes claros;
- dados separados da apresentação;
- baixo acoplamento;
- alta coesão;
- composição em vez de duplicação;
- funções pequenas;
- constantes centralizadas;
- design tokens;
- variantes reutilizáveis.

Evite:

- componentes gigantes;
- CSS duplicado;
- valores mágicos espalhados;
- lógica complexa dentro do template;
- `any` desnecessário;
- estilos inline sem necessidade;
- watchers desnecessários;
- manipulação direta do DOM;
- dependências não utilizadas;
- classes Tailwind repetidas excessivamente.

Quando necessário, extraia padrões repetidos para componentes ou utilities.

---

# 8. DESIGN SYSTEM

Crie ou consolide tokens visuais.

## Cores

Use uma paleta próxima a:

```css
--color-bg: #070706;
--color-bg-secondary: #0d0c0a;
--color-surface: #11100e;

--color-gold-300: #d7b561;
--color-gold-400: #c99b3b;
--color-gold-500: #aa7e31;
--color-gold-600: #7f5a1d;

--color-ivory: #ddd2c0;
--color-text: #d1c6b5;
--color-muted: #968c7c;

--color-border: rgba(201, 155, 59, 0.45);
```

Ajuste os tons após comparar com os assets reais.

Não transforme tudo em dourado.

O dourado deve funcionar como **cor de destaque**, não como ruído visual.

---

# 9. TIPOGRAFIA

A tipografia deve reforçar luxo e editorial.

Use preferencialmente:

- serif elegante para títulos;
- sans-serif moderna para elementos funcionais.

Sugestões caso já existam ou possam ser carregadas corretamente:

### Títulos

- Cormorant Garamond
- Playfair Display
- DM Serif Display
- Libre Baskerville

### Interface

- Inter
- Manrope
- DM Sans
- Montserrat

Não carregue várias famílias sem necessidade.

Use `font-display: swap`.

Preserve legibilidade.

---

# 10. GRID E CONTAINER

Adote um container global consistente.

Exemplo conceitual:

```txt
max-width: 1280px / 1360px
padding mobile: 20px
padding tablet: 32px
padding desktop: 48px
```

Não deixe conteúdo importante colado nas bordas.

Mantenha alinhamentos consistentes entre:

- navbar;
- hero;
- serviços;
- portfólio;
- métricas;
- formulário;
- footer.

Use CSS Grid e Flexbox conscientemente.

---

# 11. HEADER

Crie um header premium inspirado na referência.

Desktop:

```txt
[ WD ]      INÍCIO   SERVIÇOS   PROJETOS   CONTATO      [ PEDIR ORÇAMENTO ]
```

Requisitos:

- posição inicialmente integrada ao layout;
- opção de sticky header se melhorar UX;
- fundo escuro translúcido quando sticky;
- backdrop blur moderado;
- linha dourada fina;
- logo à esquerda;
- navegação central;
- CTA à direita;
- estados hover refinados;
- focus-visible claramente perceptível;
- navegação por anchors suave;
- área clicável confortável.

Evite animações exageradas.

---

# 12. MENU MOBILE

No mobile:

- logo à esquerda;
- botão menu à direita;
- menu acessível;
- `aria-expanded`;
- `aria-controls`;
- controle por teclado;
- fechamento com ESC;
- bloqueio de scroll quando aberto, se necessário;
- CTA visível;
- transição curta e elegante.

Evite menus mobile confusos ou cheios de efeitos.

---

# 13. HERO

O hero é a área mais importante.

Estrutura visual desejada:

```txt
ARAÇATUBA — BRASIL

PRESENÇA DIGITAL
DE excelência

──────── ◇ ────────

Sites, lojas e aplicações desenvolvidos
sob medida para marcas exigentes.

[ SOLICITAR PROPOSTA ]    VER PORTFÓLIO

        [ MOCKUP PRINCIPAL ]
```

Requisitos:

- título muito forte;
- grande presença editorial;
- destaque em itálico para `excelência`;
- distribuição tipográfica elegante;
- largura de leitura controlada;
- CTAs claros;
- mockup principal abaixo;
- iluminação dourada suave;
- textura discreta;
- bastante espaço negativo.

Não sacrifique conversão por excesso decorativo.

---

# 14. BACKGROUND PREMIUM

Reproduza a sensação de mármore preto/dourado da referência sem prejudicar performance.

Estratégias aceitáveis:

1. asset de textura otimizado;
2. background WebP;
3. gradientes CSS;
4. pseudo-elements;
5. combinação de overlay + textura.

Evite:

- imagens gigantes sem compressão;
- canvas pesado;
- animação contínua do background;
- filtros caros em telas mobile.

Adicione overlays para manter contraste AA.

---

# 15. MICROINTERAÇÕES DO HERO

Permitir somente efeitos sutis:

- fade;
- translateY pequeno;
- gold glow suave;
- hover de botão;
- brilho leve em divisor;
- scale mínimo em mockup.

Respeite:

```css
@media (prefers-reduced-motion: reduce)
```

Não crie animações que prejudiquem a velocidade percebida.

---

# 16. SERVIÇOS

Reproduza a composição da referência com três pilares:

```txt
I
SITES INSTITUCIONAIS

II
E-COMMERCE DE LUXO

III
APLICATIVOS
```

Cada serviço deve conter:

- numeral romano;
- título;
- descrição curta;
- divisores verticais em desktop;
- separação horizontal em mobile;
- excelente alinhamento.

Crie os itens a partir de um array tipado.

Exemplo:

```ts
interface Service {
  id: string
  roman: string
  title: string
  description: string
}
```

---

# 17. PORTFÓLIO

A seção de portfólio deve ser uma das áreas visualmente mais importantes.

Cada projeto deve possuir:

- imagem;
- nome;
- categoria;
- estado hover;
- foco por teclado;
- link quando disponível.

Layout desktop:

- 4 colunas quando houver espaço real.

Tablet:

- 2 colunas.

Mobile:

- 1 coluna ou scroll horizontal cuidadosamente projetado.

Evite cards apertados.

---

# 18. DADOS DO PORTFÓLIO

Separe os dados da camada visual.

Exemplo:

```ts
export interface PortfolioProject {
  id: string
  title: string
  category: string
  image: string
  href?: string
  alt: string
}
```

Renderize via `v-for`.

Nunca duplique manualmente o mesmo markup para cada projeto.

---

# 19. CARD DE PROJETO

O card deve ter:

- proporção consistente;
- borda dourada delicada;
- imagem em alta qualidade;
- `overflow-hidden`;
- hover discreto;
- escala mínima da imagem;
- overlay opcional;
- título abaixo;
- categoria em dourado;
- foco acessível.

Exemplo de movimento:

```txt
scale 1 → 1.02
200–350ms
ease-out
```

Não use zoom agressivo.

---

# 20. FRASE DE MARCA

Crie uma seção editorial com:

> “Seu site é o reflexo da sua marca.”

A frase deve funcionar como respiro visual entre portfólio e métricas.

Use:

- serif;
- itálico;
- dourado;
- alinhamento central;
- bastante espaço vertical;
- divisores finos.

---

# 21. MÉTRICAS

Reproduza visualmente:

```txt
150+
PROJETOS CONCLUÍDOS

98%
TAXA DE SATISFAÇÃO

5+
ANOS DE EXPERIÊNCIA

24/7
SUPORTE E ATENDIMENTO
```

Crie com dados tipados.

Layout responsivo:

```txt
desktop: 4 colunas
tablet: 2 colunas
mobile: 1 ou 2 colunas
```

Use divisores apenas onde melhorarem a leitura.

Não force divisores verticais no mobile.

---

# 22. FORMULÁRIO

Refaça o formulário com estética premium e forte usabilidade.

Campos:

- nome;
- e-mail;
- WhatsApp;
- tipo de projeto;
- mensagem.

CTA:

```txt
ENVIAR SOLICITAÇÃO
```

Use labels reais.

Não dependa somente de placeholders.

Implementar:

- `autocomplete`;
- `inputmode`;
- tipos corretos;
- estados de erro;
- estados de sucesso;
- focus-visible;
- mensagens de validação;
- `aria-describedby` quando necessário;
- loading state;
- prevenção de double-submit.

Preserve a integração existente do formulário.

Não altere endpoint/API sem necessidade.

---

# 23. WHATSAPP

Caso o projeto já tenha CTA para WhatsApp:

- preserve o número existente;
- preserve tracking existente;
- preserve mensagem pré-configurada quando houver;
- aplique somente a nova identidade visual.

Não invente contatos.

---

# 24. FOOTER

Estruture aproximadamente:

```txt
LOGO

ELITE WEB DESIGNER
Presença Digital de Excelência

Social

AGÊNCIA
- Sobre nós
- Metodologia
- Diferenciais
- Depoimentos

SERVIÇOS
- Sites Institucionais
- E-commerce de Luxo
- Aplicativos
- Manutenção e Suporte

PORTFÓLIO
- Todos os projetos
- Cases de sucesso
- Marcas atendidas

CONTATO
- WhatsApp
- E-mail
- Araçatuba — SP, Brasil
```

Os dados reais existentes no projeto devem prevalecer.

Não invente endereço, telefone, e-mail ou redes sociais.

---

# 25. RESPONSIVIDADE

Desenvolva Mobile First.

Validar no mínimo:

```txt
320px
360px
375px
390px
430px
768px
1024px
1280px
1440px
1920px
```

Não dependa de breakpoints excessivos.

A interface deve funcionar entre breakpoints, não apenas exatamente neles.

---

# 26. MOBILE UX

No mobile:

- reduzir título proporcionalmente;
- preservar hierarquia;
- impedir overflow horizontal;
- manter botões confortáveis;
- reorganizar colunas;
- reduzir elementos puramente decorativos;
- garantir formulário fácil de usar;
- manter mockups legíveis;
- manter navegação simples;
- não comprimir tipografia até ficar ilegível.

---

# 27. ACESSIBILIDADE — WCAG

Trate acessibilidade como requisito de produção.

Aplicar:

- HTML semântico;
- landmarks;
- heading hierarchy;
- alt text;
- labels;
- navegação por teclado;
- focus-visible;
- contraste adequado;
- áreas clicáveis apropriadas;
- `aria-*` somente quando necessário;
- `aria-current` na navegação quando aplicável;
- `aria-expanded` no menu;
- mensagens acessíveis de formulário;
- redução de movimento.

Nunca remover outline sem substituição acessível.

---

# 28. PERFORMANCE

Meta:

- excelente Core Web Vitals;
- carregamento inicial rápido;
- evitar layout shift;
- reduzir JavaScript;
- otimizar imagens;
- lazy load abaixo da dobra;
- carregar hero prioritariamente;
- evitar bibliotecas grandes.

Imagens devem ter:

- `width`;
- `height`;
- `loading="lazy"` quando apropriado;
- `decoding="async"`;
- `alt`;
- WebP/AVIF quando possível;
- dimensões compatíveis com renderização.

Não aplique lazy loading na imagem LCP principal se isso atrasar o carregamento.

---

# 29. FONTES

Evite bloqueio de renderização.

Se usar Google Fonts:

- limite pesos;
- use preconnect quando fizer sentido;
- use `display=swap`.

Se houver fontes locais no projeto, avalie reutilizá-las.

---

# 30. SEO

Mantenha ou melhore:

- `<title>`;
- meta description;
- canonical;
- Open Graph;
- Twitter Card;
- headings;
- links internos;
- textos indexáveis;
- sitemap existente;
- robots existente.

Não prejudique SEO ao refatorar.

---

# 31. SEO LOCAL

Como a identidade da referência menciona Araçatuba, preserve referências locais reais existentes.

Não force SEO local caso o projeto tenha estratégia diferente.

Caso apropriado, estruturar:

```txt
Desenvolvimento de sites em Araçatuba
Criação de lojas virtuais
Desenvolvimento de aplicações
Web design premium
```

Não faça keyword stuffing.

---

# 32. CRO

A página deve guiar o usuário naturalmente para conversão.

Hierarquia recomendada:

```txt
Hero
↓
Proposta de valor
↓
Serviços
↓
Portfólio
↓
Autoridade
↓
Métricas
↓
Contato
```

CTAs principais:

```txt
Solicitar proposta
Pedir orçamento
Ver portfólio
Iniciar projeto
```

Evite dezenas de CTAs concorrentes.

---

# 33. UX WRITING

Prefira textos:

- diretos;
- sofisticados;
- claros;
- profissionais;
- orientados a benefício.

Evite clichês genéricos de agência.

Não altere textos comerciais importantes existentes sem justificar.

---

# 34. ESTADOS INTERATIVOS

Todo elemento interativo precisa de:

```txt
default
hover
focus-visible
active
disabled
loading
```

quando aplicável.

Não use hover como única indicação de interatividade.

---

# 35. TAILWIND CSS

Use Tailwind de forma organizada.

Evite gigantescas sequências repetidas de classes.

Quando um padrão aparecer repetidamente:

- crie componente;
- extraia classe;
- crie variant;
- use token.

Evite uso excessivo de valores arbitrários.

Use arbitrary values apenas quando realmente necessários para fidelidade visual.

---

# 36. CLASSES E UTILITIES

Se necessário, crie utilities semânticas:

```css
.text-gold-gradient {}
.surface-luxury {}
.border-gold {}
.gold-glow {}
.section-spacing {}
```

Mantenha estilos globais pequenos.

---

# 37. TYPESCRIPT

Use tipos explícitos onde agregarem segurança.

Evite:

```ts
any
```

Prefira:

```ts
interface
type
Record
readonly
as const
```

quando apropriado.

Não crie abstração excessiva apenas para demonstrar TypeScript.

---

# 38. VUE

Preferir:

```vue
<script setup lang="ts">
```

Use:

- `computed`;
- `ref`;
- composables;
- props tipadas;
- emits tipados.

Evite watchers quando `computed` resolver.

Evite manipulação direta do DOM.

---

# 39. COMPONENTES BASE

Quando fizer sentido, criar:

```txt
BaseButton
SectionHeading
GoldDivider
LuxuryCard
SiteContainer
FormField
```

Não criar dezenas de componentes de uma única linha sem benefício.

---

# 40. ANIMAÇÕES

Use animações com moderação.

Pode usar:

- CSS transitions;
- IntersectionObserver;
- Vue transitions.

Evite instalar GSAP/Framer Motion equivalente se o resultado puder ser feito com CSS.

Se já houver biblioteca de animação no projeto, avalie reutilizá-la.

---

# 41. SCROLL REVEAL

Caso seja implementado:

- executar uma vez;
- não bloquear conteúdo;
- preservar conteúdo visível sem JS;
- reduzir no mobile;
- respeitar `prefers-reduced-motion`.

---

# 42. ÍCONES

Utilize a biblioteca existente.

Caso não exista, prefira SVGs simples e consistentes.

Não misture vários estilos de ícone.

---

# 43. SEGURANÇA

Não introduza:

- `v-html` com conteúdo não confiável;
- secrets no frontend;
- chaves privadas;
- endpoints sensíveis;
- dados pessoais hardcoded;
- bibliotecas inseguras.

Preserve as medidas de segurança existentes.

---

# 44. NÃO QUEBRAR FUNCIONALIDADES

Antes e depois da alteração, valide:

- navegação;
- anchors;
- formulário;
- WhatsApp;
- links externos;
- menu mobile;
- rotas;
- CTAs;
- tracking;
- integrações;
- build.

Nenhum destes elementos pode parar de funcionar por causa da refatoração visual.

---

# 45. PRESERVAÇÃO DE CONTEÚDO

Não substitua dados reais por mocks.

Exemplos que devem ser preservados:

- telefone;
- e-mail;
- projetos;
- URLs;
- redes sociais;
- depoimentos;
- APIs;
- formulários;
- tracking IDs;
- conteúdo comercial.

---

# 46. QUALIDADE VISUAL

Evite:

- dourado excessivo;
- glow forte;
- glassmorphism gratuito;
- sombras pesadas;
- excesso de bordas;
- animações chamativas;
- fontes pequenas;
- margens inconsistentes;
- cards genéricos;
- background visualmente poluído;
- botões com baixa legibilidade.

Luxo deve vir de proporção, espaço, contraste, materialidade e tipografia.

---

# 47. EFEITO DOURADO

O dourado pode utilizar gradientes sutis.

Exemplo:

```css
background: linear-gradient(
  135deg,
  #76531a 0%,
  #c79635 40%,
  #e2bd69 55%,
  #a97827 100%
);
```

Não aplicar esse efeito em grandes blocos de texto.

---

# 48. BORDAS

Preferir:

```txt
1px
rgba dourado
baixa opacidade
```

Bordas devem estruturar o layout sem parecer caixas rígidas.

---

# 49. SOMBRAS

Usar sombras profundas e suaves.

Exemplo conceitual:

```css
box-shadow:
  0 24px 60px rgba(0, 0, 0, 0.45),
  0 0 40px rgba(201, 155, 59, 0.06);
```

Não gerar glow neon.

---

# 50. DESIGN RESPONSIVO DO HERO

O título não deve usar tamanhos fixos inadequados.

Considere `clamp()`.

Exemplo:

```css
font-size: clamp(3rem, 8vw, 6.75rem);
```

Ajuste ao projeto real.

---

# 51. ACESSIBILIDADE DE BOTÕES

Altura mínima sugerida:

```txt
44px
```

Botões mobile importantes podem ser maiores.

Texto sempre com contraste apropriado.

---

# 52. CARREGAMENTO E LCP

Detecte o provável elemento LCP.

Se for imagem:

- carregar cedo;
- evitar lazy loading;
- aplicar preload se comprovadamente necessário;
- definir dimensões.

Não use preload indiscriminadamente.

---

# 53. CLS

Evite Layout Shift.

Defina proporções para:

- imagens;
- mockups;
- cards;
- logos.

Utilize `aspect-ratio`.

---

# 54. VALIDAÇÃO DO BUILD

Ao final execute, conforme scripts disponíveis:

```bash
npm run build
```

E, se existirem:

```bash
npm run lint
npm run type-check
npm run test
```

Corrija os erros causados pela refatoração.

Não ignore erros TypeScript.

---

# 55. AUDITORIA FINAL

Faça uma revisão completa procurando:

- imports não utilizados;
- código morto;
- classes duplicadas;
- problemas mobile;
- overflow horizontal;
- contraste;
- elementos sem alt;
- inputs sem label;
- warnings Vue;
- erros TypeScript;
- links quebrados;
- imagens ausentes;
- layout shift;
- componentes duplicados.

---

# 56. NÃO FAZER

Não faça nenhuma das seguintes ações:

```txt
❌ criar outro projeto Vite;
❌ substituir package.json;
❌ apagar funcionalidades existentes;
❌ trocar toda a arquitetura sem necessidade;
❌ remover integrações;
❌ inventar dados de contato;
❌ colocar tudo dentro de App.vue;
❌ criar toda a página como imagem;
❌ usar screenshots como botões;
❌ usar animações pesadas;
❌ usar dezenas de dependências;
❌ ignorar mobile;
❌ ignorar acessibilidade;
❌ ignorar SEO;
❌ esconder erros TypeScript;
❌ desabilitar lint para fazer o build passar;
❌ usar !important indiscriminadamente.
```

---

# 57. ORDEM DE EXECUÇÃO OBRIGATÓRIA

Execute nesta ordem:

## ETAPA 1 — AUDITORIA

Analise:

```txt
package.json
src/
vite.config.*
tailwind.config.*
router/
assets/
components/
views/
styles/
```

Entenda a aplicação antes de alterar código.

---

## ETAPA 2 — MAPA DE IMPACTO

Liste internamente:

- arquivos preservados;
- arquivos modificados;
- arquivos criados;
- componentes reutilizados;
- riscos;
- funcionalidades críticas.

---

## ETAPA 3 — DESIGN SYSTEM

Configure:

- cores;
- tipografia;
- espaçamento;
- container;
- bordas;
- sombras;
- transitions.

---

## ETAPA 4 — COMPONENTES BASE

Crie/refatore somente os componentes realmente necessários.

---

## ETAPA 5 — HEADER

Refatore navegação desktop e mobile.

---

## ETAPA 6 — HERO

Reconstrua o hero com máxima fidelidade visual e responsividade.

---

## ETAPA 7 — SERVIÇOS

Implemente os três pilares.

---

## ETAPA 8 — PORTFÓLIO

Implemente grid dinâmico e reutilizável.

---

## ETAPA 9 — FRASE + MÉTRICAS

Crie a área de autoridade.

---

## ETAPA 10 — CONTATO

Refatore formulário sem quebrar integração.

---

## ETAPA 11 — FOOTER

Organize informações e navegação secundária.

---

## ETAPA 12 — RESPONSIVIDADE

Teste todos os tamanhos relevantes.

---

## ETAPA 13 — ACESSIBILIDADE

Faça revisão WCAG.

---

## ETAPA 14 — PERFORMANCE

Otimize imagens, carregamento e JavaScript.

---

## ETAPA 15 — BUILD

Execute validações e corrija regressões.

---

# 58. CRITÉRIOS DE ACEITAÇÃO

Considere a tarefa concluída somente quando:

- o projeto existente continuar funcionando;
- o layout estiver claramente alinhado à referência;
- a identidade preto/dourado estiver consistente;
- o hero tiver forte impacto visual;
- o site estiver responsivo;
- não existir overflow horizontal;
- o menu mobile funcionar;
- os CTAs funcionarem;
- o formulário funcionar;
- o portfólio for dinâmico;
- o conteúdo real estiver preservado;
- o código estiver componentizado;
- TypeScript estiver correto;
- acessibilidade básica WCAG estiver atendida;
- assets estiverem otimizados;
- build finalizar sem erros causados pela alteração;
- não houver warnings importantes no console;
- não houver links quebrados;
- não houver regressões funcionais.

---

# 59. RESULTADO VISUAL ESPERADO

O resultado final deve parecer um produto digital premium construído sob medida para uma agência de alto padrão.

A percepção desejada é:

```txt
minimalismo
+
luxo editorial
+
tecnologia
+
precisão
+
conversão
```

A interface deve parecer cara sem parecer exagerada.

---

# 60. COMPORTAMENTO DO AGENTE DURANTE A IMPLEMENTAÇÃO

Não fique apenas explicando o que poderia ser feito.

Execute as alterações necessárias.

Antes de criar algo novo, procure se já existe uma implementação equivalente no projeto.

Sempre preserve compatibilidade.

Se encontrar código ruim diretamente relacionado à refatoração, melhore-o.

Se encontrar um problema fora do escopo e que possa causar risco, informe ao final, mas não transforme a tarefa em uma reescrita completa.

---

# 61. RELATÓRIO FINAL

Quando terminar, informe de forma objetiva:

```txt
1. Arquivos criados.
2. Arquivos alterados.
3. Componentes refatorados.
4. Melhorias de UI/UX aplicadas.
5. Melhorias de responsividade.
6. Melhorias de acessibilidade.
7. Melhorias de performance.
8. Melhorias de SEO.
9. Funcionalidades preservadas.
10. Resultado do build.
11. Riscos ou pontos que ainda merecem revisão.
```

Não apresente apenas teoria.

Entregue a implementação funcional.

---

# COMANDO FINAL

Agora analise o projeto existente por completo e execute a refatoração visual e arquitetural seguindo todas as regras acima.

Use a imagem premium preto/dourado fornecida no projeto como referência principal de direção visual.

**Não crie uma aplicação nova. Trabalhe sobre a implementação existente, preserve as funcionalidades atuais e eleve o produto ao nível de uma interface premium, moderna, responsiva, acessível, performática e pronta para produção.**
