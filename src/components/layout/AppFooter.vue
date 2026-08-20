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
      <div
        class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,0.95fr)_repeat(3,minmax(0,0.7fr))_minmax(0,1.05fr)] lg:gap-10"
      >
        <!-- O bloco de marca ocupa a linha inteira nos tablets, depois vira coluna. -->
        <div class="flex flex-col items-start gap-5 sm:col-span-2 lg:col-span-1">
          <BrandMark :height="56" />
          <div>
            <p class="label-caps text-[0.82rem] text-ivory">{{ site.name }}</p>
            <p class="mt-2 text-xs tracking-[0.16em] text-muted uppercase">{{ site.tagline }}</p>
          </div>
          <ul v-if="socials.length" class="flex items-center gap-3">
            <li v-for="social in socials" :key="social.id">
              <a
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex size-11 items-center justify-center border border-gold-500/30 text-gold-400 transition-colors duration-300 ease-luxe hover:border-gold-400 hover:bg-gold-400/10 hover:text-gold-200"
              >
                <AppIcon :name="social.id" :size="18" />
                <span class="sr-only">{{ social.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <nav
          v-for="column in footerColumns"
          :key="column.id"
          :aria-label="column.title"
          class="flex flex-col gap-4"
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

        <div class="flex min-w-0 flex-col gap-4">
          <h2 class="label-caps text-gold-400/90">Contato</h2>
          <!-- `min-w-0` + quebra livre: o e-mail longo não pode alargar a coluna. -->
          <ul class="flex min-w-0 flex-col gap-3 text-sm">
            <li class="min-w-0">
              <a
                :href="site.whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex min-w-0 items-center gap-3 text-sand/80 transition-colors duration-200 hover:text-gold-200"
              >
                <AppIcon name="whatsapp" :size="16" class="shrink-0 text-gold-400" />
                <span class="min-w-0">{{ site.phoneDisplay }}</span>
              </a>
            </li>
            <li class="min-w-0">
              <a
                :href="`mailto:${site.email}`"
                class="flex min-w-0 items-start gap-3 text-sand/80 transition-colors duration-200 hover:text-gold-200"
              >
                <AppIcon name="mail" :size="16" class="mt-1 shrink-0 text-gold-400" />
                <span class="min-w-0 [overflow-wrap:anywhere]">{{ site.email }}</span>
              </a>
            </li>
            <li class="flex min-w-0 items-start gap-3 text-sand/80">
              <AppIcon name="pin" :size="16" class="mt-1 shrink-0 text-gold-400" />
              <span class="min-w-0">{{ site.location }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-gold-500/15">
      <div class="mx-auto max-w-(--shell) px-(--gutter) py-6">
        <p class="text-center text-xs text-muted">
          © {{ copyrightYear }} {{ site.name }}. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>
