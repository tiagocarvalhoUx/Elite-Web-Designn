<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  label: string
  error?: string
  hint?: string
}>()

const errorId = computed(() => `${props.id}-error`)
const hintId = computed(() => `${props.id}-hint`)

/** Passado ao controle pelo slot: garante o vínculo aria correto sem repetição. */
const describedBy = computed(() => {
  const ids = [props.hint ? hintId.value : null, props.error ? errorId.value : null].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- No toque o rótulo precisa de mais peso: é a única âncora do campo. -->
    <label
      :for="id"
      class="label-caps text-[0.8rem] font-semibold tracking-[0.2em] text-gold-300 lg:text-eyebrow lg:font-medium lg:tracking-luxe lg:text-gold-400/90"
    >
      {{ label }}
    </label>

    <slot :id="id" :described-by="describedBy" :invalid="Boolean(error)" />

    <p v-if="hint" :id="hintId" class="text-xs text-muted">{{ hint }}</p>
    <p
      v-if="error"
      :id="errorId"
      class="text-xs font-medium text-[#e0a04a]"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
