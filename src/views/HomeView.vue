<script setup lang="ts">
import HeroSection from '@/components/sections/HeroSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import PortfolioSection from '@/components/sections/PortfolioSection.vue'
import BrandStatementSection from '@/components/sections/BrandStatementSection.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import ShowreelSection from '@/components/sections/ShowreelSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <!-- Ordem pensada para conversão: promessa → serviços → prova → autoridade → contato. -->
  <HeroSection />
  <ServicesSection />
  <PortfolioSection />
  <BrandStatementSection />
  <StatsSection />
  <!-- O filme fecha o argumento e desemboca direto no formulário. -->
  <ShowreelSection />
  <ContactSection />
</template>
