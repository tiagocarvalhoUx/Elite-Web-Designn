<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PortfolioProject } from '@/data/portfolio'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import AppIcon from './AppIcon.vue'

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

        <section class="mockup-stage mt-14 sm:mt-20" aria-label="Demonstração responsiva e interativa do projeto">
          <div class="devices-grid">
            <div class="desktop-column">
              <div class="imac-shell">
                <span class="imac-camera" aria-hidden="true" />
                <div class="imac-screen">
                  <iframe
                    v-if="project.href"
                    :src="project.href"
                    :title="`${project.title} — versão desktop interativa`"
                    loading="eager"
                    allow="fullscreen; autoplay; clipboard-read; clipboard-write"
                  />
                  <img v-else :src="project.full" :alt="project.alt" class="fallback-preview" />
                </div>
                <div class="imac-chin"><span /></div>
              </div>
              <div class="imac-stand" aria-hidden="true"><span /></div>
              <p class="device-hint"><span aria-hidden="true">▣</span> Passe o cursor para navegar e rolar o projeto no desktop.</p>
            </div>

            <div class="phone-column">
              <div class="phone-shell">
                <span class="phone-speaker" aria-hidden="true" />
                <div class="phone-screen">
                  <iframe
                    v-if="project.href"
                    :src="project.href"
                    :title="`${project.title} — versão mobile interativa`"
                    loading="eager"
                    allow="fullscreen; autoplay; clipboard-read; clipboard-write"
                  />
                  <img v-else :src="project.full" :alt="`${project.alt} Versão mobile.`" class="fallback-preview object-center" />
                </div>
              </div>
              <p class="device-hint"><span aria-hidden="true">▯</span> Toque e role para explorar a versão responsiva.</p>
            </div>
          </div>
        </section>

        <footer class="mt-16 flex flex-col gap-7 border-t border-gold-500/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p class="label-caps text-muted">{{ project.category }} <span class="px-2 text-gold-400">•</span> Desktop <span class="px-2 text-gold-400">•</span> Celular</p>
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

.imac-shell {
  position: relative;
  padding: clamp(1.1rem, 2.1vw, 2.2rem) clamp(1.1rem, 2vw, 2rem) 0;
  overflow: hidden;
  border: 1px solid rgb(230 198 125 / .72);
  border-bottom: 0;
  border-radius: clamp(1rem, 2vw, 2rem) clamp(1rem, 2vw, 2rem) 0 0;
  background: linear-gradient(145deg, #151517, #080809);
  box-shadow: inset 0 0 0 1px rgb(201 155 59 / .1), 0 35px 80px rgb(0 0 0 / .7), 0 0 50px rgb(201 155 59 / .07);
}

.imac-camera {
  position: absolute;
  top: .55rem;
  left: 50%;
  width: .45rem;
  height: .45rem;
  transform: translateX(-50%);
  border: 1px solid #333;
  border-radius: 50%;
  background: #030303;
}

.imac-screen {
  height: clamp(360px, 53vw, 790px);
  overflow: hidden;
  border: 1px solid rgb(230 198 125 / .48);
  background: #050504;
}

.imac-screen iframe, .phone-screen iframe { width: 100%; height: 100%; border: 0; background: white; }
.fallback-preview { width: 100%; height: 100%; object-fit: cover; }

.imac-chin {
  position: relative;
  height: clamp(4rem, 7vw, 7rem);
  margin-inline: clamp(-2rem, -2vw, -1.1rem);
  background: linear-gradient(180deg, #f2f2f1, #d8d8d7);
}

.imac-chin span {
  position: absolute;
  top: 50%; left: 50%;
  width: .8rem; height: .8rem;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #050505;
}

.imac-stand {
  width: 42%;
  height: clamp(5rem, 11vw, 10rem);
  margin-inline: auto;
  background: linear-gradient(90deg, #cfcfce, #f4f4f3 48%, #bdbdbc);
  clip-path: polygon(35% 0, 65% 0, 70% 84%, 91% 94%, 94% 100%, 6% 100%, 9% 94%, 30% 84%);
  filter: drop-shadow(0 16px 16px rgb(0 0 0 / .6));
}

.phone-shell {
  position: relative;
  padding: clamp(.55rem, 1vw, .9rem);
  border: clamp(.45rem, .8vw, .75rem) solid #1d1d22;
  outline: 1px solid rgb(230 198 125 / .72);
  outline-offset: 1px;
  border-radius: clamp(2.2rem, 4vw, 4rem);
  background: #09090a;
  box-shadow: inset 0 0 0 1px rgb(201 155 59 / .2), 0 35px 80px rgb(0 0 0 / .8), 0 0 45px rgb(201 155 59 / .08);
}

.phone-speaker {
  position: absolute;
  top: .65rem; left: 50%; z-index: 2;
  width: 36%; height: .65rem;
  transform: translateX(-50%);
  border: 1px solid #29292d;
  border-radius: 999px;
  background: #070708;
}

.phone-screen {
  height: clamp(440px, 49vw, 735px);
  overflow: hidden;
  border: 1px solid rgb(230 198 125 / .4);
  border-radius: clamp(1.45rem, 2.7vw, 2.8rem);
  background: #050504;
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
  .phone-column { width: min(72%, 330px); margin-inline: auto; }
  .imac-screen { height: clamp(260px, 59vw, 430px); }
  .phone-screen { height: 610px; }
}
</style>
