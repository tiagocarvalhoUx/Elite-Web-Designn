<script setup lang="ts">
/**
 * PortfolioStack.vue — o catálogo inteiro, em páginas empilhadas.
 * -----------------------------------------------------------------------
 * Um projeto por vez, preso ao scroll: a página atual recua como uma folha
 * apoiada numa mesa enquanto a próxima desliza por cima. Fecha a última e
 * solta o pin.
 *
 * `projects` é a lista inteira vinda do Supabase (`PortfolioSection.vue`
 * decide o recorte, se algum dia precisar de um). Com muitos projetos isso
 * é bastante scroll de uma vez — decisão tomada de propósito, para manter a
 * jornada de "um projeto por vez" completa, sem separar em vitrine + grade.
 *
 * Cada folha é clicável e abre o mesmo `ProjectLightbox` do resto do site:
 * a experiência de "entrar no projeto e ver os mockups" não muda em nada.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { PortfolioProject } from '@/data/portfolio'

const props = defineProps<{ projects: readonly PortfolioProject[] }>()
const emit = defineEmits<{ open: [project: PortfolioProject] }>()

type Gsap = (typeof import('gsap'))['gsap']
type Trigger = (typeof import('gsap/ScrollTrigger'))['ScrollTrigger']

// A folha que sai recua como uma página apoiada numa mesa horizontal; a
// próxima segue logo atrás, reproduzindo o ritmo da referência.
const CARD_SCALE_BACK = 0.9
const CARD_BACK_Y = -75
const CARD_ROTATE_X = 68
const CARD_ENTRY_Y = 100
const CARD_DIM_BACK = 0.46
const NEXT_CARD_DELAY = 0.12
const SCROLL_PER_CARD = 1.15
const SCRUB_SMOOTHNESS = 1
const STEP_HOLD = 0.1
const STEP_MOTION = 0.75
const STEP_SETTLE = 0.15

const section = ref<HTMLElement | null>(null)
const sticky = ref<HTMLElement | null>(null)
const active = ref(0)
/**
 * Com movimento reduzido as folhas deixam de ser decorativas — viram a grade
 * real, então precisam ser alcançáveis por teclado. CSS não altera `tabindex`,
 * por isso o valor vem daqui.
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let media: ReturnType<Gsap['matchMedia']> | undefined

function leadLine(description: string): string {
  // A primeira linha carrega o gancho; a legenda aqui é um convite, não a
  // descrição inteira (essa mora no lightbox, ao abrir o projeto).
  return description.split('\n')[0] ?? description
}

/**
 * Todas as folhas ocupam o mesmo retângulo (`inset: 0`), empilhadas por
 * z-index — geometricamente todas "estão" na tela desde o primeiro quadro.
 * `loading="lazy"` decide pela distância até o viewport, então não adianta
 * nada aqui: o navegador baixaria o catálogo inteiro de uma vez, disputando
 * banda com o vídeo e as fontes logo na carga da página. Em vez disso, cada
 * folha só ganha `src` quando está perto da vez — a folha atual e as duas
 * seguintes — e permanece carregada depois, sem descarregar ao passar.
 *
 * Com `prefers-reduced-motion` o pin nunca roda (`active` não avança) e a
 * pilha vira uma grade normal, onde `loading="lazy"` do navegador já resolve
 * tudo sozinho — por isso a janela por índice não se aplica a esse caso.
 */
const LOOKAHEAD = 2
function shouldLoad(index: number): boolean {
  return prefersReducedMotion || index <= active.value + LOOKAHEAD
}

onMounted(async () => {
  if (!section.value) return
  try {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    gsap.registerPlugin(ScrollTrigger)
    choreograph(gsap, ScrollTrigger)
  } catch {
    // Sem o chunk de animação, a grade estática (CSS) segue sendo o conteúdo real.
  }
})

onBeforeUnmount(() => media?.revert())

function choreograph(gsap: Gsap, ScrollTrigger: Trigger): void {
  if (!section.value || !sticky.value) return
  const sheets = gsap.utils.toArray<HTMLElement>(section.value.querySelectorAll('.portfolio-sheet'))
  const panels = sheets.map((sheet) => sheet.querySelector<HTMLElement>('.portfolio-sheet-panel')).filter((el): el is HTMLElement => el !== null)
  const dimmers = sheets.map((sheet) => sheet.querySelector<HTMLElement>('.portfolio-page-dim')).filter((el): el is HTMLElement => el !== null)

  media = gsap.matchMedia()
  media.add(
    { reduced: '(prefers-reduced-motion: reduce)', mobile: '(max-width: 760px)', desktop: '(min-width: 761px)' },
    (context) => {
      const { reduced } = context.conditions as { reduced: boolean }
      active.value = 0
      if (reduced) return // Sem pin: a última folha fica visível e legível, como o resto do site sem JS.

      const state = { project: 0 }

      gsap.set(panels, {
        yPercent: CARD_ENTRY_Y,
        scale: 1,
        rotationX: 0,
        autoAlpha: 1,
        force3D: true,
        transformOrigin: '50% 100%',
        backfaceVisibility: 'hidden',
      })
      gsap.set(panels[0] ?? [], { yPercent: 0 })
      gsap.set(dimmers, { autoAlpha: 0 })

      const timeline = gsap.timeline({
        onUpdate: () => {
          active.value = Math.min(props.projects.length - 1, Math.floor(state.project + 0.001))
        },
        scrollTrigger: {
          trigger: section.value,
          start: 'top top',
          end: () => `+=${(panels.length - 1) * window.innerHeight * SCROLL_PER_CARD}`,
          pin: sticky.value,
          pinSpacing: true,
          scrub: SCRUB_SMOOTHNESS,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      for (let index = 1; index < panels.length; index++) {
        const current = panels[index - 1]
        const next = panels[index]
        const currentDimmer = dimmers[index - 1]
        const stepStart = timeline.duration()
        const motionStart = stepStart + STEP_HOLD

        timeline
          .addLabel(`card-${index}`, stepStart)
          .to({}, { duration: STEP_HOLD }, stepStart)
          .to(current, { yPercent: CARD_BACK_Y, scale: CARD_SCALE_BACK, rotationX: CARD_ROTATE_X, duration: STEP_MOTION, ease: 'none' }, motionStart)
          .to(currentDimmer, { autoAlpha: CARD_DIM_BACK, duration: STEP_MOTION, ease: 'none' }, motionStart)
          .to(next, { yPercent: 0, scale: 1, rotationX: 0, duration: STEP_MOTION - NEXT_CARD_DELAY, ease: 'none' }, motionStart + NEXT_CARD_DELAY)
          .to(state, { project: index, duration: STEP_MOTION - NEXT_CARD_DELAY, ease: 'none' }, motionStart + NEXT_CARD_DELAY)
          .to({}, { duration: STEP_SETTLE })
      }

      const images = [...section.value!.querySelectorAll<HTMLImageElement>('.portfolio-media img')]
      const imagesReady = Promise.all(
        images.map((image) => (image.complete ? Promise.resolve() : new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true })
          image.addEventListener('error', () => resolve(), { once: true })
        }))),
      )
      Promise.all([imagesReady, document.fonts?.ready ?? Promise.resolve()]).then(() => {
        if (section.value) ScrollTrigger.refresh()
      })

      return () => timeline.kill()
    },
  )
}
</script>

<template>
  <div ref="section" class="portfolio-stack">
    <div ref="sticky" class="portfolio-sticky">
      <header class="portfolio-intro">
        <p class="label-caps text-gold-400">Projetos selecionados</p>
        <div class="portfolio-copy-inner">
          <p class="portfolio-meta">
            {{ String(active + 1).padStart(2, '0') }} / {{ String(projects.length).padStart(2, '0') }}
            <span v-if="projects[active]?.category"> · {{ projects[active]?.category }}</span>
          </p>
          <h2 id="portfolio-stack-titulo">{{ projects[active]?.title }}</h2>
          <p class="portfolio-lead">{{ leadLine(projects[active]?.description ?? '') }}</p>
        </div>
      </header>

      <div class="portfolio-pages" aria-hidden="true">
        <article
          v-for="(project, index) in projects"
          :key="project.id"
          class="portfolio-sheet"
          :style="{ zIndex: index + 1, '--trace-delay': `${index * -1.1}s`, '--trace-duration': `${6.5 + (index % 3) * 0.6}s` }"
        >
          <button
            type="button"
            class="portfolio-sheet-panel gold-trace"
            :aria-label="`Ver apresentação do projeto ${project.title}`"
            aria-haspopup="dialog"
            :tabindex="prefersReducedMotion ? 0 : -1"
            @click="emit('open', project)"
          >
            <div class="portfolio-media">
              <img
                v-if="shouldLoad(index)"
                :src="project.src"
                alt=""
                :loading="index === 0 ? 'eager' : 'lazy'"
                decoding="async"
              />
            </div>
            <div class="portfolio-page-dim" />
            <!-- Gradiente próprio, não `::after`: esse pseudo-elemento já é o filete dourado do `gold-trace`. -->
            <span class="portfolio-sheet-fade" aria-hidden="true" />
          </button>
        </article>
      </div>

      <div class="portfolio-status" aria-hidden="true">
        <span>{{ String(active + 1).padStart(2, '0') }}</span>
        <i><b :style="{ transform: `scaleX(${(active + 1) / projects.length})` }" /></i>
        <small>{{ String(projects.length).padStart(2, '0') }}</small>
      </div>
    </div>

    <ol class="sr-only" aria-label="Projetos selecionados">
      <li v-for="project in projects">
        <button type="button" @click="emit('open', project)">{{ project.title }} — {{ leadLine(project.description) }}</button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.portfolio-stack {
  position: relative;
  background: var(--color-ink-950);
}

.portfolio-sticky {
  position: relative;
  height: 100svh;
  min-height: 620px;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(75% 80% at 82% 18%, rgb(201 155 59 / 0.11), transparent 58%),
    linear-gradient(180deg, var(--color-ink-850), var(--color-ink-950));
}

.portfolio-intro {
  position: absolute;
  z-index: 20;
  left: 24px;
  right: 24px;
  top: 76px;
  bottom: auto;
  width: auto;
  height: 31%;
  display: block;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

/* No mobile o texto pousa sobre a própria imagem — o degradê atrás garante
   contraste. No desktop a coluna fica sobre fundo liso: o degradê some. */
.portfolio-copy-inner {
  margin-top: clamp(24px, 4svh, 42px);
  padding: 0;
  position: relative;
  text-shadow: 0 2px 18px rgb(0 0 0 / 0.82);
}

.portfolio-copy-inner::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: -14px -24px;
  background: linear-gradient(90deg, rgb(5 5 4 / 0.88), rgb(5 5 4 / 0.7) 72%, transparent);
  pointer-events: none;
}

.portfolio-meta {
  margin: 0 0 14px;
  color: var(--color-gold-200);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: clamp(0.6rem, 0.72vw, 0.7rem);
  line-height: 1.4;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.portfolio-intro h2 {
  max-width: 13ch;
  margin: 0 0 10px;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.4rem, 11vw, 3.7rem);
  line-height: 0.86;
  color: var(--color-ivory);
  text-wrap: balance;
}

.portfolio-lead {
  max-width: 34ch;
  margin: 0;
  color: var(--color-sand);
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.portfolio-pages {
  position: absolute;
  z-index: 2;
  left: 16px;
  right: 16px;
  top: 41%;
  bottom: 7%;
  overflow: hidden;
  perspective: 1100px;
  perspective-origin: center 72%;
  transform-style: preserve-3d;
}

.portfolio-sheet {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  pointer-events: none;
  transform-style: preserve-3d;
}

.portfolio-sheet-panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgb(232 200 116 / 0.2);
  border-radius: clamp(12px, 1.5vw, 24px);
  background: var(--color-ink-700);
  box-shadow: 0 -18px 38px rgb(0 0 0 / 0.34), 0 40px 90px rgb(0 0 0 / 0.62);
  backface-visibility: hidden;
  will-change: transform, opacity;
  transform-style: preserve-3d;
  padding: 0;
  cursor: pointer;
  pointer-events: auto;
}

.portfolio-sheet:not(:first-child) .portfolio-sheet-panel {
  opacity: 0;
}

.portfolio-media {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.portfolio-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  will-change: transform;
}

.portfolio-page-dim {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: rgb(4 4 3 / 0.86);
  pointer-events: none;
}

.portfolio-sheet-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgb(4 4 3 / 0.18), transparent 36%);
  pointer-events: none;
}

.portfolio-status {
  position: absolute;
  z-index: 20;
  right: 20px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-gold-200);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
}

.portfolio-status i {
  display: block;
  width: 58px;
  height: 1px;
  background: rgb(232 200 116 / 0.22);
  overflow: hidden;
}

.portfolio-status b {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--color-gold-200);
  transform-origin: left center;
  transition: transform 0.28s var(--ease-luxe);
}

.portfolio-status small {
  color: var(--color-muted);
  font-size: 0.64rem;
}

/* 761px: a coluna de texto volta a ficar fixa à esquerda, sobre fundo liso —
   o degradê atrás dela (só necessário em cima de foto, no mobile) some. */
@media (min-width: 761px) {
  .portfolio-intro {
    left: clamp(24px, 5vw, 76px);
    right: auto;
    top: clamp(86px, 10svh, 118px);
    bottom: clamp(76px, 10svh, 110px);
    width: min(32vw, 430px);
    height: auto;
    display: flex;
  }
  .portfolio-copy-inner {
    margin-top: 0;
    padding: 0 0 clamp(18px, 3svh, 38px);
    text-shadow: none;
  }
  .portfolio-copy-inner::before {
    display: none;
  }
  .portfolio-intro h2 { font-size: clamp(2.8rem, 5.2vw, 5.8rem); max-width: none; margin-bottom: 18px; }
  .portfolio-lead { font-size: clamp(0.92rem, 1.1vw, 1.05rem); max-width: 32ch; }
  .portfolio-pages { left: 50%; right: clamp(24px, 4vw, 64px); top: clamp(112px, 13svh, 142px); bottom: clamp(66px, 8svh, 86px); }
  .portfolio-status { right: clamp(24px, 5vw, 76px); bottom: clamp(20px, 3svh, 34px); }
  .portfolio-status i { width: 90px; }
}

@media (prefers-reduced-motion: reduce) {
  .portfolio-sticky { height: auto; min-height: 100svh; padding: 100px 24px 70px; overflow: visible; }
  .portfolio-intro { position: relative; inset: auto; width: auto; height: auto; display: block; margin-bottom: 36px; }
  .portfolio-copy-inner { margin-top: 28px; padding: 0; }
  .portfolio-lead { display: block; margin-top: 18px; -webkit-line-clamp: unset; }
  .portfolio-pages { position: relative; inset: auto; display: grid; gap: 24px; overflow: visible; }
  .portfolio-sheet {
    position: relative;
    inset: auto;
    width: 100%;
    max-width: 1000px;
    aspect-ratio: 3 / 2;
    height: auto;
    transform: none !important;
    justify-self: center;
  }
  .portfolio-sheet-panel { transform: none !important; opacity: 1 !important; pointer-events: auto; }
  .portfolio-page-dim { display: none; }
  .portfolio-status { display: none; }
}
</style>
