/**
 * Meta Pixel.
 *
 * Três decisões que valem explicação:
 *
 * 1. O script entra quando o navegador está ocioso, nunca durante a primeira
 *    pintura. O pixel padrão do Meta pesa ~70 kB e roda na thread principal;
 *    carregá-lo cedo desfaria o trabalho feito para o LCP.
 *
 * 2. Todo evento leva um `eventID`. É o que permite ligar o pixel do navegador
 *    à API de Conversões depois, sem contar a mesma ação duas vezes — e é parte
 *    do que o Meta cobra na nota de "qualidade da correspondência".
 *
 * 3. O ID vem de variável de ambiente. Sem ela, nada é carregado: o site
 *    funciona igual e nenhuma requisição sai para o Facebook.
 */

const PIXEL_ID = import.meta.env['VITE_META_PIXEL_ID'] as string | undefined

type FbqParams = Record<string, string | number | undefined>

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean }
    _fbq?: unknown
  }
}

export const isPixelEnabled = Boolean(PIXEL_ID)

let booted = false

/** Snippet oficial do Meta, com a fila criada antes do script chegar. */
function injectScript(): void {
  if (window.fbq) return

  const fbq = function (...args: unknown[]) {
    // eslint-disable-next-line prefer-spread
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue?.push(args)
  } as Window['fbq'] & { callMethod?: (...args: unknown[]) => void }

  fbq.queue = []
  fbq.loaded = true
  window.fbq = fbq
  window._fbq = fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
}

/** Identificador por evento, para deduplicar com a API de Conversões. */
function newEventId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Só dígitos e formato internacional — é assim que o Meta espera o telefone
 * para casar com o cadastro da pessoa. E-mail vai em minúsculas e sem espaços.
 * O hash é feito pelo próprio script antes de sair do navegador.
 */
function normalizeMatch(data: { email?: string; phone?: string }): FbqParams {
  const out: FbqParams = {}
  if (data.email?.trim()) out['em'] = data.email.trim().toLowerCase()
  if (data.phone?.trim()) {
    const digits = data.phone.replace(/\D/g, '')
    if (digits.length >= 10) out['ph'] = digits.startsWith('55') ? digits : `55${digits}`
  }
  return out
}

export function track(event: string, params: FbqParams = {}): void {
  if (!PIXEL_ID || !window.fbq) return
  window.fbq('track', event, params, { eventID: newEventId() })
}

export function trackCustom(event: string, params: FbqParams = {}): void {
  if (!PIXEL_ID || !window.fbq) return
  window.fbq('trackCustom', event, params, { eventID: newEventId() })
}

/**
 * Reforça a correspondência avançada com os dados que a pessoa acabou de
 * digitar. É o principal fator na nota de qualidade que o Meta exibe.
 */
export function identify(data: { email?: string; phone?: string }): void {
  if (!PIXEL_ID || !window.fbq) return
  const match = normalizeMatch(data)
  if (Object.keys(match).length) window.fbq('init', PIXEL_ID, match)
}

/** Cliques em WhatsApp viram `Contact`, sem precisar tocar em cada link. */
function watchWhatsAppClicks(): void {
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest?.('a[href*="wa.me"]')
      if (link) track('Contact', { content_name: 'WhatsApp' })
    },
    { passive: true, capture: true },
  )
}

export function initPixel(): void {
  if (!PIXEL_ID || booted) return
  booted = true

  const start = () => {
    injectScript()
    window.fbq?.('init', PIXEL_ID)
    track('PageView')
    watchWhatsAppClicks()
  }

  // Fora do caminho crítico: o pixel nunca disputa com a primeira pintura.
  //
  // `'requestIdleCallback' in window` pareceria mais natural, mas o operador
  // `in` tenta estreitar o tipo do próprio `window` — e como esta API está
  // declarada como sempre presente no lib.dom desta versão do TypeScript, o
  // compilador conclui que o ramo `else` é inatingível e o reduz a `never`.
  // Ler a função direto evita estreitar `window`.
  const scheduleIdle = window.requestIdleCallback
  if (scheduleIdle) {
    scheduleIdle(start, { timeout: 3500 })
  } else {
    window.setTimeout(start, 1500)
  }
}
