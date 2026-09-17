<script setup lang="ts">
import { site } from '@/data/site'
import BaseButton from '@/components/ui/BaseButton.vue'
import GoldDivider from '@/components/ui/GoldDivider.vue'
import SiteContainer from '@/components/ui/SiteContainer.vue'

</script>

<template>
  <section id="inicio" class="hero relative flex items-center overflow-hidden border-b border-gold-500/25">
    <!-- A cena entra pronta, com luz própria — sem raio sintético desenhado por cima. -->
    <div class="hero__scrim" aria-hidden="true" />
    <div class="hero__vignette" aria-hidden="true" />

    <SiteContainer as="div" class="relative z-10 py-28 lg:py-24">
      <div class="flex flex-col items-center text-center">
        <p class="hero-in label-caps text-gold-400">{{ site.locationShort }}</p>

        <h1
          style="--reveal-delay: 90ms"
          class="hero-in display-caps mt-5 text-[clamp(2.15rem,8vw,5.6rem)] leading-[.92] text-ivory"
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
          style="--reveal-delay: 160ms"
          class="hero-in mt-6"
          :width="320"
        />

        <p
          style="--reveal-delay: 200ms"
          class="hero-in mt-5 max-w-[38ch] font-display text-[clamp(1.1rem,2.1vw,1.45rem)] leading-relaxed text-balance text-sand"
        >
          Sites, lojas e aplicações desenvolvidos sob medida para marcas exigentes.
        </p>

        <div
          style="--reveal-delay: 260ms"
          class="hero-in mt-7 flex flex-col items-center gap-5 sm:flex-row sm:gap-14"
        >
          <BaseButton
            :href="site.whatsappUrl"
            variant="solid"
            size="lg"
            external
          >
            Falar no WhatsApp
          </BaseButton>
          <BaseButton href="#projetos" variant="underline">Ver portfólio</BaseButton>
        </div>
      </div>
    </SiteContainer>

    <p class="sr-only">
      Escritório da {{ site.name }}: mesa de mármore negro, estação de trabalho e vista noturna da cidade.
    </p>
  </section>
</template>

<style scoped>
/*
 * A primeira dobra nunca pode depender do chunk do GSAP para aparecer: o
 * resto do site usa `[data-reveal]` (oculto até o JS de scroll assumir), mas
 * aqui a entrada roda só em CSS, disparada pela própria pintura da página.
 * Sem isso, numa rede lenta o título ficava invisível por até ~3s enquanto o
 * bundle de animação baixava — o pior tipo de lentidão, na primeira coisa que
 * o visitante vê.
 */
@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.hero-in {
  animation: hero-in 0.7s var(--ease-luxe) both;
  animation-delay: var(--reveal-delay, 0ms);
}

/*
 * A cena do escritório é a arte inteira — mesa de mármore, estação de
 * trabalho e a cidade à noite pela janela. Ela substitui o mockup de
 * dispositivo: aqui não há um device a montar, a atmosfera já é o produto.
 */
.hero {
  min-height: 100svh;
  background-color: var(--color-ink-950);
  background-image: url('@/assets/hero/office-desk-mobile.webp');
  background-position: 66% center;
  background-size: cover;
  background-repeat: no-repeat;
}

@media (min-width: 641px) {
  .hero {
    background-image: url('@/assets/hero/office-desk.webp');
    background-position: center 38%;
  }
}

/*
 * Véu escuro sobre a foto: sem ele o texto centralizado perde contraste
 * contra o monitor aceso e o brilho da cidade à direita. Mais denso nas
 * bordas verticais (header e rodapé da dobra), mais respirado no meio.
 */
.hero__scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5, 5, 4, 0.82) 0%, rgba(5, 5, 4, 0.48) 30%, rgba(5, 5, 4, 0.58) 68%, rgba(5, 5, 4, 0.92) 100%),
    linear-gradient(90deg, rgba(5, 5, 4, 0.55) 0%, rgba(5, 5, 4, 0.18) 42%, rgba(5, 5, 4, 0.4) 100%);
  pointer-events: none;
}

.hero__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(62% 55% at 50% 40%, transparent 35%, rgba(4, 4, 3, 0.55) 100%);
  pointer-events: none;
}
</style>
