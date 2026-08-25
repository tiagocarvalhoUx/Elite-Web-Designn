<script setup lang="ts">
import { ref } from 'vue'
import { primaryNav } from '@/data/navigation'
import { useStickyHeader } from '@/composables/useStickyHeader'
import BaseButton from '@/components/ui/BaseButton.vue'
import BrandMark from '@/components/ui/BrandMark.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import MobileMenu from './MobileMenu.vue'

defineProps<{ activeId: string }>()

const isScrolled = useStickyHeader()
const menuOpen = ref(false)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-luxe"
    :class="
      isScrolled
        ? 'border-gold-500/35 bg-ink-950/85 backdrop-blur-xl'
        : 'border-gold-500/25 bg-transparent'
    "
  >
    <div class="mx-auto flex h-17 max-w-(--shell) items-center justify-between gap-6 px-(--gutter) lg:h-20">
      <a
        href="#inicio"
        class="shrink-0 transition-opacity duration-300 hover:opacity-80"
        aria-label="Elite Web Designer — ir para o início"
      >
        <BrandMark :height="38" eager />
      </a>

      <nav class="hidden lg:block" aria-label="Principal">
        <ul class="flex items-center gap-9">
          <li v-for="item in primaryNav" :key="item.id">
            <a
              :href="item.href"
              :aria-current="activeId === item.id ? 'true' : undefined"
              class="label-caps relative inline-flex h-11 items-center transition-colors duration-300 ease-luxe after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-center after:scale-x-0 after:bg-gold-400 after:transition-transform after:duration-300 after:ease-luxe hover:after:scale-x-100"
              :class="
                activeId === item.id
                  ? 'text-gold-300 after:scale-x-100'
                  : 'text-sand/85 hover:text-gold-200'
              "
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="hidden lg:block">
        <BaseButton
          href="#contato"
          variant="outline"
          pixel-event="CliqueOrcamento"
          pixel-label="Pedir orçamento (header)"
        >
          Pedir orçamento
        </BaseButton>
      </div>

      <button
        type="button"
        class="-mr-2 inline-flex size-11 items-center justify-center text-gold-300 transition-colors duration-200 hover:text-gold-200 lg:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        @click="menuOpen = true"
      >
        <AppIcon name="menu" :size="22" />
        <span class="sr-only">Abrir menu</span>
      </button>
    </div>

    <MobileMenu
      :open="menuOpen"
      :items="primaryNav"
      :active-id="activeId"
      @close="menuOpen = false"
    />
  </header>
</template>
