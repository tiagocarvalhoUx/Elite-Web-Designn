<script setup lang="ts">
import { computed } from 'vue'

/**
 * Régua dourada com losango central — reconstrução vetorial do divisor da arte
 * original (02_UI/dividers), nítida em qualquer densidade de tela.
 *
 * A largura é entregue por variável CSS em vez de `max-width` inline: assim o
 * media query consegue encurtar o traço no mobile, coisa que estilo inline não
 * permite.
 */
const props = withDefaults(defineProps<{ width?: number; mobileWidth?: number }>(), { width: 320 })

const style = computed(() => ({
  '--divider-desktop': `${props.width}px`,
  '--divider-mobile': `${props.mobileWidth ?? props.width}px`,
}))
</script>

<template>
  <svg
    class="divider h-4 w-full text-gold-400"
    :style="style"
    viewBox="0 0 640 32"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="gold-rule" x1="0" y1="0" x2="640" y2="0" gradientUnits="userSpaceOnUse">
        <stop stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.5" stop-color="currentColor" stop-opacity="0.9" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path d="M0 16H302M338 16H640" stroke="url(#gold-rule)" stroke-width="1.25" />
    <path d="M320 9.5 326.5 16 320 22.5 313.5 16Z" stroke="currentColor" stroke-width="1.25" />
  </svg>
</template>

<style scoped>
.divider {
  max-width: var(--divider-mobile);
}

@media (min-width: 1024px) {
  .divider {
    max-width: var(--divider-desktop);
  }
}
</style>
