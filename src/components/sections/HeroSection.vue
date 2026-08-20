<script setup lang="ts">
import { site } from '@/data/site'
import laptop from '@/assets/hero/laptop-mrv.webp'
import laptop2x from '@/assets/hero/laptop-mrv@2x.webp'
import BaseButton from '@/components/ui/BaseButton.vue'
import GoldDivider from '@/components/ui/GoldDivider.vue'
import SiteContainer from '@/components/ui/SiteContainer.vue'
</script>

<template>
  <section id="inicio" class="hero relative overflow-hidden border-b border-gold-500/25">
    <!-- Feixe de luz cinematográfico, sobreposto à textura de mármore. -->
    <div class="hero__light" aria-hidden="true">
      <span class="hero__wash" />
      <span class="hero__beam hero__beam--ghost" />
      <span class="hero__beam" />
    </div>
    <div class="hero__vignette" aria-hidden="true" />

    <SiteContainer as="div" class="relative z-10 pt-32 pb-0 lg:pt-40">
      <div class="flex flex-col items-center text-center">
        <p data-reveal class="label-caps text-gold-400">{{ site.locationShort }}</p>

        <h1
          data-reveal
          style="--reveal-delay: 90ms"
          class="display-caps mt-7 text-[clamp(2.15rem,9vw,6.5rem)] leading-[1.02] text-ivory"
        >
          <span class="block">Presença digital</span>
          <span class="block">
            de
            <em class="text-gold-gradient font-normal italic [font-variant-caps:normal]">
              excelência
            </em>
          </span>
        </h1>

        <GoldDivider
          data-reveal
          style="--reveal-delay: 160ms"
          class="mt-9"
          :width="320"
        />

        <p
          data-reveal
          style="--reveal-delay: 200ms"
          class="mt-8 max-w-[38ch] font-display text-[clamp(1.1rem,2.1vw,1.45rem)] leading-relaxed text-balance text-sand"
        >
          Sites, lojas e aplicações desenvolvidos sob medida para marcas exigentes.
        </p>

        <div
          data-reveal
          style="--reveal-delay: 260ms"
          class="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-8"
        >
          <BaseButton href="#contato" variant="solid" size="lg">Solicitar proposta</BaseButton>
          <BaseButton href="#projetos" variant="underline">Ver portfólio</BaseButton>
        </div>
      </div>

      <figure
        data-reveal
        style="--reveal-delay: 340ms"
        class="hero__stage relative mx-auto mt-14 w-full max-w-[720px] lg:mt-20"
      >
        <img
          :src="laptop"
          :srcset="`${laptop} 685w, ${laptop2x} 1370w`"
          sizes="(min-width: 768px) 720px, 100vw"
          width="685"
          height="345"
          alt="Notebook exibindo o site institucional desenvolvido para o Projeto MRV."
          fetchpriority="high"
          decoding="async"
          class="hero__device relative z-10 w-full"
        />
        <figcaption class="sr-only">
          Projeto MRV — site institucional desenvolvido pela {{ site.name }}.
        </figcaption>
      </figure>
    </SiteContainer>
  </section>
</template>

<style scoped>
/* A textura entra bem apagada: quem sustenta a leitura é o preto, não o mármore. */
.hero {
  background-color: var(--color-ink-950);
  background-image:
    linear-gradient(180deg, rgba(5, 5, 4, 0.86) 0%, rgba(5, 5, 4, 0.78) 42%, rgba(5, 5, 4, 0.97) 100%),
    url('@/assets/decorative/marble-1200.webp');
  background-position:
    center,
    left top;
  background-size:
    cover,
    cover;
  background-repeat: no-repeat;
}

@media (max-width: 640px) {
  .hero {
    background-image:
      linear-gradient(180deg, rgba(5, 5, 4, 0.86) 0%, rgba(5, 5, 4, 0.8) 42%, rgba(5, 5, 4, 0.97) 100%),
      url('@/assets/decorative/marble-640.webp');
  }
}

/*
 * Raio de luz diagonal.
 *
 * Duas camadas com desfoques diferentes: o elemento carrega o halo largo e
 * difuso, o ::before carrega o núcleo fino e quente. Um desfoque único no
 * mesmo elemento apagaria o núcleo junto com o halo — é isso que diferencia
 * um raio de um borrão.
 */
/*
 * Geometria medida na arte original (00_REFERENCE/homepage-complete.png):
 * o núcleo entra a ~7% da largura no topo do hero e chega a ~27% na metade
 * da altura — 33° em relação à vertical. O giro é negativo porque, em CSS,
 * o positivo joga a base para a esquerda.
 */
.hero__light {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/*
 * Banho ambiente: a luz não só atravessa a cena, ela acende o mármore do canto
 * superior esquerdo. Sem isso o raio fica flutuando sobre um fundo morto.
 */
.hero__wash {
  position: absolute;
  top: -18%;
  left: -14%;
  width: 62%;
  height: 78%;
  background: radial-gradient(
    50% 50% at 34% 22%,
    rgba(226, 189, 105, 0.13) 0%,
    rgba(170, 126, 49, 0.06) 42%,
    transparent 74%
  );
  filter: blur(46px);
}

.hero__beam {
  position: absolute;
  top: 0;
  left: -1.6%;
  width: 18%;
  height: 100%;
  transform: rotate(-33deg);
  transform-origin: top center;
  /*
   * Sem `filter` aqui de propósito: um desfoque no pai também desfoca os
   * pseudo-elementos, e o núcleo fino desapareceria dentro do halo. Cada
   * camada carrega o seu.
   */
}

/* Segundo raio, mais fraco e aberto — a referência tem esse eco à esquerda. */
.hero__beam--ghost {
  left: -8%;
  width: 26%;
  transform: rotate(-30deg);
  opacity: 0.5;
}

/* Halo largo e difuso. */
.hero__beam::before,
.hero__beam::after {
  content: '';
  position: absolute;
  inset: 0;
}

.hero__beam::before {
  background: linear-gradient(
    90deg,
    transparent 18%,
    rgba(170, 126, 49, 0.12) 36%,
    rgba(226, 189, 105, 0.24) 50%,
    rgba(170, 126, 49, 0.12) 64%,
    transparent 82%
  );
  /* Entra sob o header e morre antes da metade, como na referência. */
  mask-image: linear-gradient(
    180deg,
    transparent 0%,
    #000 9%,
    rgba(0, 0, 0, 0.78) 32%,
    rgba(0, 0, 0, 0.38) 52%,
    transparent 70%
  );
  filter: blur(22px);
}

/*
 * Núcleo quente por cima: fino e quase sem desfoque — é ele que faz o raio.
 * A segunda máscara quebra o brilho em trechos desiguais: na arte original a
 * luz pega o grão do mármore e nunca é uma linha uniforme.
 */
.hero__beam::after {
  background: linear-gradient(
    90deg,
    transparent 47.2%,
    rgba(214, 172, 82, 0.55) 48.9%,
    rgba(255, 246, 224, 0.95) 50%,
    rgba(214, 172, 82, 0.55) 51.1%,
    transparent 52.8%
  );
  mask-image:
    linear-gradient(
      180deg,
      transparent 0%,
      #000 10%,
      rgba(0, 0, 0, 0.8) 34%,
      rgba(0, 0, 0, 0.34) 52%,
      transparent 66%
    ),
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.72) 0%,
      #000 7%,
      rgba(0, 0, 0, 0.58) 14%,
      #000 22%,
      rgba(0, 0, 0, 0.8) 29%,
      #000 37%,
      rgba(0, 0, 0, 0.5) 45%,
      #000 54%,
      rgba(0, 0, 0, 0.68) 62%
    );
  mask-composite: intersect;
  filter: blur(1.8px);
}

.hero__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 75% at 50% 22%, transparent 38%, rgba(5, 5, 4, 0.82) 100%);
  pointer-events: none;
}

/*
 * O recorte do notebook traz o próprio fundo de mármore. A máscara dissolve as
 * bordas para que ele pouse na cena em vez de virar um retângulo colado.
 */
.hero__device {
  --fade: 9%;
  mask-image:
    linear-gradient(to right, transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%),
    linear-gradient(to bottom, transparent 0, #000 6%, #000 96%, transparent 100%);
  mask-composite: intersect;
}

/* Halo dourado sob o notebook — profundidade sem glow neon. */
.hero__stage::before {
  content: '';
  position: absolute;
  inset: auto 8% -6% 8%;
  height: 45%;
  background: radial-gradient(60% 100% at 50% 100%, rgba(201, 155, 59, 0.18), transparent 72%);
  filter: blur(28px);
  z-index: 0;
}
</style>
