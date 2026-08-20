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
      <span class="hero__grain" />
      <span class="hero__wash" />
      <span class="hero__scatter" />
      <span class="hero__beam" />
    </div>
    <div class="hero__vignette" aria-hidden="true" />

    <SiteContainer as="div" class="relative z-10 pt-28 pb-0 lg:pt-36">
      <div class="flex flex-col items-center text-center">
        <p data-reveal class="label-caps text-gold-400">{{ site.locationShort }}</p>

        <h1
          data-reveal
          style="--reveal-delay: 90ms"
          class="display-caps mt-5 text-[clamp(2.15rem,8vw,5.6rem)] leading-[.92] text-ivory"
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
          class="mt-6"
          :width="320"
        />

        <p
          data-reveal
          style="--reveal-delay: 200ms"
          class="mt-5 max-w-[38ch] font-display text-[clamp(1.1rem,2.1vw,1.45rem)] leading-relaxed text-balance text-sand"
        >
          Sites, lojas e aplicações desenvolvidos sob medida para marcas exigentes.
        </p>

        <div
          data-reveal
          style="--reveal-delay: 260ms"
          class="mt-7 flex flex-col items-center gap-5 sm:flex-row sm:gap-14"
        >
          <BaseButton href="#contato" variant="solid" size="lg">Solicitar proposta</BaseButton>
          <BaseButton href="#projetos" variant="underline">Ver portfólio</BaseButton>
        </div>
      </div>

      <figure
        data-reveal
        style="--reveal-delay: 340ms"
        class="hero__stage relative mx-auto mt-7 w-full max-w-[720px] lg:mt-4"
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

  /* Reaproveita a textura leve já baixada, em vez de puxar a de 1200 px. */
  .hero__grain {
    background-image: url('@/assets/decorative/marble-640.webp');
  }
}

/*
 * Conjunto de luz do hero, medido em 00_REFERENCE/homepage-complete.png:
 * um único feixe a 27° da vertical, nascendo abaixo do header. O giro é
 * negativo porque, em CSS, o positivo joga a base para a esquerda.
 */
.hero__light {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/*
 * Os "detalhes em volta" da referência são os veios do mármore acendendo onde
 * a luz bate — não um segundo raio. Uma segunda cópia da textura, em `screen`
 * e mascarada ao redor do feixe, reacende o grão que o overlay escuro apagou.
 */
.hero__grain {
  position: absolute;
  inset: 0;
  background-image: url('@/assets/decorative/marble-1200.webp');
  background-position: left top;
  background-size: cover;
  mix-blend-mode: screen;
  opacity: 0.42;
  mask-image: radial-gradient(
    44% 40% at 15% 19%,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.45) 44%,
    transparent 76%
  );
}

/* Banho ambiente difuso, para o raio não flutuar sobre um fundo morto. */
.hero__wash {
  position: absolute;
  top: -18%;
  left: -14%;
  width: 62%;
  height: 78%;
  background: radial-gradient(
    50% 50% at 34% 22%,
    rgba(226, 189, 105, 0.11) 0%,
    rgba(170, 126, 49, 0.05) 42%,
    transparent 74%
  );
  filter: blur(46px);
}

/*
 * Dispersão: a luz não corta o ar limpa, ela espalha. Mesmo eixo do feixe,
 * muito mais larga e desfocada, alcançando quase o notebook como na arte.
 */
.hero__scatter {
  position: absolute;
  top: 0;
  left: -17%;
  width: 42%;
  height: 100%;
  transform: rotate(-34deg);
  transform-origin: top center;
  background: linear-gradient(
    90deg,
    transparent 6%,
    rgba(170, 126, 49, 0.08) 30%,
    rgba(226, 189, 105, 0.16) 50%,
    rgba(170, 126, 49, 0.08) 70%,
    transparent 94%
  );
  mask-image: linear-gradient(
    180deg,
    transparent 3%,
    #000 17%,
    rgba(0, 0, 0, 0.72) 44%,
    rgba(0, 0, 0, 0.34) 66%,
    transparent 88%
  );
  filter: blur(58px);
}

/*
 * Um único feixe, medido na referência: 27° da vertical, núcleo entrando a
 * ~6,6% da largura logo abaixo do header e alcançando quase o mockup.
 */
.hero__beam {
  position: absolute;
  top: 0;
  left: -4.8%;
  width: 17%;
  height: 100%;
  transform: rotate(-34deg);
  transform-origin: top center;
  /*
   * Sem `filter` aqui de propósito: um desfoque no pai também desfoca os
   * pseudo-elementos, e o núcleo fino desapareceria dentro do halo. Cada
   * camada carrega o seu.
   */
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
    rgba(170, 126, 49, 0.14) 34%,
    rgba(226, 189, 105, 0.27) 50%,
    rgba(170, 126, 49, 0.14) 66%,
    transparent 82%
  );
  /*
   * Totalmente apagado sob o header — na referência o cabeçalho é preto sólido
   * e o raio só nasce abaixo da régua dourada.
   */
  mask-image: linear-gradient(
    180deg,
    transparent 0%,
    transparent 6.5%,
    #000 12%,
    rgba(0, 0, 0, 0.72) 32%,
    rgba(0, 0, 0, 0.42) 52%,
    rgba(0, 0, 0, 0.2) 68%,
    transparent 84%
  );
  filter: blur(26px);
}

/*
 * Núcleo quente por cima: fino e quase sem desfoque — é ele que faz o raio.
 * A segunda máscara quebra o brilho em trechos desiguais: na arte original a
 * luz pega o grão do mármore e nunca é uma linha uniforme.
 */
.hero__beam::after {
  background: linear-gradient(
    90deg,
    transparent 44%,
    rgba(214, 172, 82, 0.32) 47%,
    rgba(255, 239, 199, 0.72) 50%,
    rgba(214, 172, 82, 0.32) 53%,
    transparent 56%
  );
  mask-image:
    linear-gradient(
      180deg,
      transparent 0%,
      transparent 6.5%,
      #000 12%,
      rgba(0, 0, 0, 0.84) 32%,
      rgba(0, 0, 0, 0.46) 50%,
      rgba(0, 0, 0, 0.2) 66%,
      transparent 80%
    ),
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.72) 0%,
      #000 9%,
      rgba(0, 0, 0, 0.58) 15%,
      #000 23%,
      rgba(0, 0, 0, 0.8) 30%,
      #000 38%,
      rgba(0, 0, 0, 0.5) 46%,
      #000 55%,
      rgba(0, 0, 0, 0.62) 64%,
      #000 72%
    );
  mask-composite: intersect;
  filter: blur(4px);
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
