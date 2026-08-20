<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { primaryNav } from '@/data/navigation'
import { useActiveSection } from '@/composables/useActiveSection'
import { useMotion } from '@/composables/useMotion'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import WhatsAppFab from '@/components/layout/WhatsAppFab.vue'
import HomeView from '@/views/HomeView.vue'

// O painel (e o SDK do Supabase junto) só é baixado ao acessar /admin.
const AdminView = defineAsyncComponent(() => import('@/views/AdminView.vue'))

const activeId = useActiveSection(primaryNav.map((item) => item.id))
const isAdmin = window.location.pathname.replace(/\/$/, '') === '/admin'

useMotion()
</script>

<template>
  <AdminView v-if="isAdmin" />
  <template v-else>
  <a
    href="#conteudo"
    class="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-70 focus-visible:inline-flex focus-visible:min-h-11 focus-visible:items-center focus-visible:border focus-visible:border-gold-400 focus-visible:bg-ink-950 focus-visible:px-5 focus-visible:text-sm focus-visible:text-gold-200"
  >
    Ir para o conteúdo
  </a>

  <AppHeader :active-id="activeId" />

  <main id="conteudo">
    <HomeView />
  </main>

  <AppFooter />
  <WhatsAppFab />
  </template>
</template>
