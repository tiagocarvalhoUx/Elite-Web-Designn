<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PROJECT_ASPECT, type PortfolioProject } from '@/data/portfolio'
import { loadRemoteProjects, projectsLoaded, remoteProjects } from '@/data/publicProjects'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SiteContainer from '@/components/ui/SiteContainer.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import ProjectLightbox from '@/components/ui/ProjectLightbox.vue'

/** O portfólio vem inteiro do painel; nada é fixado no código. */
const selected = ref<PortfolioProject | null>(null)

onMounted(() => {
  void loadRemoteProjects()
})
</script>

<template>
  <section id="projetos" class="section-y border-b border-gold-500/25 bg-ink-900">
    <SiteContainer>
      <SectionHeading id="projetos-titulo" title="Portfólio" :divider="false" data-reveal />

      <ul
        v-if="remoteProjects.length"
        class="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
      >
        <li
          v-for="(project, index) in remoteProjects"
          :key="project.id"
          data-reveal
          :style="{
            '--reveal-delay': `${(index % 3) * 90}ms`,
            '--trace-delay': `${index * -1.1}s`,
            '--trace-duration': `${6.5 + (index % 3) * 0.6}s`,
          }"
        >
          <ProjectCard :project="project" @open="selected = project" />
        </li>
      </ul>

      <!--
        Enquanto a resposta não chega, molduras vazias seguram o espaço: sem
        elas a seção colapsa e empurra o resto da página quando os cards entram.
      -->
      <ul
        v-else-if="!projectsLoaded"
        class="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        aria-hidden="true"
      >
        <li v-for="n in 3" :key="n">
          <div
            class="w-full animate-pulse border border-gold-500/20 bg-ink-800/60"
            :style="{ aspectRatio: PROJECT_ASPECT }"
          />
        </li>
      </ul>

      <p v-else class="mt-14 text-center text-sm text-muted lg:mt-16">
        Novos projetos serão publicados em breve.
      </p>
    </SiteContainer>

    <ProjectLightbox :project="selected" @close="selected = null" />
  </section>
</template>
