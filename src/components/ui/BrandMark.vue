<script setup lang="ts">
import logo from '@/assets/brand/logo-wd.webp'
import logo3x from '@/assets/brand/logo-wd@3x.webp'

withDefaults(defineProps<{ height?: number; eager?: boolean }>(), { height: 38, eager: false })
</script>

<template>
  <img
    :src="logo"
    :srcset="`${logo} 1x, ${logo3x} 3x`"
    :width="Math.round((height * 85) / 57)"
    :height="height"
    :style="{ height: `${height}px`, width: 'auto' }"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : undefined"
    decoding="async"
    alt="Elite Web Designer"
  />
</template>
