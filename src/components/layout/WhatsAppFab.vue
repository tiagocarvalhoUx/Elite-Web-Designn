<script setup lang="ts">
import { site } from '@/data/site'
import { useStickyHeader } from '@/composables/useStickyHeader'
import AppIcon from '@/components/ui/AppIcon.vue'

/**
 * Atalho flutuante para o WhatsApp.
 *
 * Só aparece depois que o visitante sai do topo: no hero o CTA principal já é
 * "Solicitar proposta", e dois botões disputando a mesma intenção enfraquecem
 * os dois. Reaproveita o mesmo observador de scroll do header.
 */
const isScrolled = useStickyHeader(420)
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-luxe"
    leave-active-class="transition-all duration-300 ease-luxe"
    enter-from-class="translate-y-4 scale-90 opacity-0"
    leave-to-class="translate-y-4 scale-90 opacity-0"
  >
    <a
      v-show="isScrolled"
      :href="site.whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="wa-fab"
      :aria-label="`Falar no WhatsApp — ${site.phoneDisplay}`"
    >
      <span class="wa-fab__halo" aria-hidden="true" />
      <AppIcon name="whatsapp" :size="27" class="relative z-10" />
      <span class="wa-fab__label">Falar agora</span>
    </a>
  </Transition>
</template>

<style scoped>
.wa-fab {
  position: fixed;
  right: clamp(1rem, 3vw, 2.25rem);
  bottom: clamp(1rem, 3vw, 2.25rem);
  z-index: 45;

  display: inline-flex;
  align-items: center;
  gap: 0;
  min-width: 3.5rem;
  min-height: 3.5rem;
  padding: 0 1.05rem;
  border-radius: 999px;

  /* Ouro polido: a mesma família de tons do resto do layout. */
  background: linear-gradient(135deg, #8a6420 0%, #c99b3b 38%, #f0d69a 52%, #ab7f31 78%, #7f5a1d 100%);
  color: #120d04;

  box-shadow:
    inset 0 1px 0 rgb(255 246 224 / 0.55),
    inset 0 -1px 0 rgb(90 62 16 / 0.5),
    0 14px 34px rgb(0 0 0 / 0.55),
    0 0 26px rgb(201 155 59 / 0.28);

  transition:
    transform 0.35s var(--ease-luxe),
    box-shadow 0.35s var(--ease-luxe),
    filter 0.35s var(--ease-luxe);
}

.wa-fab:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
  box-shadow:
    inset 0 1px 0 rgb(255 246 224 / 0.6),
    inset 0 -1px 0 rgb(90 62 16 / 0.5),
    0 18px 42px rgb(0 0 0 / 0.6),
    0 0 40px rgb(201 155 59 / 0.42);
}

.wa-fab:active {
  transform: translateY(0);
}

/* Anel que respira devagar — presença sem piscar na cara do visitante. */
.wa-fab__halo {
  position: absolute;
  inset: -3px;
  border-radius: 999px;
  border: 1px solid rgb(230 198 125 / 0.45);
  animation: wa-breathe 3.4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes wa-breathe {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.08);
  }
}

/* O rótulo abre no hover em telas com ponteiro; no toque fica só o ícone. */
.wa-fab__label {
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0;
  transition:
    max-width 0.45s var(--ease-luxe),
    opacity 0.35s var(--ease-luxe),
    margin-left 0.45s var(--ease-luxe);
}

@media (hover: hover) and (pointer: fine) {
  .wa-fab:hover .wa-fab__label,
  .wa-fab:focus-visible .wa-fab__label {
    max-width: 9rem;
    margin-left: 0.6rem;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wa-fab__halo {
    animation: none;
    opacity: 0.45;
  }
  .wa-fab,
  .wa-fab__label {
    transition: none;
  }
}
</style>
