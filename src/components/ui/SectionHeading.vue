<script setup lang="ts">
import GoldDivider from './GoldDivider.vue'

withDefaults(defineProps<{ title: string; id?: string; as?: 'h2' | 'h3'; divider?: boolean }>(), {
  as: 'h2',
  divider: true,
})
</script>

<template>
  <header class="flex flex-col items-center gap-5 text-center">
    <!--
      No mobile o título ganha corpo e entreletra: na tela estreita ele é o
      único elemento capaz de abrir a seção, sem a folga que o desktop tem.
    -->
    <component
      :is="as"
      :id="id"
      class="text-gold-gradient display-caps text-[clamp(2.35rem,7vw,3.25rem)] tracking-[0.09em] lg:tracking-[0.02em]"
    >
      {{ title }}
    </component>
    <GoldDivider v-if="divider" :width="280" :mobile-width="180" />
  </header>
</template>
