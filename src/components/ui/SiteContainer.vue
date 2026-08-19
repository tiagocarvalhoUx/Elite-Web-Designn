<script setup lang="ts">
/** Caixa de conteúdo única do site — mantém navbar, seções e footer no mesmo eixo. */
withDefaults(defineProps<{ as?: string }>(), { as: 'div' })
</script>

<template>
  <component :is="as" class="mx-auto w-full max-w-(--shell) px-(--gutter)">
    <slot />
  </component>
</template>
