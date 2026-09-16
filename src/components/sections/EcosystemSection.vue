<script setup lang="ts">
/**
 * EcosystemSection.vue — "O Ecossistema Elite"
 * -----------------------------------------------------------------------
 * Carrossel 360° dos quatro dispositivos (desktop, notebook, tablet,
 * smartphone), preso ao scroll: cada um assume o centro do palco por uma
 * pausa de leitura, então gira para o próximo. Fecha os 360° no smartphone.
 *
 * Motion: GSAP carrega sob demanda, no mesmo espírito de `useMotion.ts` —
 * até o chunk chegar (e com `prefers-reduced-motion`, ou se falhar), o CSS
 * mostra uma grade estática com os quatro dispositivos, sempre legível e
 * sem depender de JavaScript.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ecosystemStations } from '@/data/ecosystem'
import DeviceCutout from '@/components/ui/DeviceCutout.vue'

type Gsap = (typeof import('gsap'))['gsap']

const section = ref<HTMLElement | null>(null)
const sticky = ref<HTMLElement | null>(null)
const carouselTrack = ref<HTMLElement | null>(null)
const beamLeft = ref<HTMLElement | null>(null)
const beamRight = ref<HTMLElement | null>(null)
const active = ref(0)

let media: ReturnType<Gsap['matchMedia']> | undefined

onMounted(async () => {
  if (!section.value) return
  try {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    gsap.registerPlugin(ScrollTrigger)
    choreograph(gsap)
  } catch {
    // Sem o chunk de animação, a grade estática (CSS) segue sendo o conteúdo real.
  }
})

onBeforeUnmount(() => media?.revert())

function choreograph(gsap: Gsap): void {
  if (!section.value || !sticky.value || !carouselTrack.value) return
  const cards = gsap.utils.toArray<HTMLElement>(section.value.querySelectorAll('.editorial-carousel-card'))

  media = gsap.matchMedia()
  // As três condições cobrem qualquer largura — sem isso o matchMedia nunca
  // chama o callback fora da faixa coberta, e a órbita nunca ganha vida.
  media.add(
    { reduced: '(prefers-reduced-motion: reduce)', mobile: '(max-width: 760px)', desktop: '(min-width: 761px)' },
    (context) => {
      const { reduced, mobile } = context.conditions as { reduced: boolean; mobile: boolean }
      active.value = 0
      if (reduced) return // O CSS entrega uma grade estática e legível, sem prender o scroll.

      const track = carouselTrack.value
      if (!track) return

      const orbit = { turn: 0 }
      const visibleArc = 34
      let radius = 0
      let spiralHeight = 0

      const measure = (): void => {
        radius = Math.min(280, track.clientWidth * 0.36)
        spiralHeight = Math.min(mobile ? 52 : 88, track.clientHeight * 0.14)
      }

      const render = (): void => {
        cards.forEach((card, index) => {
          // Quatro estações a 90° criam uma órbita contínua de 360°.
          const degrees = ((index * 90 - orbit.turn + 540) % 360) - 180
          const distance = Math.abs(degrees)
          const ratio = gsap.utils.clamp(0, 1, distance / visibleArc)
          const focus = 1 - ratio
          const opacity = focus * focus * (3 - 2 * focus)
          const entering = degrees > 0
          const angle = (degrees * Math.PI) / 180
          const helixY = Math.sin(angle * 2) * spiralHeight

          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: Math.sin(angle) * radius,
            y: helixY + (entering ? 18 : -12) * ratio,
            z: (entering ? -220 : 145) * ratio,
            rotationX: degrees * (mobile ? 0.1 : 0.16),
            rotationY: -degrees * 0.88,
            rotationZ: -degrees * (mobile ? 0.14 : 0.24),
            scale: entering ? 0.62 + 0.38 * focus : 1 + 0.3 * ratio,
            autoAlpha: opacity < 0.015 ? 0 : opacity,
            zIndex: Math.round(100 - distance),
          })
        })
        // A legenda troca no intervalo vazio entre o card que sai e o que entra.
        active.value = Math.round(orbit.turn / 90) % ecosystemStations.length
      }

      measure()
      render()

      const timeline = gsap.timeline({
        onUpdate: render,
        scrollTrigger: {
          trigger: section.value,
          start: 'top top',
          end: () => `+=${Math.max(2400, window.innerHeight * 4)}`,
          pin: sticky.value,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure()
            render()
          },
        },
      })

      // Segura cada estação a 90°, depois gira para a próxima. A quarta fecha os 360°.
      for (let step = 0; step < ecosystemStations.length; step++) {
        timeline
          .to(orbit, { turn: step * 90, duration: 0.28, ease: 'none' })
          .to(orbit, { turn: (step + 1) * 90, duration: 1.08, ease: 'sine.inOut' })
      }
      timeline.to(orbit, { turn: 360, duration: 0.38, ease: 'none' })

      const sceneDuration = timeline.duration()

      // Dois feixes estreitos cruzam os dispositivos, voltam e convergem no fim.
      if (beamLeft.value) {
        timeline
          .fromTo(
            beamLeft.value,
            { x: () => window.innerWidth * -0.16, yPercent: -4, rotation: -32, opacity: 0 },
            { x: () => window.innerWidth * 1.08, yPercent: 8, rotation: -38, opacity: 0.56, duration: sceneDuration * 0.46, ease: 'sine.inOut' },
            0,
          )
          .to(beamLeft.value, { x: () => window.innerWidth * 0.42, yPercent: 0, rotation: -31, opacity: 0.52, duration: sceneDuration * 0.42, ease: 'sine.inOut' }, sceneDuration * 0.46)
          .to(beamLeft.value, { x: () => window.innerWidth * 0.36, yPercent: -2, rotation: -29, opacity: 0, duration: sceneDuration * 0.12, ease: 'sine.out' }, sceneDuration * 0.88)
      }
      if (beamRight.value) {
        timeline
          .fromTo(
            beamRight.value,
            { x: () => window.innerWidth * 0.16, yPercent: -4, rotation: 32, opacity: 0 },
            { x: () => window.innerWidth * -1.08, yPercent: 8, rotation: 38, opacity: 0.5, duration: sceneDuration * 0.46, ease: 'sine.inOut' },
            0,
          )
          .to(beamRight.value, { x: () => window.innerWidth * -0.1, yPercent: 0, rotation: 31, opacity: 0.48, duration: sceneDuration * 0.42, ease: 'sine.inOut' }, sceneDuration * 0.46)
          .to(beamRight.value, { x: () => window.innerWidth * -0.06, yPercent: -2, rotation: 29, opacity: 0, duration: sceneDuration * 0.12, ease: 'sine.out' }, sceneDuration * 0.88)
      }

      return () => timeline.kill()
    },
  )
}
</script>

<template>
  <section id="ecossistema" ref="section" class="editorial-scroll" aria-labelledby="ecossistema-titulo">
    <div class="editorial-sticky" ref="sticky">
      <div class="editorial-visuals" aria-hidden="true">
        <div class="editorial-stage">
          <div class="editorial-carousel">
            <div ref="carouselTrack" class="editorial-carousel-track">
              <figure
                v-for="station in ecosystemStations"
                :key="station.id"
                class="editorial-carousel-card"
                :class="[`card-${station.id}`]"
              >
                <DeviceCutout :device="station.id" />
              </figure>
            </div>
          </div>
          <div class="editorial-light-show">
            <i ref="beamLeft" class="editorial-beam editorial-beam-left" />
            <i ref="beamRight" class="editorial-beam editorial-beam-right" />
          </div>
        </div>
        <div class="editorial-shade" />
      </div>

      <div class="editorial-copy">
        <Transition name="editorial-copy" mode="out-in">
          <div :key="active" class="editorial-copy-inner">
            <p class="label-caps text-gold-400">{{ ecosystemStations[active]?.kicker }}</p>
            <h2 id="ecossistema-titulo">{{ ecosystemStations[active]?.title }}</h2>
            <p>{{ ecosystemStations[active]?.text }}</p>
            <div class="editorial-progress" aria-hidden="true">
              <span v-for="(station, index) in ecosystemStations" :key="station.id" :class="{ active: index <= active }" />
            </div>
          </div>
        </Transition>
      </div>

      <div class="editorial-count" aria-hidden="true">{{ String(active + 1).padStart(2, '0') }} <i>/ 04</i></div>
      <div class="editorial-scroll-hint" aria-hidden="true"><span>Scroll para explorar</span><i /></div>
    </div>

    <ol class="sr-only" aria-label="Momentos da experiência">
      <li v-for="station in ecosystemStations" :key="station.id">{{ station.title }} — {{ station.text }}</li>
    </ol>
  </section>
</template>

<style scoped>
.editorial-scroll {
  position: relative;
  background: var(--color-ink-950);
}

/* O ScrollTrigger é dono da altura do espaço reservado. Uma altura fixa
   deixaria o rodapé entrar antes do pin soltar em telas desktop baixas. */
.editorial-sticky {
  position: relative;
  height: 100svh;
  min-height: 560px;
  overflow: hidden;
  isolation: isolate;
}

.editorial-visuals {
  position: absolute;
  inset: 0;
}

.editorial-shade {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(7, 7, 6, 0.4), transparent 42%);
}

.editorial-copy {
  position: absolute;
  left: 24px;
  right: 24px;
  top: 14%;
  width: auto;
  max-width: none;
  transform: none;
  z-index: 4;
}

.editorial-copy h2 {
  max-width: 19ch;
  margin: 10px 0 12px;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2rem, 7.5vw, 3.4rem);
  line-height: 1;
  color: var(--color-ivory);
  text-wrap: balance;
}

.editorial-copy-inner > p:not(.label-caps) {
  margin: 0;
  max-width: 40ch;
  color: var(--color-sand);
  font-size: 1rem;
  line-height: 1.5;
}

.editorial-progress {
  display: flex;
  gap: 8px;
  margin-top: 18px;
}

.editorial-progress span {
  width: 46px;
  height: 2px;
  background: rgb(201 155 59 / 0.3);
  transition: background-color 0.3s ease;
}

.editorial-progress span.active {
  background: var(--color-gold-200);
}

.editorial-count {
  position: absolute;
  right: 20px;
  bottom: 26px;
  z-index: 4;
  color: var(--color-gold-200);
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
}

.editorial-count i {
  font-style: normal;
  color: var(--color-muted);
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
}

.editorial-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background: #050403 url('@/assets/editorial/ecosystem-stage-bg.webp') center / cover no-repeat;
}

.editorial-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(68% 76% at 65% 42%, transparent 0%, rgba(2, 2, 1, 0.12) 58%, rgba(2, 2, 1, 0.54) 100%),
    linear-gradient(180deg, rgba(3, 3, 2, 0.08), rgba(3, 3, 2, 0.48));
}

.editorial-stage::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.54) 0%, rgba(0, 0, 0, 0.2) 35%, transparent 64%, rgba(0, 0, 0, 0.12) 100%);
}

.editorial-carousel {
  position: absolute;
  left: 8%;
  right: 8%;
  top: 44%;
  bottom: 12%;
  perspective: 1500px;
  perspective-origin: 50% 50%;
}

.editorial-carousel-track {
  position: absolute;
  inset: 0;
  z-index: 1;
  transform-style: preserve-3d;
  will-change: transform;
}

.editorial-carousel-card {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: 0;
  display: grid;
  place-items: center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  opacity: 0;
  visibility: hidden;
  will-change: transform, opacity;
  background: transparent;
  transform: translate(-50%, -50%);
}

.editorial-carousel-card:first-child {
  opacity: 1;
  visibility: visible;
}

/* Dimensionado contra os dois eixos do viewport — a profundidade negativa da
   órbita nunca amplia as fotos além do tamanho real. */
.card-desktop { width: min(88%, 40svh); aspect-ratio: 1000 / 946; }
.card-notebook { width: min(96%, 70svh); aspect-ratio: 1380 / 766; }
.card-tablet { width: min(52%, 23svh); aspect-ratio: 670 / 1196; }
.card-smartphone { width: min(36%, 17svh); aspect-ratio: 552 / 1314; }

.editorial-light-show {
  position: absolute;
  inset: 0;
  z-index: 6;
  overflow: hidden;
  pointer-events: none;
  mix-blend-mode: screen;
}

.editorial-beam {
  position: absolute;
  top: 6%;
  width: clamp(41px, 3.4vw, 60px);
  height: 89%;
  display: block;
  opacity: 0;
  transform-origin: 50% 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(176, 126, 34, 0.015) 22%,
    rgba(215, 166, 67, 0.07) 38%,
    rgba(239, 198, 111, 0.24) 46%,
    rgba(255, 226, 157, 0.64) 49%,
    rgba(255, 246, 211, 0.9) 50%,
    rgba(248, 216, 139, 0.58) 51.5%,
    rgba(218, 165, 65, 0.18) 55%,
    rgba(180, 128, 33, 0.045) 64%,
    transparent 100%
  );
  filter: blur(2.6px);
  will-change: transform, opacity;
}

.editorial-beam::before {
  content: '';
  position: absolute;
  inset: 0 -88%;
  background: linear-gradient(
    90deg,
    transparent 4%,
    rgba(173, 121, 28, 0.018) 25%,
    rgba(215, 165, 63, 0.075) 42%,
    rgba(245, 203, 112, 0.17) 50%,
    rgba(207, 151, 47, 0.06) 59%,
    transparent 96%
  );
  filter: blur(18px);
}

.editorial-beam::after {
  content: '';
  position: absolute;
  inset: 0 47.5%;
  background: rgba(255, 241, 197, 0.72);
  box-shadow: 0 0 9px rgba(255, 224, 151, 0.72), 0 0 24px rgba(215, 164, 65, 0.4);
  filter: blur(1.8px);
}

.editorial-beam-left { left: -8%; transform: rotate(-32deg); }
.editorial-beam-right { right: -8%; transform: rotate(32deg); }

.editorial-copy-inner {
  will-change: opacity, transform;
}

.editorial-copy-enter-active,
.editorial-copy-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.editorial-copy-enter-from { opacity: 0; transform: translateY(10px); }
.editorial-copy-leave-to { opacity: 0; transform: translateY(-10px); }

.editorial-scroll-hint {
  position: absolute;
  right: clamp(24px, 6vw, 80px);
  top: 50%;
  z-index: 7;
  display: none;
  align-items: center;
  gap: 12px;
  color: var(--color-muted);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.58rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  transform: translateY(-50%);
}

.editorial-scroll-hint i {
  display: block;
  width: 1px;
  height: 46px;
  background: linear-gradient(var(--color-gold-400), transparent);
  animation: eco-drop 2.2s ease-in-out infinite;
}

@keyframes eco-drop {
  0%, 100% { opacity: 0.2; transform: scaleY(0.6); }
  50% { opacity: 1; transform: scaleY(1); }
}

/* 641px: a régua de posição do contador some do canto fixo do mobile e
   passa a acompanhar a margem proporcional, junto com tablet e desktop. */
@media (min-width: 641px) {
  .editorial-count { right: clamp(24px, 6vw, 80px); bottom: clamp(26px, 6vw, 70px); }
}

/* 761px: a cena ganha o layout de desktop — texto lateral fixo, carrossel
   maior à direita e a régua "scroll para explorar" volta a aparecer. */
@media (min-width: 761px) {
  .editorial-sticky { min-height: 480px; }
  .editorial-copy { left: clamp(24px, 5vw, 80px); right: auto; top: 50%; width: 30%; max-width: 420px; transform: translateY(-50%); }
  .editorial-copy h2 { max-width: none; font-size: clamp(2.5rem, 4.8vw, 5.2rem); margin: 14px 0 18px; }
  .editorial-copy-inner > p:not(.label-caps) { max-width: 29ch; font-size: clamp(1rem, 1.8vw, 1.25rem); }
  .editorial-progress { margin-top: 38px; }
  .editorial-carousel { left: 38%; right: 5%; top: 16%; bottom: 16%; }
  .card-desktop { width: min(90%, 64svh, 760px); }
  .card-notebook { width: min(100%, 96svh, 850px); }
  .card-tablet { width: min(57%, 33svh, 420px); }
  .card-smartphone { width: min(40%, 25svh, 310px); }
  .editorial-scroll-hint { display: flex; }
}

@media (prefers-reduced-motion: reduce) {
  .editorial-scroll-hint i { animation: none; }
  .editorial-copy-enter-active,
  .editorial-copy-leave-active { transition: none; }
  .editorial-light-show { display: none; }

  .editorial-sticky {
    height: auto;
    min-height: 100svh;
    padding: 110px 24px 60px;
    display: flex;
    flex-direction: column;
  }
  .editorial-copy {
    position: relative;
    inset: auto;
    transform: none;
    width: 100%;
    max-width: 580px;
    order: -1;
    margin-bottom: 32px;
  }
  .editorial-visuals,
  .editorial-stage,
  .editorial-carousel {
    position: static;
  }
  .editorial-carousel-track {
    position: relative;
    inset: auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    gap: 24px;
  }
  .editorial-carousel-card {
    position: relative;
    inset: auto;
    opacity: 1;
    visibility: visible;
    transform: none;
    width: 100%;
    max-width: 380px;
    justify-self: center;
    will-change: auto;
  }
  .card-tablet, .card-smartphone { max-width: 160px; }
  .editorial-progress, .editorial-count, .editorial-scroll-hint { display: none; }
}
</style>
