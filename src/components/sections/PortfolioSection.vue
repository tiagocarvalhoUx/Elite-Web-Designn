<script setup lang="ts">
import { computed, ref } from 'vue'
import { projects, type PortfolioProject } from '@/data/portfolio'
import { adminProjects } from '@/data/adminProjects'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SiteContainer from '@/components/ui/SiteContainer.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import ProjectLightbox from '@/components/ui/ProjectLightbox.vue'

const selected = ref<PortfolioProject | null>(null)
const visibleProjects = computed(() => [
  ...adminProjects.value.filter((project) => project.active),
  ...projects,
])
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
          :style="{ '--reveal-delay': `${(index % 3) * 90}ms` }"
        >
          <ProjectCard :project="project" @open="selected = project" />
        </li>
      </ul>
    </SiteContainer>

    <ProjectLightbox :project="selected" @close="selected = null" />
  </section>
</template>
