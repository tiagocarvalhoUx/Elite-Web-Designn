import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from 'vue'

/**
 * `true` assim que a página sai do topo — o header então ganha fundo
 * translúcido e a régua dourada. Leitura em rAF para não travar o scroll.
 */
export function useStickyHeader(threshold = 24): Readonly<Ref<boolean>> {
  const isScrolled = ref(false)
  let frame = 0

  function onScroll(): void {
    if (frame) return
    frame = requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > threshold
      frame = 0
    })
  }

  onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (frame) cancelAnimationFrame(frame)
  })

  return readonly(isScrolled)
}
