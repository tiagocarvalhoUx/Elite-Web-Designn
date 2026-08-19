<script setup lang="ts">
import { ref, toRef } from 'vue'
import type { NavItem } from '@/data/navigation'
import { site } from '@/data/site'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import GoldDivider from '@/components/ui/GoldDivider.vue'

const props = defineProps<{ open: boolean; items: readonly NavItem[]; activeId: string }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const open = toRef(props, 'open')

useFocusTrap(panel, open)
useScrollLock(open)

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-250 ease-luxe"
    leave-active-class="transition-opacity duration-200 ease-luxe"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      id="mobile-menu"
      ref="panel"
      class="fixed inset-0 z-50 flex flex-col bg-ink-950/97 backdrop-blur-xl lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      @keydown="onKeydown"
    >
      <div class="flex h-18 items-center justify-end px-(--gutter)">
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center text-gold-300 transition-colors duration-200 hover:text-gold-200"
          @click="emit('close')"
        >
          <AppIcon name="close" :size="22" />
          <span class="sr-only">Fechar menu</span>
        </button>
      </div>

      <nav class="flex flex-1 flex-col justify-center gap-2 px-(--gutter) pb-16" aria-label="Principal">
        <a
          v-for="item in items"
          :key="item.id"
          :href="item.href"
          :aria-current="activeId === item.id ? 'true' : undefined"
          class="display-caps border-b border-gold-500/15 py-5 text-[2rem] leading-none transition-colors duration-200"
          :class="activeId === item.id ? 'text-gold-300' : 'text-ivory hover:text-gold-200'"
          @click="emit('close')"
        >
          {{ item.label }}
        </a>

        <div class="mt-10 flex flex-col items-start gap-6">
          <GoldDivider :width="200" />
          <BaseButton href="#contato" variant="solid" size="lg" @click="emit('close')">
            Pedir orçamento
          </BaseButton>
          <a
            :href="site.whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-3 text-sm text-sand transition-colors duration-200 hover:text-gold-200"
          >
            <AppIcon name="whatsapp" :size="18" />
            {{ site.phoneDisplay }}
          </a>
        </div>
      </nav>
    </div>
  </Transition>
</template>
