<script setup lang="ts">
import { PROJECT_ASPECT, type PortfolioProject } from '@/data/portfolio'

defineProps<{ project: PortfolioProject }>()
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <article class="group flex flex-col">
    <button
      type="button"
      class="project-card-frame gold-trace relative block min-h-11 w-full cursor-pointer overflow-hidden rounded-2xl border border-gold-300/80 bg-ink-800 shadow-[0_18px_48px_-24px_rgba(214,172,82,.72)] transition-[transform,border-color,box-shadow] duration-300 ease-luxe active:scale-[.99] sm:rounded-[20px] sm:border-gold-500/50 sm:shadow-none hover:border-gold-300/90 hover:shadow-lift focus-visible:border-gold-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
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
        class="size-full object-cover object-center transition-transform duration-500 ease-luxe group-hover:scale-[1.03]"
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

<style scoped>
.project-card-frame {
  /* Mobile-first: o contorno permanece perceptível sem depender de hover. */
  box-shadow:
    inset 0 0 0 1px rgb(255 238 184 / 0.12),
    0 18px 48px -24px rgb(214 172 82 / 0.72);
}

@media (min-width: 640px) {
  .project-card-frame {
    box-shadow: inset 0 0 0 1px rgb(255 238 184 / 0.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-frame,
  .project-card-frame img {
    transition: none;
  }
}
</style>
