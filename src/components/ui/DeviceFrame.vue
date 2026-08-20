<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Moldura de dispositivo com pré-visualização fiel.
 *
 * O ponto central: o site embutido é renderizado num viewport REAL (1440px no
 * desktop, 390px no celular) e reduzido por `transform: scale()`. Sem isso, um
 * iframe de 500px de largura faz o site exibir o layout mobile dentro da tela
 * do desktop — que é justamente o oposto do que a vitrine deveria mostrar.
 *
 * A escala é derivada da largura real da moldura, então continua correta em
 * qualquer breakpoint. Ponteiro e rolagem seguem funcionando dentro do iframe.
 */

const props = defineProps<{
  kind: 'desktop' | 'phone'
  title: string
  /** URL do site a exibir dentro da moldura. */
  src: string
}>()

/** Viewports de referência: MacBook/iMac e iPhone 14. */
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  phone: { width: 390, height: 844 },
} as const

/**
 * Folga para a barra de rolagem do site embutido. O iframe fica mais largo que
 * o viewport pretendido e a sobra é cortada pela moldura, então a barra some da
 * vitrine sem estreitar a área de conteúdo que o site enxerga.
 */
const SCROLLBAR = 17

const viewport = computed(() => VIEWPORTS[props.kind])
const aspect = computed(() => `${viewport.value.width} / ${viewport.value.height}`)

const screen = ref<HTMLElement | null>(null)
const scale = ref(0)
const loaded = ref(false)

let observer: ResizeObserver | undefined

onMounted(() => {
  if (!screen.value) return
  observer = new ResizeObserver(([entry]) => {
    if (entry) scale.value = entry.contentRect.width / viewport.value.width
  })
  observer.observe(screen.value)
})

onBeforeUnmount(() => observer?.disconnect())

const frameStyle = computed(() => ({
  width: `${viewport.value.width + SCROLLBAR}px`,
  height: `${viewport.value.height}px`,
  transform: `scale(${scale.value})`,
}))
</script>

<template>
  <figure class="device" :class="`device--${kind}`">
    <div class="device__body">
      <span v-if="kind === 'desktop'" class="device__camera" aria-hidden="true" />
      <span v-else class="device__island" aria-hidden="true" />

      <div ref="screen" class="device__screen" :style="{ aspectRatio: aspect }">
        <iframe
          :src="src"
          :title="title"
          :style="frameStyle"
          class="device__viewport"
          loading="lazy"
          referrerpolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          @load="loaded = true"
        />
        <div v-if="!loaded" class="device__skeleton" role="status">
          <span class="sr-only">Carregando a pré-visualização de {{ title }}…</span>
        </div>
      </div>
    </div>

    <template v-if="kind === 'desktop'">
      <div class="device__chin"><span aria-hidden="true" /></div>
      <div class="device__neck" aria-hidden="true" />
      <div class="device__foot" aria-hidden="true" />
    </template>
  </figure>
</template>

<style scoped>
.device {
  --bezel: clamp(0.5rem, 0.9vw, 0.95rem);
  width: 100%;
  margin: 0;
}

/* ------------------------------------------------------------- corpo ----- */

.device__body {
  position: relative;
  padding: var(--bezel);
  background: linear-gradient(160deg, #26262a 0%, #101013 42%, #17171b 100%);
}

.device--desktop .device__body {
  border-radius: clamp(0.55rem, 1vw, 1.1rem);
  padding-bottom: calc(var(--bezel) * 1.15);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.07),
    0 34px 70px rgb(0 0 0 / 0.62);
}

.device--phone .device__body {
  border-radius: clamp(2rem, 3.4vw, 3.1rem);
  padding: clamp(0.35rem, 0.7vw, 0.6rem);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.09),
    0 26px 56px rgb(0 0 0 / 0.68);
}

/* ------------------------------------------------------------- tela ------ */

.device__screen {
  position: relative;
  overflow: hidden;
  background: #0a0a0c;
}

.device--desktop .device__screen {
  border-radius: clamp(0.15rem, 0.3vw, 0.3rem);
}

.device--phone .device__screen {
  border-radius: clamp(1.6rem, 2.8vw, 2.6rem);
}

/* O iframe vive em tamanho real e é reduzido a partir do canto superior. */
.device__viewport {
  position: absolute;
  top: 0;
  left: 0;
  border: 0;
  transform-origin: top left;
  background: #fff;
}

.device__skeleton {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(100deg, #0d0d10 30%, #17171c 50%, #0d0d10 70%) 0 0 / 220% 100%;
  animation: device-shimmer 1.6s linear infinite;
}

@keyframes device-shimmer {
  to {
    background-position: -220% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .device__skeleton {
    animation: none;
  }
}

/* --------------------------------------------------------- detalhes ------ */

.device__camera {
  position: absolute;
  top: calc(var(--bezel) / 2.4);
  left: 50%;
  width: 0.3rem;
  height: 0.3rem;
  transform: translateX(-50%);
  border-radius: 50%;
  background: #3a3a40;
}

.device__island {
  position: absolute;
  top: clamp(0.7rem, 1.3vw, 1.1rem);
  left: 50%;
  z-index: 2;
  width: 32%;
  height: clamp(1rem, 1.7vw, 1.5rem);
  transform: translateX(-50%);
  border-radius: 999px;
  background: #08080a;
}

/* ------------------------------------------------------------ base ------- */

.device__chin {
  position: relative;
  height: clamp(2.6rem, 4.6vw, 4.4rem);
  border-radius: 0 0 clamp(0.3rem, 0.6vw, 0.6rem) clamp(0.3rem, 0.6vw, 0.6rem);
  background: linear-gradient(180deg, #e9e9e8 0%, #cfcfce 62%, #b9b9b8 100%);
}

.device__chin span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(0.5rem, 0.9vw, 0.8rem);
  height: clamp(0.5rem, 0.9vw, 0.8rem);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #3d3d40;
}

.device__neck {
  width: clamp(4.5rem, 11%, 8rem);
  height: clamp(2.2rem, 4vw, 4rem);
  margin-inline: auto;
  background: linear-gradient(90deg, #a9a9a8, #e6e6e5 46%, #9d9d9c);
  clip-path: polygon(18% 0, 82% 0, 100% 100%, 0 100%);
}

.device__foot {
  width: clamp(11rem, 30%, 20rem);
  height: clamp(0.5rem, 0.9vw, 0.85rem);
  margin-inline: auto;
  border-radius: 0 0 999px 999px;
  background: linear-gradient(90deg, #9a9a99, #e2e2e1 42%, #8f8f8e);
  filter: drop-shadow(0 14px 16px rgb(0 0 0 / 0.55));
}
</style>
