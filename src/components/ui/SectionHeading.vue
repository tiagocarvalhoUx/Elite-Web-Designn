<script setup lang="ts">
import GoldDivider from './GoldDivider.vue'

withDefaults(defineProps<{ title: string; id?: string; as?: 'h2' | 'h3'; divider?: boolean }>(), {
  as: 'h2',
  divider: true,
})
</script>

<template>
  <header class="flex flex-col items-center gap-5 text-center">
    <component
      :is="as"
      :id="id"
      class="text-gold-gradient display-caps text-[clamp(2rem,4.2vw,3.25rem)]"
    >
      {{ title }}
    </component>
    <GoldDivider v-if="divider" :width="280" />
  </header>
</template>
