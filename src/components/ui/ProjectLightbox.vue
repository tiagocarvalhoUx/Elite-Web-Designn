<script setup lang="ts">
import { computed, ref } from 'vue'
import { PROJECT_ASPECT, type PortfolioProject } from '@/data/portfolio'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import AppIcon from './AppIcon.vue'

const props = defineProps<{ project: PortfolioProject | null }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLElement | null>(null)
const isOpen = computed(() => props.project !== null)

useFocusTrap(dialog, isOpen)
useScrollLock(isOpen)

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-luxe"
    leave-active-class="transition-opacity duration-200 ease-luxe"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="project"
      ref="dialog"
      class="project-showcase fixed inset-0 z-60 overflow-y-auto bg-ink-950/96 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      :aria-label="`Projeto ${project.title}`"
      @keydown="onKeydown"
    >
      <div class="pointer-events-none fixed inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-ink-950 via-ink-950/75 to-transparent" />
      <button
        type="button"
        class="fixed top-4 right-4 z-20 inline-flex size-11 items-center justify-center border border-gold-500/50 bg-ink-950/80 text-gold-300 shadow-luxe backdrop-blur-md transition-colors duration-200 hover:border-gold-300 hover:bg-gold-400/10 sm:top-7 sm:right-7"
        @click="emit('close')"
      >
        <AppIcon name="close" :size="20" />
        <span class="sr-only">Fechar projeto</span>
      </button>

      <main class="mx-auto w-full max-w-[1440px] px-5 pt-24 pb-20 sm:px-10 sm:pt-28 lg:px-16 lg:pt-32">
        <header class="max-w-3xl">
          <p class="label-caps text-gold-400">{{ project.category }} · {{ project.year }}</p>
          <h2 class="mt-5 font-display text-[clamp(3rem,8vw,7rem)] leading-[.86] tracking-[-.03em] text-ivory">
            {{ project.title }}
          </h2>
          <p class="mt-7 max-w-2xl text-base leading-8 text-sand sm:text-lg">{{ project.description }}</p>
        </header>

        <div class="mt-14 h-px bg-gradient-to-r from-gold-400/80 via-gold-500/30 to-transparent sm:mt-20" />

        <figure class="relative mt-12 overflow-hidden border border-gold-500/40 bg-ink-800 p-1 shadow-luxe sm:mt-16 sm:p-2 lg:p-3">
          <div class="pointer-events-none absolute inset-0 z-10 border border-gold-200/10" />
          <img
            :src="project.full"
            :alt="project.alt"
            :style="{ aspectRatio: PROJECT_ASPECT }"
            decoding="async"
            class="w-full object-cover"
          />
        </figure>

        <footer class="mt-12 flex items-center justify-between gap-8 border-t border-gold-500/25 pt-8 sm:mt-16">
          <div>
            <p class="label-caps text-muted">Projeto selecionado</p>
            <p class="mt-2 font-display text-2xl text-ivory">{{ project.title }}</p>
          </div>
          <button
            type="button"
            class="label-caps shrink-0 border-b border-gold-400/70 pb-1 text-gold-300 transition-colors hover:text-gold-200"
            @click="emit('close')"
          >
            Voltar ao portfólio
          </button>
        </footer>
      </main>
    </div>
  </Transition>
</template>
