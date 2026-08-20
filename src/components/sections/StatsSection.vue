<script setup lang="ts">
import { stats } from '@/data/stats'
import SiteContainer from '@/components/ui/SiteContainer.vue'
</script>

<template>
  <section id="autoridade" class="border-b border-gold-500/25 bg-ink-900" aria-labelledby="autoridade-titulo">
    <h2 id="autoridade-titulo" class="sr-only">A agência em números</h2>

    <SiteContainer as="div" class="py-12 lg:py-16">
      <dl class="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:gap-y-0">
        <div
          v-for="(stat, index) in stats"
          :key="stat.id"
          data-reveal
          :style="{ '--reveal-delay': `${index * 80}ms` }"
          class="flex flex-col-reverse items-center px-3 text-center"
          :class="[
            index % 2 === 1 ? 'border-l border-gold-500/20' : '',
            index > 0 ? 'lg:border-l lg:border-gold-500/20' : 'lg:border-l-0',
          ]"
        >
          <!-- Ordem visual (número acima do rótulo) sem quebrar a ordem dt → dd. -->
          <dt class="label-caps mt-3 max-w-[18ch] text-muted lg:max-w-none lg:whitespace-nowrap">{{ stat.label }}</dt>
          <dd data-count class="font-display text-[clamp(2.2rem,5vw,3.25rem)] leading-none text-gold-300">
            {{ stat.value }}
          </dd>
        </div>
      </dl>
    </SiteContainer>
  </section>
</template>
