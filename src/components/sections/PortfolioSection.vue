<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PROJECT_ASPECT, type PortfolioProject } from '@/data/portfolio'
import { loadRemoteProjects, projectsLoaded, remoteProjects } from '@/data/publicProjects'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SiteContainer from '@/components/ui/SiteContainer.vue'
import ProjectLightbox from '@/components/ui/ProjectLightbox.vue'
import PortfolioStack from './PortfolioStack.vue'
import { track } from '@/lib/metaPixel'

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
})
</script>

<template>
  <section id="projetos" class="border-b border-gold-500/25 bg-ink-900">
    <!-- O catálogo inteiro passa pela vitrine — um projeto por vez, preso ao scroll. -->
    <PortfolioStack v-if="remoteProjects.length" :projects="remoteProjects" @open="openProject" />

    <!-- Só aparece enquanto os dados não chegam, ou se o painel ainda não tem nenhum projeto ativo. -->
    <SiteContainer v-else class="section-y">
      <SectionHeading id="projetos-titulo" title="Portfólio" :divider="false" data-reveal />

      <div v-if="!projectsLoaded" class="mt-14 lg:mt-16" aria-hidden="true">
        <div class="mx-auto w-full max-w-3xl animate-pulse border border-gold-500/20 bg-ink-800/60" :style="{ aspectRatio: PROJECT_ASPECT }" />
      </div>

      <p v-else class="mt-14 text-center text-sm text-muted lg:mt-16">
        Novos projetos serão publicados em breve.
      </p>
    </SiteContainer>

    <ProjectLightbox :project="selected" @close="selected = null" />
  </section>
</template>
