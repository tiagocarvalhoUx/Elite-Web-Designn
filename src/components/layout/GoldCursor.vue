<script setup lang="ts">
/**
 * Cursor próprio: um ponto dourado com rastro de cometa.
 *
 * Desenhado num único <canvas> em vez de vários elementos no DOM. Um rastro
 * feito de divs obrigaria o navegador a recalcular estilo e composição de
 * dezenas de camadas a cada quadro do mouse; no canvas é um `drawImage` por
 * partícula, sobre um sprite pré-renderizado uma única vez.
 *
 * Quem não tem mouse (toque) ou pediu menos movimento não recebe nada — nem o
 * canvas, nem o `cursor: none`. É por isso que a classe que esconde o cursor do
 * sistema é aposta pelo JS e não escrita na folha de estilo: se este componente
 * falhar, a página continua com o cursor normal em vez de ficar sem nenhum.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Elementos em que o anel abre — a mesma lista que dá "clicável" ao visitante. */
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, summary, label, [tabindex]:not([tabindex="-1"])'

const MAX_TRAIL = 26
const RING_IDLE = 13
const RING_HOVER = 30
const RING_PRESS = 9
/** Sem movimento por este tempo, o laço de animação para de vez. */
const IDLE_MS = 1600

const canvas = ref<HTMLCanvasElement | null>(null)

/**
 * Decidido antes de renderizar: com a checagem só dentro de `onMounted`, o
 * canvas chegaria a existir no celular por um quadro.
 */
const supported =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Bolinha de luz pré-renderizada: todo o rastro é este sprite em escalas diferentes. */
function makeSprite(): HTMLCanvasElement {
  const size = 64
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')
  if (!ctx) return sprite

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 250, 236, 1)')
  gradient.addColorStop(0.22, 'rgba(230, 198, 125, 0.85)')
  gradient.addColorStop(0.55, 'rgba(201, 155, 59, 0.28)')
  gradient.addColorStop(1, 'rgba(201, 155, 59, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return sprite
}

const lerp = (from: number, to: number, amount: number): number => from + (to - from) * amount

/**
 * O canvas e o contexto entram como parâmetro em vez de virem de um `ref`
 * estreitado: dentro das closures do laço de animação o TypeScript perde o
 * estreitamento e cada uso voltaria a ser "possibly null".
 */
function install(el: HTMLCanvasElement, ctx: CanvasRenderingContext2D): () => void {
  const sprite = makeSprite()
  let width = window.innerWidth
  let height = window.innerHeight

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    el.width = Math.round(width * dpr)
    el.height = Math.round(height * dpr)
    el.style.width = `${width}px`
    el.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()

  const pointer = { x: width / 2, y: height / 2 }
  const head = { x: pointer.x, y: pointer.y }
  const ring = { x: pointer.x, y: pointer.y, r: RING_IDLE }
  const trail: Array<{ x: number; y: number }> = []

  let ringTarget = RING_IDLE
  let hovering = false
  let pressed = false
  let visible = false
  let alpha = 0
  let frame = 0
  let lastMove = 0

  function start(): void {
    if (!frame) frame = requestAnimationFrame(draw)
  }

  function draw(now: number): void {
    frame = requestAnimationFrame(draw)

    // O ponto segue o mouse quase colado; o anel vem bem atrás — é a distância
    // entre os dois que o olho lê como rastro, não uma animação de opacidade.
    head.x = lerp(head.x, pointer.x, 0.38)
    head.y = lerp(head.y, pointer.y, 0.38)
    ring.x = lerp(ring.x, pointer.x, 0.16)
    ring.y = lerp(ring.y, pointer.y, 0.16)

    ringTarget = pressed ? RING_PRESS : hovering ? RING_HOVER : RING_IDLE
    ring.r = lerp(ring.r, ringTarget, 0.14)
    alpha = lerp(alpha, visible ? 1 : 0, 0.12)

    const previous = trail[trail.length - 1]
    const moved = previous ? Math.hypot(head.x - previous.x, head.y - previous.y) : Infinity
    // Parado, a cauda recolhe em vez de virar um borrão empilhado no mesmo pixel.
    if (moved > 0.7) trail.push({ x: head.x, y: head.y })
    else if (trail.length) trail.shift()
    while (trail.length > MAX_TRAIL) trail.shift()

    ctx.clearRect(0, 0, width, height)

    if (alpha > 0.01) {
      // `lighter` soma a luz das partículas: onde o rastro se sobrepõe ele
      // esquenta, como um cometa de verdade, em vez de empilhar véus opacos.
      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < trail.length; i += 1) {
        const point = trail[i]
        if (!point) continue
        const t = (i + 1) / trail.length
        const size = (5 + t * 20) * (hovering ? 1.15 : 1)
        ctx.globalAlpha = t * t * 0.5 * alpha
        ctx.drawImage(sprite, point.x - size / 2, point.y - size / 2, size, size)
      }

      // Halo e núcleo da cabeça do cometa.
      ctx.globalAlpha = 0.85 * alpha
      ctx.drawImage(sprite, head.x - 17, head.y - 17, 34, 34)

      ctx.globalAlpha = alpha
      ctx.fillStyle = 'rgba(255, 250, 236, 1)'
      ctx.beginPath()
      ctx.arc(head.x, head.y, hovering ? 2 : 3, 0, Math.PI * 2)
      ctx.fill()

      // O anel é o que dá o "zoom" ao passar sobre algo clicável.
      ctx.globalAlpha = (hovering ? 0.75 : 0.4) * alpha
      ctx.strokeStyle = 'rgba(230, 198, 125, 1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2)
      ctx.stroke()

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    // Nada a animar: para o laço até o próximo movimento, em vez de repintar
    // um quadro vazio sessenta vezes por segundo.
    const settled = !trail.length && Math.abs(ring.r - ringTarget) < 0.5
    if (settled && (now - lastMove > IDLE_MS || alpha < 0.01)) {
      cancelAnimationFrame(frame)
      frame = 0
      ctx.clearRect(0, 0, width, height)
    }
  }

  function onMove(event: PointerEvent): void {
    if (event.pointerType === 'touch') return
    pointer.x = event.clientX
    pointer.y = event.clientY
    lastMove = performance.now()
    if (!visible) {
      // Primeira aparição: nasce onde o mouse já está, sem atravessar a tela.
      head.x = ring.x = pointer.x
      head.y = ring.y = pointer.y
      visible = true
    }
    start()
  }

  function onOver(event: PointerEvent): void {
    const target = event.target
    hovering = target instanceof Element && Boolean(target.closest(INTERACTIVE))
    start()
  }

  function onDown(): void {
    pressed = true
    start()
  }

  function onUp(): void {
    pressed = false
    start()
  }

  function onLeave(): void {
    visible = false
    start()
  }

  function onEnter(): void {
    visible = true
    lastMove = performance.now()
    start()
  }

  function onVisibility(): void {
    if (document.hidden) visible = false
    start()
  }

  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerover', onOver, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  document.addEventListener('pointerleave', onLeave)
  document.addEventListener('pointerenter', onEnter)
  document.addEventListener('visibilitychange', onVisibility)

  document.documentElement.classList.add('gold-cursor')

  return () => {
    if (frame) cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerover', onOver)
    window.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    document.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('pointerenter', onEnter)
    document.removeEventListener('visibilitychange', onVisibility)
    document.documentElement.classList.remove('gold-cursor')
  }
}

let teardown: (() => void) | undefined

onMounted(() => {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx) return
  teardown = install(el, ctx)
})

onBeforeUnmount(() => teardown?.())
</script>

<template>
  <canvas
    v-if="supported"
    ref="canvas"
    class="pointer-events-none fixed inset-0 z-[999]"
    aria-hidden="true"
  />
</template>
