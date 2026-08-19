<script setup lang="ts">
import { services } from '@/data/services'
import SiteContainer from '@/components/ui/SiteContainer.vue'
</script>

<template>
  <section id="servicos" class="border-b border-gold-500/25 bg-ink-900" aria-labelledby="servicos-titulo">
    <h2 id="servicos-titulo" class="sr-only">Serviços</h2>

    <SiteContainer as="div" class="py-14 lg:py-16">
      <ul class="grid gap-10 md:grid-cols-3 md:gap-0">
        <li
          v-for="(service, index) in services"
          :key="service.id"
          data-reveal
          :style="{ '--reveal-delay': `${index * 90}ms` }"
          class="flex flex-col items-center px-2 text-center md:px-8"
          :class="
            index > 0
              ? 'border-t border-gold-500/20 pt-10 md:border-t-0 md:border-l md:pt-0'
              : ''
          "
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
