import { nextTick, watch, type Ref } from 'vue'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Mantém o foco dentro de `container` enquanto `active` for verdadeiro e
 * devolve o foco ao elemento anterior ao fechar.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  active: Readonly<Ref<boolean>>,
): void {
  let previous: HTMLElement | null = null

  function onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !container.value) return

    const items = Array.from(container.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    )
    if (items.length === 0) return

    const first = items[0]!
    const last = items[items.length - 1]!
    const current = document.activeElement

    if (event.shiftKey && current === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && current === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(active, async (open) => {
    if (open) {
      previous = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      container.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    } else {
      document.removeEventListener('keydown', onKeydown)
      previous?.focus()
      previous = null
    }
  })
}
