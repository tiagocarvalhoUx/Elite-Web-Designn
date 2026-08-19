import { onBeforeUnmount, watch, type Ref } from 'vue'

/**
 * Trava o scroll do documento enquanto `locked` for verdadeiro, compensando
 * a largura da barra de rolagem para não deslocar o layout.
 */
export function useScrollLock(locked: Readonly<Ref<boolean>>): void {
  let previousOverflow = ''
  let previousPadding = ''

  function lock(): void {
    const root = document.documentElement
    const gap = window.innerWidth - root.clientWidth
    previousOverflow = document.body.style.overflow
    previousPadding = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
  }

  function unlock(): void {
    document.body.style.overflow = previousOverflow
    document.body.style.paddingRight = previousPadding
  }

  watch(locked, (value) => (value ? lock() : unlock()))
  onBeforeUnmount(unlock)
}
