<script setup lang="ts">
import { computed } from 'vue'
import type { IconName } from '@/types/icon'

const props = withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 20 })

/** Glifos de marca são preenchidos; ícones de interface usam traço de 1.5. */
const FILLED = new Set<IconName>(['whatsapp', 'facebook'])
const isFilled = computed(() => FILLED.has(props.name))
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="isFilled ? 'currentColor' : 'none'"
    :stroke="isFilled ? 'none' : 'currentColor'"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path
      v-if="name === 'whatsapp'"
      d="M12.04 2C6.6 2 2.17 6.42 2.17 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.9 9.9 0 0 0 4.7 1.19h.01c5.44 0 9.87-4.42 9.87-9.86C21.92 6.42 17.49 2 12.04 2Zm5.75 14.1c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11a15.4 15.4 0 0 1-1.66-.61c-2.93-1.27-4.84-4.22-4.99-4.42-.14-.2-1.19-1.58-1.19-3.02 0-1.43.75-2.14 1.02-2.43.27-.29.58-.36.78-.36h.56c.18 0 .42-.7.66.5.24.58.81 2.01.88 2.15.07.15.12.32.02.51-.1.2-.15.32-.29.49l-.44.51c-.15.14-.3.3-.13.59.17.29.75 1.24 1.61 2.01 1.11.99 2.05 1.29 2.34 1.44.29.14.46.12.63-.7.17-.2.73-.85.92-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.14.48.22.55.34.07.12.07.7-.16 1.37Z"
    />
    <!-- Quadrado cheio com o "f" vazado, no mesmo peso visual do WhatsApp. -->
    <path
      v-else-if="name === 'facebook'"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm5.72 19h2.79v-7h2.3l.36-2.71h-2.66V9.57c0-.78.22-1.31 1.34-1.31h1.43V5.84a19.4 19.4 0 0 0-2.09-.11c-2.06 0-3.47 1.26-3.47 3.57v1.99H8.4V14h2.32v7Z"
    />
    <template v-else-if="name === 'instagram'">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </template>
    <template v-else-if="name === 'pin'">
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </template>
    <path v-else-if="name === 'menu'" d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    <path v-else-if="name === 'close'" d="m6 6 12 12M18 6 6 18" />
    <path v-else-if="name === 'arrow'" d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5" />
    <path v-else-if="name === 'check'" d="m4.5 12.5 5 5 10-11" />
  </svg>
</template>
