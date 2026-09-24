<script setup lang="ts">
import { site } from '@/data/site'
import AppIcon from '@/components/ui/AppIcon.vue'
</script>

<template>
  <a
    :href="site.whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="wa-fab"
    :aria-label="`Falar no WhatsApp — ${site.phoneDisplay}`"
  >
    <AppIcon name="whatsapp" :size="27" />
  </a>
</template>

<style scoped>
.wa-fab {
  position: fixed;
  right: calc(clamp(1rem, 3vw, 2.25rem) + env(safe-area-inset-right));
  bottom: calc(clamp(1rem, 3vw, 2.25rem) + env(safe-area-inset-bottom));
  z-index: 45;

  display: grid;
  width: 3.5rem;
  height: 3.5rem;
  place-items: center;
  border: 1px solid var(--color-gold-400);
  border-radius: 50%;
  background: var(--color-ink-900);
  color: var(--color-gold-300);
  box-shadow: var(--shadow-luxe);
  transition:
    transform 0.3s var(--ease-luxe),
    background-color 0.3s var(--ease-luxe),
    border-color 0.3s var(--ease-luxe);
}

.wa-fab:hover {
  transform: translateY(-2px);
  border-color: var(--color-gold-300);
  background: var(--color-ink-800);
}

.wa-fab:active {
  transform: translateY(0);
}
</style>
