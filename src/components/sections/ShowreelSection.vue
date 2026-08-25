<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { site } from '@/data/site'
import mp4 from '@/assets/video/showreel.mp4'
import webm from '@/assets/video/showreel.webm'
import poster from '@/assets/video/showreel-poster.webp'
import SiteContainer from '@/components/ui/SiteContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { trackCustom } from '@/lib/metaPixel'

/**
 * Filme da marca.
 *
 * O vídeo tem áudio e conta uma história do começo ao fim — não é textura de
 * fundo. Por isso nada toca sozinho: `preload="none"` mantém o arquivo de 5 MB
 * fora da rede até alguém pedir, e a reprodução começa por decisão do visitante,
 * com som, como foi editado.
 */

const video = ref<HTMLVideoElement | null>(null)
const started = ref(false)
/**
 * O atributo `poster` baixa a imagem junto com a página, mesmo com
 * `preload="none"` e mesmo estando esta seção bem abaixo da dobra. Só a
 * definimos quando o filme se aproxima da tela.
 */
const posterSrc = ref('')
let observer: IntersectionObserver | undefined
let posterWatcher: IntersectionObserver | undefined

async function play(): Promise<void> {
  const el = video.value
  if (!el) return
  started.value = true
  trackCustom('AssistiuFilme', { content_name: 'Filme da marca' })
  try {
    await el.play()
  } catch {
    // Se o navegador recusar a reprodução com som, os controles nativos ficam
    // visíveis e o visitante decide o que fazer.
    started.value = true
  }
}

onMounted(() => {
  if (!('IntersectionObserver' in window) || !video.value) {
    posterSrc.value = poster
    return
  }

  posterWatcher = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      posterSrc.value = poster
      posterWatcher?.disconnect()
    },
    { rootMargin: '600px' },
  )
  posterWatcher.observe(video.value)

  // Sair da tela com o filme tocando desperdiça banda e bateria.
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry && !entry.isIntersecting && !video.value?.paused) video.value?.pause()
    },
    { threshold: 0.25 },
  )
  observer.observe(video.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  posterWatcher?.disconnect()
})
</script>

<template>
  <section id="filme" class="section-y border-b border-gold-500/25 bg-ink-900">
    <SiteContainer>
      <div
        class="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16"
      >
        <figure data-reveal="zoom-in" class="film mx-auto w-full max-w-[340px] lg:mx-0 lg:max-w-[380px]">
          <div class="film__frame gold-trace" style="--trace-duration: 7.5s">
            <video
              ref="video"
              class="film__video"
              :poster="posterSrc || undefined"
              preload="none"
              playsinline
              :controls="started"
              width="720"
              height="1280"
            >
              <source :src="webm" type="video/webm" />
              <source :src="mp4" type="video/mp4" />
              Seu navegador não reproduz vídeo.
              <a :href="mp4" download>Baixe o filme</a>.
            </video>

            <button v-if="!started" type="button" class="film__play" @click="play">
              <span class="film__play-icon" aria-hidden="true" />
              <span class="sr-only">Reproduzir o filme da Elite Web Designer, com áudio</span>
            </button>
          </div>
        </figure>

        <div class="text-center lg:text-left">
          <p data-reveal="fade-down" class="label-caps text-gold-400">Filme da marca</p>

          <h2
            data-reveal="fade-up"
            style="--reveal-delay: 120ms"
            class="display-caps mt-4 text-[clamp(2.1rem,5vw,3.1rem)] text-ivory"
          >
            A Elite em 27 segundos
          </h2>

          <p data-reveal="fade-up" class="mx-auto mt-6 max-w-[46ch] leading-relaxed text-muted lg:mx-0">
            Um recorte do que entregamos e do padrão que aplicamos em cada projeto — do
            primeiro traço à publicação.
          </p>

          <p class="mt-3 text-sm text-muted">O filme tem áudio.</p>

          <div data-reveal="fade-up" class="mt-9 flex justify-center lg:justify-start">
            <BaseButton :href="site.whatsappUrl" variant="outline" size="lg" external>
              Falar no WhatsApp
            </BaseButton>
          </div>
        </div>
      </div>
    </SiteContainer>
  </section>
</template>

<style scoped>
.film__frame {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(214 176 96 / 0.55);
  background: #050504;
  box-shadow:
    inset 0 0 0 1px rgb(240 214 150 / 0.12),
    0 30px 64px rgb(0 0 0 / 0.6),
    0 0 40px rgb(201 155 59 / 0.1);
}

.film__video {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 720 / 1280;
  object-fit: cover;
  background: #050504;
}

.film__play {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
  border: 0;
  background: radial-gradient(60% 50% at 50% 50%, rgb(5 5 4 / 0.35), rgb(5 5 4 / 0.62));
  transition: background 0.35s var(--ease-luxe);
}

.film__play:hover,
.film__play:focus-visible {
  background: radial-gradient(60% 50% at 50% 50%, rgb(5 5 4 / 0.2), rgb(5 5 4 / 0.5));
}

.film__play-icon {
  /* Deslocado para baixo do centro: no centro exato ele cobre o título do pôster. */
  margin-top: 22%;
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  border: 1px solid rgb(214 176 96 / 0.7);
  border-radius: 50%;
  background: rgb(7 7 6 / 0.55);
  backdrop-filter: blur(2px);
  box-shadow: 0 0 30px rgb(201 155 59 / 0.22);
  transition:
    transform 0.35s var(--ease-luxe),
    box-shadow 0.35s var(--ease-luxe);
}

/* Triângulo desenhado em borda: um glifo a menos para carregar. */
.film__play-icon::after {
  content: '';
  margin-left: 0.28rem;
  border-style: solid;
  border-width: 0.62rem 0 0.62rem 1.05rem;
  border-color: transparent transparent transparent var(--color-gold-300);
}

.film__play:hover .film__play-icon,
.film__play:focus-visible .film__play-icon {
  transform: scale(1.06);
  box-shadow: 0 0 44px rgb(201 155 59 / 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .film__play,
  .film__play-icon {
    transition: none;
  }
  .film__play:hover .film__play-icon {
    transform: none;
  }
}
</style>
