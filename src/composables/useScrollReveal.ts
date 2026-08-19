import { onBeforeUnmount, onMounted } from 'vue'

const REVEALED = 'is-revealed'

/**
 * Revela elementos marcados com `data-reveal` ao entrarem na viewport.
 * Executa uma única vez por elemento. Sem JS ou com movimento reduzido,
 * o CSS mantém tudo visível — o conteúdo nunca depende deste observer.
 */
export function useScrollReveal(): void {
  let observer: IntersectionObserver | undefined
  let mutations: MutationObserver | undefined

  onMounted(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      revealAll()
      return
    }

    observer = new IntersectionObserver(
      (entries, io) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add(REVEALED)
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observe()

    // Seções montadas depois (ex.: menu mobile) entram no mesmo fluxo.
    mutations = new MutationObserver(observe)
    mutations.observe(document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    mutations?.disconnect()
  })

  function targets(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(`[data-reveal]:not(.${REVEALED})`)
  }

  function observe(): void {
    targets().forEach((el) => observer?.observe(el))
  }

  function revealAll(): void {
    targets().forEach((el) => el.classList.add(REVEALED))
  }
}
