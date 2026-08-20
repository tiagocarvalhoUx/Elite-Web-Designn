<script setup lang="ts">
import { services } from '@/data/services'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SiteContainer from '@/components/ui/SiteContainer.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
</script>

<template>
  <section id="servicos" class="section-y border-b border-gold-500/25 bg-ink-900">
    <SiteContainer>
      <SectionHeading id="servicos-titulo" title="Serviços" data-reveal />

      <ul class="mt-14 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-7">
        <li
          v-for="service in services"
          :key="service.id"
          data-reveal
          class="service-card"
        >
          <div class="service-card__head">
            <span class="service-card__icon" aria-hidden="true">
              <AppIcon :name="service.icon" :size="22" />
            </span>
            <span class="service-card__roman" aria-hidden="true">{{ service.roman }}</span>
          </div>

          <h3 class="mt-6 font-display text-[1.35rem] tracking-[0.06em] text-ivory">
            {{ service.title }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-muted">{{ service.description }}</p>

          <ul class="mt-6 flex flex-col gap-2.5 border-t border-gold-500/15 pt-5">
            <li
              v-for="feature in service.features"
              :key="feature"
              class="flex items-center gap-3 text-sm text-sand/85"
            >
              <AppIcon name="check" :size="14" class="shrink-0 text-gold-400" />
              {{ feature }}
            </li>
          </ul>
        </li>
      </ul>
    </SiteContainer>
  </section>
</template>

<style scoped>
.service-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: clamp(1.5rem, 2.6vw, 2rem);
  border: 1px solid rgb(201 155 59 / 0.22);
  background: linear-gradient(165deg, rgb(21 18 13 / 0.7) 0%, rgb(7 7 6 / 0.75) 100%);
  transition:
    border-color 0.4s var(--ease-luxe),
    transform 0.4s var(--ease-luxe),
    box-shadow 0.4s var(--ease-luxe);
}

.service-card:hover {
  transform: translateY(-4px);
  border-color: rgb(201 155 59 / 0.55);
  box-shadow:
    0 22px 48px rgb(0 0 0 / 0.5),
    0 0 34px rgb(201 155 59 / 0.09);
}

.service-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

/* Ladrilho do ícone: o mesmo ouro do layout, sem a paleta multicolor. */
.service-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid rgb(201 155 59 / 0.35);
  background: linear-gradient(150deg, rgb(201 155 59 / 0.16), rgb(127 90 29 / 0.06));
  color: var(--color-gold-300);
}

.service-card__roman {
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1;
  color: rgb(201 155 59 / 0.5);
}

@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
  }
  .service-card:hover {
    transform: none;
  }
}
</style>
