<script setup lang="ts">
import { services } from '@/data/services'
import SiteContainer from '@/components/ui/SiteContainer.vue'
</script>

<template>
  <section
    id="servicos"
    class="border-b border-gold-500/25 bg-ink-900"
    aria-labelledby="servicos-titulo"
  >
    <!-- A arte não mostra um título aqui: os pilares falam por si. -->
    <h2 id="servicos-titulo" class="sr-only">Serviços</h2>

    <SiteContainer as="div" class="py-14 lg:py-16">
      <ul class="grid gap-10 md:grid-cols-3 md:gap-0">
        <li
          v-for="(service, index) in services"
          :key="service.id"
          data-reveal
          class="flex flex-col items-center px-2 text-center md:px-8 md:py-9"
          :class="[
            // `max-md:` mantém o separador só no mobile: usar `md:pt-0` aqui
            // cancelaria o padding vertical de quem tem o separador e
            // desalinharia a primeira coluna.
            index > 0 ? 'max-md:border-t max-md:border-gold-500/20 max-md:pt-10' : '',
            index % 3 !== 0 ? 'md:border-l md:border-gold-500/20' : '',
            index >= 3 ? 'md:border-t md:border-gold-500/20' : '',
          ]"
        >
          <p class="font-display text-3xl leading-none text-gold-400" aria-hidden="true">
            {{ service.roman }}
          </p>
          <h3
            class="mt-4 font-display text-[1.15rem] tracking-[0.18em] text-ivory uppercase lg:text-[1.25rem]"
          >
            {{ service.title }}
          </h3>
          <p class="mt-4 max-w-[36ch] text-sm leading-relaxed text-muted">
            {{ service.description }}
          </p>
        </li>
      </ul>
    </SiteContainer>
  </section>
</template>
