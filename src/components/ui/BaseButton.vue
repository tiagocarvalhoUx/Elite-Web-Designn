<script setup lang="ts">
import { computed } from 'vue'
import { trackCustom } from '@/lib/metaPixel'

type Variant = 'solid' | 'outline' | 'underline'
type Size = 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    href?: string
    type?: 'button' | 'submit'
    disabled?: boolean
    loading?: boolean
    external?: boolean
    /**
     * Nome de um evento personalizado do Meta Pixel a disparar no clique — só
     * para CTAs de intenção real ("Pedir orçamento"), nunca para navegação
     * comum (menu, rodapé), que inflaria o sinal sem significar interesse.
     */
    pixelEvent?: string
    pixelLabel?: string
  }>(),
  { variant: 'solid', size: 'md', type: 'button', disabled: false, loading: false, external: false },
)

const tag = computed(() => (props.href ? 'a' : 'button'))
const inactive = computed(() => props.disabled || props.loading)

function onClick(): void {
  if (props.pixelEvent) trackCustom(props.pixelEvent, { content_name: props.pixelLabel })
}

const VARIANTS: Record<Variant, string> = {
  solid:
    'border border-transparent bg-[linear-gradient(135deg,#a97827_0%,#c99b3b_42%,#e0bd6c_58%,#a97827_100%)] text-ink-950 shadow-[0_10px_30px_rgba(0,0,0,.45)] hover:brightness-110 active:brightness-95',
  outline:
    'border border-gold-500/60 text-gold-300 hover:border-gold-400 hover:bg-gold-400/10 hover:text-gold-200 active:bg-gold-400/15',
  underline:
    'border-0 border-b border-gold-500/70 px-0 text-ivory hover:border-gold-300 hover:text-gold-200',
}

const SIZES: Record<Size, string> = {
  md: 'min-h-11 px-6 text-[0.72rem]',
  lg: 'min-h-[3.25rem] px-8 text-[0.78rem]',
}
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :type="href ? undefined : type"
    :disabled="tag === 'button' ? inactive : undefined"
    :aria-disabled="tag === 'a' && inactive ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="group inline-flex items-center justify-center gap-3 font-sans font-medium uppercase tracking-luxe whitespace-nowrap transition-[background,color,border-color,filter,transform] duration-300 ease-luxe disabled:cursor-not-allowed disabled:opacity-55"
    :class="[
      VARIANTS[variant],
      variant === 'underline' ? 'min-h-11 text-[0.72rem]' : SIZES[size],
      // `underline` é só um filete embaixo: traçar a volta inteira inventaria
      // uma moldura que o botão não tem.
      variant !== 'underline' && 'gold-trace',
      inactive && 'pointer-events-none opacity-55',
    ]"
    @click="onClick"
  >
    <span
      v-if="loading"
      class="size-3.5 shrink-0 animate-spin rounded-full border border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>
