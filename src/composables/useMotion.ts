import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Camada de movimento do site.
 *
 * O GSAP é carregado sob demanda, num chunk separado, e só assume o comando
 * depois de carregar de fato. Até lá — e em qualquer cenário de falha, rede
 * ruim ou `prefers-reduced-motion` — o conteúdo é revelado pelo caminho em CSS.
 * Nenhuma seção pode ficar invisível por causa de uma animação.
 *
 * Elementos que chegam depois (os projetos vindos do Supabase, por exemplo)
 * entram pelo mesmo registro via MutationObserver.
 */

const REVEALED = 'is-revealed'
const BOUND = 'motionBound'
const FAILSAFE_MS = 2500

type Register = (elements: HTMLElement[]) => void

/**
 * Variantes de entrada, com os mesmos nomes do AOS para quem vier do
 * `data-aos`. Aqui elas rodam no motor que o site já usa, sem uma segunda
 * biblioteca disputando opacity e transform nos mesmos elementos.
 *
 * Nenhuma variante escala texto: durante a interpolação a fonte fica borrada e
 * o corpo do texto perde legibilidade justamente quando entra em cena.
 */
const VARIANTS = {
  'fade-up': { opacity: 0, y: 26, scale: 1 },
  'fade-down': { opacity: 0, y: -26, scale: 1 },
  'zoom-in': { opacity: 0, y: 0, scale: 0.94 },
  'zoom-in-up': { opacity: 0, y: 30, scale: 0.95 },
} as const

type VariantName = keyof typeof VARIANTS

function variantOf(el: HTMLElement): VariantName {
  const raw = el.dataset['reveal']
  return raw && raw in VARIANTS ? (raw as VariantName) : 'fade-up'
}

function revealNow(elements: HTMLElement[]): void {
  elements.forEach((el) => el.classList.add(REVEALED))
}

/** Elementos ainda não entregues a nenhum registrador. */
function claimPending(): HTMLElement[] {
  const found = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter(
    (el) => !(BOUND in el.dataset),
  )
  found.forEach((el) => (el.dataset[BOUND] = ''))
  return found
}

/** "150+" → 150 e "+"; "24/7" → 24 e "/7". Sem número, não anima. */
function splitValue(text: string): { value: number; suffix: string } | null {
  const match = /^(\d+)(.*)$/.exec(text.trim())
  if (!match?.[1]) return null
  return { value: Number(match[1]), suffix: match[2] ?? '' }
}

/**
 * Pausa os filetes de luz que não estão em tela. Cada um repinta um gradiente
 * cônico a cada quadro; com vários elementos, fazer isso fora da vista custava
 * tempo de thread principal sem nada em troca.
 */
function watchTraces(): () => void {
  if (!('IntersectionObserver' in window)) return () => {}

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-idle', !entry.isIntersecting)
    },
    { rootMargin: '120px' },
  )

  const scan = () => document.querySelectorAll('.gold-trace').forEach((el) => io.observe(el))
  scan()

  // Cartões do portfólio chegam depois da resposta do Supabase.
  const mo = new MutationObserver(scan)
  mo.observe(document.body, { childList: true, subtree: true })

  return () => {
    io.disconnect()
    mo.disconnect()
  }
}

export function useMotion(): void {
  let register: Register | null = null
  const queued: HTMLElement[] = []
  let observer: MutationObserver | undefined
  let dispose: (() => void) | undefined
  let failsafe: number | undefined
  let stopTraces: (() => void) | undefined

  /** Antes do registrador existir, guarda; depois, encaminha na hora. */
  function handle(elements: HTMLElement[]): void {
    if (!elements.length) return
    if (register) register(elements)
    else queued.push(...elements)
  }

  function activate(next: Register): void {
    register = next
    if (queued.length) {
      next(queued.splice(0))
    }
  }

  onMounted(async () => {
    observer = new MutationObserver(() => handle(claimPending()))
    observer.observe(document.body, { childList: true, subtree: true })
    handle(claimPending())
    stopTraces = watchTraces()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      activate(revealNow)
      return
    }

    // Se o chunk demorar ou falhar, o conteúdo aparece assim mesmo.
    failsafe = window.setTimeout(() => {
      if (!register) activate(revealNow)
    }, FAILSAFE_MS)

    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      gsap.registerPlugin(ScrollTrigger)
      if (register) return // o failsafe já assumiu; não recomeça a animação
      const engine = choreograph(gsap, ScrollTrigger)
      dispose = engine.dispose
      activate(engine.register)
    } catch {
      if (!register) activate(revealNow)
    } finally {
      if (failsafe) window.clearTimeout(failsafe)
    }
  })

  onBeforeUnmount(() => {
    if (failsafe) window.clearTimeout(failsafe)
    observer?.disconnect()
    stopTraces?.()
    dispose?.()
  })
}

type Gsap = (typeof import('gsap'))['gsap']
type Trigger = (typeof import('gsap/ScrollTrigger'))['ScrollTrigger']

function choreograph(gsap: Gsap, ScrollTrigger: Trigger): { register: Register; dispose: () => void } {
  const context = gsap.context(() => {})

  function animateIntro(elements: HTMLElement[]): void {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.05 }, delay: 0.15 })
    timeline.to(elements, { opacity: 1, y: 0, stagger: 0.11 })

    const stage = document.querySelector<HTMLElement>('.hero__stage')
    if (stage) {
      timeline.fromTo(stage, { scale: 0.965 }, { scale: 1, duration: 1.5, ease: 'power2.out' }, '<0.15')
    }

    // O feixe de luz entra uma única vez — sem laço contínuo no fundo.
    const beam = document.querySelector<HTMLElement>('.hero__light')
    if (beam) {
      timeline.fromTo(
        beam,
        { opacity: 0, xPercent: -12 },
        { opacity: 1, xPercent: 0, duration: 2.2, ease: 'power1.out' },
        0,
      )
    }
  }

  function animateOnScroll(elements: HTMLElement[]): void {
    // Um lote por variante: o ScrollTrigger escalona dentro do grupo, e
    // misturar direções no mesmo lote produziria um vaivém sem sentido.
    const groups = new Map<VariantName, HTMLElement[]>()
    for (const el of elements) {
      const name = variantOf(el)
      const group = groups.get(name)
      if (group) group.push(el)
      else groups.set(name, [el])
    }

    for (const [name, group] of groups) {
      const isZoom = name.startsWith('zoom')
      ScrollTrigger.batch(group, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isZoom ? 1.05 : 0.95,
            ease: 'power3.out',
            stagger: 0.09,
            overwrite: true,
          }),
      })
    }
  }

  function animateCounters(scope: HTMLElement[]): void {
    scope
      .flatMap((el) => [
        ...(el.matches('[data-count]') ? [el] : []),
        ...el.querySelectorAll<HTMLElement>('[data-count]'),
      ])
      .forEach((el) => {
        const parsed = splitValue(el.textContent ?? '')
        if (!parsed) return

        const counter = { n: 0 }
        el.textContent = `0${parsed.suffix}`

        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () =>
            gsap.to(counter, {
              n: parsed.value,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = `${Math.round(counter.n)}${parsed.suffix}`
              },
            }),
        })
      })
  }

  const register: Register = (elements) => {
    context.add(() => {
      // O GSAP passa a ser dono do estado: inline vence o CSS e evita conflito
      // entre a transição declarada na folha e as tweens.
      for (const el of elements) gsap.set(el, VARIANTS[variantOf(el)])
      revealNow(elements)

      const hero = elements.filter((el) => el.closest('#inicio'))
      const rest = elements.filter((el) => !hero.includes(el))

      if (hero.length) animateIntro(hero)
      if (rest.length) animateOnScroll(rest)
      animateCounters(elements)
    })
  }

  // Fontes serif carregam depois e mudam alturas; recalcula os gatilhos.
  void document.fonts?.ready.then(() => ScrollTrigger.refresh())

  return { register, dispose: () => context.revert() }
}
