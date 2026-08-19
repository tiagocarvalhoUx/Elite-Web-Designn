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
    <div class="hero__beam" aria-hidden="true" />
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

/* Raio de luz que nasce no canto superior esquerdo, como na arte original. */
.hero__beam {
  position: absolute;
  top: -30%;
  left: -10%;
  width: 44%;
  height: 130%;
  transform: rotate(16deg);
  /* Elipse alongada: dissolve nas quatro bordas, sem deixar o retângulo aparecer. */
  background: radial-gradient(
    42% 34% at 50% 26%,
    rgba(243, 219, 166, 0.34) 0%,
    rgba(214, 172, 82, 0.12) 45%,
    rgba(201, 155, 59, 0) 76%
  );
  filter: blur(30px);
  pointer-events: none;
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
