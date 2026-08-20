<script setup lang="ts">
import { computed } from 'vue'
import { site, socialLinks } from '@/data/site'
import { footerColumns } from '@/data/footer'
import BrandMark from '@/components/ui/BrandMark.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

/** Só entram no rodapé os perfis efetivamente configurados — nada de link vazio. */
const socials = computed(() => socialLinks.filter((item) => item.href.length > 0))

const currentYear = new Date().getFullYear()
const copyrightYear = computed(() =>
  currentYear > site.foundedYear ? `${site.foundedYear}–${currentYear}` : `${site.foundedYear}`,
)
</script>

<template>
  <footer class="relative border-t border-gold-500/25 bg-ink-950/70">
    <div class="mx-auto max-w-(--shell) px-(--gutter) py-16 lg:py-20">
      <!--
        Mobile-first: marca e contato centralizados, um logo abaixo do outro,
        como na arte. A partir de `lg` o rodapé volta ao grid de cinco colunas
        alinhado à esquerda.
      -->
      <div
        class="grid gap-12 text-center sm:gap-10 lg:grid-cols-[minmax(0,0.95fr)_repeat(3,minmax(0,0.7fr))_minmax(0,1.05fr)] lg:text-left"
      >
        <div class="order-1 flex flex-col items-center gap-6 lg:order-1 lg:items-start lg:gap-5">
          <BrandMark :height="96" class="lg:hidden" />
          <BrandMark :height="56" class="max-lg:hidden" />

          <div>
            <p
              class="font-sans text-[1.05rem] font-medium tracking-[0.3em] text-gold-300 uppercase lg:text-[0.82rem] lg:tracking-[0.24em] lg:text-ivory"
            >
              {{ site.name }}
            </p>
            <p
              class="mt-3 text-[0.78rem] tracking-[0.26em] text-gold-400/80 uppercase lg:mt-2 lg:text-xs lg:tracking-[0.16em] lg:text-muted"
            >
              {{ site.tagline }}
            </p>
          </div>

        </div>

        <!-- Contato vem logo após a marca no mobile; no desktop é a última coluna. -->
        <div class="order-2 flex min-w-0 flex-col gap-4 lg:order-5">
          <h2 class="label-caps text-gold-400/90 max-lg:sr-only">Contato</h2>

          <!-- Bloco centrado, itens alinhados entre si: os ícones formam coluna. -->
          <ul
            class="mx-auto flex min-w-0 max-w-full flex-col gap-6 text-left text-[1.02rem] lg:mx-0 lg:gap-3 lg:text-sm"
          >
            <li class="min-w-0">
              <a
                :href="site.whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex min-w-0 items-center gap-4 text-sand transition-colors duration-200 hover:text-gold-200 lg:gap-3 lg:text-sand/80"
              >
                <AppIcon name="whatsapp" class="size-6 shrink-0 text-gold-400 lg:size-4" />
                <span class="min-w-0">{{ site.phoneDisplay }}</span>
              </a>
            </li>
            <li class="min-w-0">
              <a
                :href="`mailto:${site.email}`"
                class="flex min-w-0 items-center gap-4 text-sand transition-colors duration-200 hover:text-gold-200 lg:items-start lg:gap-3 lg:text-sand/80"
              >
                <AppIcon name="mail" class="size-6 shrink-0 text-gold-400 lg:mt-1 lg:size-4" />
                <span class="min-w-0 [overflow-wrap:anywhere]">{{ site.email }}</span>
              </a>
            </li>
            <li class="flex min-w-0 items-center gap-4 text-sand lg:items-start lg:gap-3 lg:text-sand/80">
              <AppIcon name="pin" class="size-6 shrink-0 text-gold-400 lg:mt-1 lg:size-4" />
              <span class="min-w-0">{{ site.location }}</span>
            </li>
          </ul>
        </div>

        <!--
          Navegação secundária só no desktop: no mobile são onze links que
          repetem âncoras já cobertas pelo menu, alongando o rodapé sem
          oferecer nenhum destino novo.
        -->
        <nav
          v-for="(column, index) in footerColumns"
          :key="column.id"
          :aria-label="column.title"
          class="order-3 hidden flex-col gap-4 lg:flex"
          :class="['lg:order-2', 'lg:order-3', 'lg:order-4'][index]"
        >
          <h2 class="label-caps text-gold-400/90">{{ column.title }}</h2>
          <ul class="flex flex-col gap-3">
            <li v-for="link in column.links" :key="link.id">
              <a
                :href="link.href"
                class="text-sm text-sand/80 transition-colors duration-200 hover:text-gold-200"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Faixa final: redes sociais logo acima da linha de direitos. -->
    <div class="border-t border-gold-500/15">
      <div class="mx-auto flex max-w-(--shell) flex-col items-center gap-5 px-(--gutter) py-7">
        <ul v-if="socials.length" class="flex items-center gap-7">
          <li v-for="social in socials" :key="social.id">
            <a
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex size-11 items-center justify-center text-gold-400 transition-colors duration-300 ease-luxe hover:text-gold-200"
            >
              <AppIcon :name="social.id" :size="24" />
              <span class="sr-only">{{ social.label }}</span>
            </a>
          </li>
        </ul>

        <p class="text-center text-xs text-muted">
          © {{ copyrightYear }} {{ site.name }}. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>
