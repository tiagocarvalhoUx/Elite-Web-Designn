<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { PROJECT_ASPECT, type PortfolioProject } from '@/data/portfolio'
import { loadRemoteProjects, projectsLoaded, remoteProjects } from '@/data/publicProjects'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SiteContainer from '@/components/ui/SiteContainer.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import ProjectLightbox from '@/components/ui/ProjectLightbox.vue'
import PortfolioStack from './PortfolioStack.vue'
import { track } from '@/lib/metaPixel'

/**
 * A pilha de páginas presa ao scroll é uma peça de vitrine — pedir pra rolar
 * 21 telas em sequência, uma por vez, cansa muito mais no polegar do que no
 * mouse. No mobile o portfólio volta a ser a grade: todos os projetos visíveis
 * de uma vez, tocáveis, sem sequestrar o scroll. Desktop mantém a pilha.
 *
 * A troca é por componente, não por CSS: escondida com `display:none` a
 * pilha continuaria montada, o GSAP mediria um container de largura zero e o
 * ScrollTrigger reservaria um espaço de scroll vazio no lugar errado.
 */
const DESKTOP_QUERY = '(min-width: 761px)'
const isDesktop = ref(window.matchMedia(DESKTOP_QUERY).matches)
let media: MediaQueryList | undefined
function onDesktopChange(event: MediaQueryListEvent): void {
  isDesktop.value = event.matches
}

/** O portfólio vem inteiro do painel; nada é fixado no código. */
const selected = ref<PortfolioProject | null>(null)

function openProject(project: PortfolioProject): void {
  selected.value = project
  track('ViewContent', {
    content_type: 'product',
    content_ids: project.id,
    content_name: project.title,
    content_category: project.category,
  })
}

onMounted(() => {
  void loadRemoteProjects()
  media = window.matchMedia(DESKTOP_QUERY)
  media.addEventListener('change', onDesktopChange)
})

onBeforeUnmount(() => media?.removeEventListener('change', onDesktopChange))
</script>

<template>
  <section id="projetos" class="border-b border-gold-500/25 bg-ink-900">
    <!-- Desktop: o catálogo inteiro passa pela vitrine, um projeto por vez, preso ao scroll. -->
    <PortfolioStack v-if="isDesktop && remoteProjects.length" :projects="remoteProjects" @open="openProject" />

    <!-- Mobile (grade) — e também o estado de carregamento/vazio, para qualquer largura. -->
    <SiteContainer v-else class="section-y">
      <SectionHeading id="projetos-titulo" title="Portfólio" :divider="false" data-reveal />

      <ul
        v-if="!isDesktop && remoteProjects.length"
        class="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
      >
        <li
          v-for="(project, index) in remoteProjects"
          :key="project.id"
          data-reveal="zoom-in-up"
          :style="{
            '--reveal-delay': `${(index % 3) * 90}ms`,
            '--trace-delay': `${index * -1.1}s`,
            '--trace-duration': `${6.5 + (index % 3) * 0.6}s`,
          }"
        >
          <ProjectCard :project="project" @open="openProject(project)" />
        </li>
      </ul>

      <!--
        Enquanto a resposta não chega, molduras vazias seguram o espaço: sem
        elas a seção colapsa e empurra o resto da página quando os cards entram.
      -->
      <div v-else-if="!projectsLoaded" class="mt-14 lg:mt-16" aria-hidden="true">
        <div class="mx-auto w-full max-w-3xl animate-pulse border border-gold-500/20 bg-ink-800/60" :style="{ aspectRatio: PROJECT_ASPECT }" />
      </div>

      <p v-else class="mt-14 text-center text-sm text-muted lg:mt-16">
        Novos projetos serão publicados em breve.
      </p>
    </SiteContainer>

    <ProjectLightbox :project="selected" @close="selected = null" />
  </section>
</template>
