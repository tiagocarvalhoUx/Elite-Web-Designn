<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PortfolioProject } from '@/data/portfolio'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import AppIcon from './AppIcon.vue'
import DeviceFrame from './DeviceFrame.vue'

const props = defineProps<{ project: PortfolioProject | null }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLElement | null>(null)
const isOpen = computed(() => props.project !== null)

useFocusTrap(dialog, isOpen)
useScrollLock(isOpen)

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-luxe"
    leave-active-class="transition-opacity duration-200 ease-luxe"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="project"
      ref="dialog"
      class="project-case fixed inset-0 z-60 overflow-y-auto bg-ink-950"
      role="dialog"
      aria-modal="true"
      :aria-label="`Projeto ${project.title}`"
      @keydown="onKeydown"
    >
      <button
        type="button"
        class="fixed top-4 right-4 z-30 inline-flex size-14 items-center justify-center rounded-full border border-gold-500/30 bg-ink-800/90 text-ivory backdrop-blur-md transition hover:border-gold-300 hover:text-gold-300 sm:top-7 sm:right-7"
        @click="emit('close')"
      >
        <AppIcon name="close" :size="24" />
        <span class="sr-only">Fechar projeto</span>
      </button>

      <main class="mx-auto w-full max-w-[1900px] px-5 pt-20 pb-14 sm:px-9 sm:pt-24 lg:px-14">
        <header class="max-w-[880px] pr-12">
          <p class="label-caps text-gold-300">{{ project.category }}</p>
          <h2 class="mt-3 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[.9] text-gold-gradient">
            {{ project.title }}
          </h2>
          <p class="mt-5 text-base leading-7 text-sand/80 sm:text-xl sm:leading-8">{{ project.description }}</p>
        </header>

        <div class="case-rule mt-8 sm:mt-9" />

        <section
          class="mockup-stage mt-14 sm:mt-20"
          aria-label="Demonstração responsiva e interativa do projeto"
        >
          <!-- Com link ao vivo: o site roda de verdade dentro das molduras. -->
          <div v-if="project.href" class="devices-grid">
            <div class="desktop-column">
              <DeviceFrame
                kind="desktop"
                :src="project.href"
                :title="`${project.title} — versão desktop`"
              />
              <p class="device-hint">
                Site real em 1440 px, reduzido para caber na tela. Role e clique dentro do monitor.
              </p>
            </div>

            <div class="phone-column">
              <DeviceFrame
                kind="phone"
                :src="project.href"
                :title="`${project.title} — versão mobile`"
              />
              <p class="device-hint">
                Mesmo site em 390 px — o layout que o visitante vê no celular.
              </p>
            </div>
          </div>

          <!--
            Sem link: a arte do projeto já é uma composição com dispositivo.
            Emoldurá-la de novo criaria um notebook dentro de um monitor, então
            ela é apresentada inteira, sem recorte.
          -->
          <figure v-else class="still-stage">
            <img
              :src="project.full"
              :alt="project.alt"
              class="still-stage__image"
              decoding="async"
            />
            <figcaption class="device-hint">
              Registro do projeto entregue. Cadastre o endereço no painel para exibir a versão
              navegável.
            </figcaption>
          </figure>
        </section>

        <footer class="mt-16 flex flex-col gap-7 border-t border-gold-500/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p class="label-caps text-muted">
            {{ project.category }}
            <span class="px-2 text-gold-400">•</span>{{ project.year }}
            <template v-if="project.href">
              <span class="px-2 text-gold-400">•</span>Desktop
              <span class="px-2 text-gold-400">•</span>Celular
            </template>
          </p>
          <div class="flex items-center gap-6">
            <a
              v-if="project.href"
              :href="project.href"
              target="_blank"
              rel="noopener noreferrer"
              class="label-caps border border-gold-400 bg-gold-400 px-6 py-3 text-ink-950 transition hover:bg-gold-200"
            >
              Visitar projeto ↗
            </a>
            <button type="button" class="label-caps border-b border-gold-400/70 pb-1 text-gold-300 hover:text-gold-200" @click="emit('close')">
              Voltar
            </button>
          </div>
        </footer>
      </main>
    </div>
  </Transition>
</template>

<style scoped>
.project-case {
  background:
    radial-gradient(circle at 94% 45%, rgb(17 76 74 / .3), transparent 34rem),
    radial-gradient(circle at 3% 6%, rgb(127 90 29 / .13), transparent 28rem),
    #050506;
}

.case-rule {
  height: 1px;
  background: linear-gradient(90deg, var(--color-gold-300) 0 12%, rgb(201 155 59 / .18) 12% 100%);
}

.devices-grid {
  display: grid;
  grid-template-columns: minmax(0, 3.15fr) minmax(250px, .9fr);
  align-items: end;
  gap: clamp(2rem, 5vw, 7rem);
}

.desktop-column, .phone-column { min-width: 0; }

.still-stage {
  margin: 0;
}

.still-stage__image {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  border: 1px solid rgb(201 155 59 / .28);
  box-shadow: 0 34px 70px rgb(0 0 0 / .6);
}

.device-hint {
  width: fit-content;
  max-width: 100%;
  margin: 1.75rem auto 0;
  border: 1px solid rgb(201 155 59 / .35);
  border-radius: 999px;
  background: linear-gradient(90deg, rgb(201 155 59 / .09), rgb(127 90 29 / .18));
  padding: .7rem 1.15rem;
  color: var(--color-sand);
  font-size: clamp(.7rem, 1vw, .9rem);
  line-height: 1.4;
  text-align: center;
}

.device-hint span { margin-right: .45rem; color: var(--color-gold-300); }

@media (max-width: 800px) {
  .devices-grid { grid-template-columns: 1fr; align-items: start; }
  .phone-column { width: min(68%, 320px); margin-inline: auto; }
}
</style>
