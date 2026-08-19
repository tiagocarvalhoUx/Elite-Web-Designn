<script setup lang="ts">
import SiteContainer from '@/components/ui/SiteContainer.vue'
</script>

<template>
  <section class="statement relative border-b border-gold-500/25 bg-ink-950">
    <SiteContainer as="div" class="relative z-10 py-16 lg:py-24">
      <blockquote data-reveal class="text-center">
        <p
          class="text-gold-gradient mx-auto max-w-[26ch] font-display lg:max-w-none text-[clamp(1.7rem,4.4vw,3.1rem)] leading-[1.15] italic"
        >
          “Seu site é o reflexo da sua marca.”
        </p>
      </blockquote>
    </SiteContainer>
  </section>
</template>

<style scoped>
.statement {
  background-image: url('@/assets/decorative/marble-1200.webp');
  background-position: center 30%;
  background-size: cover;
}

.statement::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(5, 5, 4, 0.9), rgba(5, 5, 4, 0.82));
}
</style>
