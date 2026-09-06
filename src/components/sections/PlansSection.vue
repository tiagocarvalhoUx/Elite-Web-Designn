<script setup lang="ts">
import { plans } from '@/data/plans'
import { choosePlan } from '@/composables/usePlanIntent'
import SiteContainer from '@/components/ui/SiteContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
</script>

<template>
  <!--
    Fundo um tom mais escuro que as seções vizinhas: é o momento da decisão, e
    o degrau de contraste separa a tabela de preços do resto da página sem
    precisar de nenhuma cor fora da paleta.
  -->
  <section
    id="planos"
    class="section-y border-b border-gold-500/25 bg-ink-950"
    aria-labelledby="planos-titulo"
  >
    <SiteContainer>
      <header class="flex flex-col items-center gap-4 text-center">
        <p data-reveal="fade-down" class="label-caps text-gold-400">Planos</p>

        <h2
          id="planos-titulo"
          data-reveal
          style="--reveal-delay: 100ms"
          class="text-gold-gradient display-caps text-[clamp(2.1rem,6vw,3.25rem)] tracking-[0.06em] lg:tracking-[0.02em]"
        >
          Investimento transparente
        </h2>

        <p data-reveal style="--reveal-delay: 180ms" class="max-w-[52ch] leading-relaxed text-muted">
          Sem letras miúdas. Sem surpresas. Escolha o plano ideal e comece hoje mesmo.
        </p>
      </header>

      <!--
        `items-stretch` (padrão do grid) iguala a altura das três colunas: com
        listas de tamanhos diferentes, os botões ficariam em alturas diferentes
        e a comparação entre planos perderia a linha de base.
      -->
      <ul class="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-3 lg:gap-7">
        <li
          v-for="(plan, index) in plans"
          :key="plan.id"
          :style="{
            '--reveal-delay': `${index * 110}ms`,
            '--trace-delay': `${index * -1.4}s`,
            '--trace-duration': `${7 + index * 0.5}s`,
          }"
          class="flex"
          :class="plan.featured ? 'lg:-translate-y-5' : ''"
        >
          <!--
            O `data-reveal` fica no <article>, não no <li>: o GSAP escreve
            `transform` inline no elemento revelado, e isso apagaria o
            deslocamento que levanta o plano em destaque no desktop.
          -->
          <article
            data-reveal
            class="gold-trace relative flex w-full flex-col px-7 pt-11 pb-8 transition-[border-color,box-shadow] duration-500 ease-luxe lg:px-8 lg:pt-12"
            :class="
              plan.featured
                ? 'border border-gold-400/55 bg-[linear-gradient(180deg,rgba(35,26,12,.9)_0%,rgba(7,7,6,.92)_58%)] shadow-luxe'
                : 'surface-luxury bg-[linear-gradient(180deg,rgba(17,16,14,.8)_0%,rgba(5,5,4,.8)_100%)] hover:border-gold-400/45 hover:shadow-lift'
            "
          >
            <!--
              O selo monta em cima da borda; z-10 o mantém acima do filete de
              luz, que corre pela moldura em z-2.
            -->
            <p
              v-if="plan.badge"
              class="label-caps absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-gold-300/60 bg-[linear-gradient(135deg,#a97827_0%,#c99b3b_42%,#e0bd6c_58%,#a97827_100%)] px-4 py-1.5 text-[0.62rem] whitespace-nowrap text-ink-950"
            >
              {{ plan.badge }}
            </p>

            <h3
              class="text-center font-display text-[1.3rem] tracking-[0.18em] uppercase"
              :class="plan.featured ? 'text-gold-200' : 'text-ivory'"
            >
              {{ plan.name }}
            </h3>
            <p class="mt-2.5 text-center text-sm leading-relaxed text-muted">{{ plan.tagline }}</p>

            <p class="mt-7 flex items-baseline justify-center gap-2">
              <span class="font-sans text-[0.85rem] font-medium text-gold-500">R$</span>
              <span
                class="text-gold-gradient font-display text-[clamp(2.9rem,8vw,3.5rem)] leading-none"
              >
                {{ plan.price }}
              </span>
            </p>
            <p class="label-caps mt-3 text-center text-[0.6rem] text-muted/80">Valor do projeto</p>

            <span
              class="mt-8 block h-px bg-[linear-gradient(90deg,transparent,var(--rule),transparent)]"
              aria-hidden="true"
            />

            <ul class="mt-8 flex flex-col gap-3.5">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3">
                <AppIcon
                  name="check"
                  :size="16"
                  class="mt-1 shrink-0"
                  :class="plan.featured ? 'text-gold-300' : 'text-gold-500'"
                />
                <span class="text-[0.95rem] leading-relaxed text-sand">{{ feature }}</span>
              </li>
            </ul>

            <!--
              `mt-auto` cola o botão no rodapé do card: como as listas têm
              tamanhos diferentes, é o que mantém os três CTAs na mesma linha.
            -->
            <div class="mt-auto pt-10">
              <BaseButton
                href="#contato"
                class="w-full"
                size="lg"
                :variant="plan.featured ? 'solid' : 'outline'"
                pixel-event="CliqueOrcamento"
                :pixel-label="`Contratar plano ${plan.name}`"
                @click="choosePlan(plan)"
              >
                Contratar
              </BaseButton>
            </div>
          </article>
        </li>
      </ul>

      <!--
        Saída para quem não cabe em nenhuma das três caixas. Sem isso, a única
        resposta possível a "meu projeto é diferente" seria fechar a página.
      -->
      <p data-reveal class="mt-12 text-center text-sm text-muted">
        Precisa de algo fora dessas caixas?
        <a
          href="#contato"
          class="ml-1 border-b border-gold-500/70 pb-0.5 text-gold-300 transition-colors duration-300 ease-luxe hover:border-gold-300 hover:text-gold-200"
        >
          Montamos um escopo sob medida
        </a>
      </p>
    </SiteContainer>
  </section>
</template>
