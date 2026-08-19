import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from 'vue'

/**
 * Devolve o id da seção mais visível na viewport, para marcar `aria-current`
 * no item de navegação correspondente.
 */
export function useActiveSection(ids: readonly string[]): Readonly<Ref<string>> {
  const active = ref(ids[0] ?? '')
  let observer: IntersectionObserver | undefined
  const ratios = new Map<string, number>()

  onMounted(() => {
    if (!('IntersectionObserver' in window)) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best = active.value
        let bestRatio = 0
        for (const id of ids) {
          const ratio = ratios.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        if (bestRatio > 0) active.value = best
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.85], rootMargin: '-20% 0px -40% 0px' },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  return readonly(active)
}
