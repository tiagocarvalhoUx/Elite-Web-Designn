<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { projects, type PortfolioProject } from '@/data/portfolio'
import { loadRemoteProjects, remoteProjects } from '@/data/publicProjects'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SiteContainer from '@/components/ui/SiteContainer.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import ProjectLightbox from '@/components/ui/ProjectLightbox.vue'

const selected = ref<PortfolioProject | null>(null)

/**
 * Projetos cadastrados no painel entram na frente dos estáticos. Se o Supabase
 * estiver fora do ar ou não configurado, a lista estática garante que a seção
 * nunca apareça vazia.
 */
const visibleProjects = computed(() => [...remoteProjects.value, ...projects])

onMounted(() => {
  void loadRemoteProjects()
})
</script>

<template>
  <section id="projetos" class="section-y border-b border-gold-500/25 bg-ink-900">
    <SiteContainer>
      <SectionHeading id="projetos-titulo" title="Portfólio" :divider="false" data-reveal />

      <ul class="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        <li
          v-for="(project, index) in visibleProjects"
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
    </SiteContainer>

    <ProjectLightbox :project="selected" @close="selected = null" />
  </section>
</template>
