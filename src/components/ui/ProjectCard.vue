<script setup lang="ts">
import { PROJECT_ASPECT, type PortfolioProject } from '@/data/portfolio'

defineProps<{ project: PortfolioProject }>()
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <article class="group flex flex-col">
    <button
      type="button"
      class="gold-trace relative block w-full cursor-pointer overflow-hidden border border-gold-500/50 bg-ink-800 transition-[border-color,box-shadow] duration-300 ease-luxe hover:border-gold-400/70 hover:shadow-lift focus-visible:border-gold-400"
      :style="{ aspectRatio: PROJECT_ASPECT }"
      :aria-label="`Ver apresentação do projeto ${project.title}`"
      aria-haspopup="dialog"
      @click="emit('open')"
    >
      <img
        :src="project.src"
        :srcset="project.srcset"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        :alt="project.alt"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition-transform duration-500 ease-luxe group-hover:scale-[1.03]"
      />
      <span
        class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(5,5,4,.55)_100%)] opacity-0 transition-opacity duration-500 ease-luxe group-hover:opacity-100"
        aria-hidden="true"
      />
    </button>

    <div class="mt-5 text-center">
      <h3 class="font-display text-[1.05rem] tracking-[0.16em] text-ivory uppercase">
        {{ project.title }}
      </h3>
      <p class="label-caps mt-2 text-gold-400">{{ project.category }}</p>
    </div>
  </article>
</template>
