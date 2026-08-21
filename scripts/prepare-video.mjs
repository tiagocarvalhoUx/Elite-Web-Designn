/**
 * Prepara o filme de marca para a web.
 *
 * A gravação original tem 1440×2560 a ~12,9 Mbps (43 MB em 27 s) — peso de
 * arquivo de edição, não de página. Aqui ela vira duas entregas em 720×1280,
 * resolução suficiente porque o vídeo é exibido numa moldura de celular com
 * ~380 px de largura (760 px em telas retina).
 *
 * Requer ffmpeg no PATH. Executar: npm run video
 */
import { mkdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { statSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'video', 'Elite-luxo-21.08.mp4')
const OUT = path.join(ROOT, 'src', 'assets', 'video')

const SCALE = 'scale=720:-2'

function run(args) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })
}

function report(label, file) {
  const mb = statSync(file).size / 1024 / 1024
  console.log(`${label.padEnd(22)} ${mb.toFixed(2)} MB`)
}

await mkdir(OUT, { recursive: true })

// MP4/H.264 — o formato que toca em qualquer lugar.
// `faststart` move o índice para o início: sem isso o navegador precisa baixar
// o arquivo inteiro antes do primeiro quadro.
const mp4 = path.join(OUT, 'showreel.mp4')
run([
  '-i', SRC,
  '-vf', SCALE,
  '-c:v', 'libx264', '-profile:v', 'high', '-crf', '25', '-preset', 'slow',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k',
  '-movflags', '+faststart',
  mp4,
])
report('MP4 (H.264)', mp4)

// WebM/VP9 — bem menor onde há suporte; o <video> escolhe sozinho.
const webm = path.join(OUT, 'showreel.webm')
run([
  '-i', SRC,
  '-vf', SCALE,
  '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-row-mt', '1',
  '-c:a', 'libopus', '-b:a', '96k',
  webm,
])
report('WebM (VP9)', webm)

// Pôster: quadro de abertura, único byte de mídia baixado sem intenção do
// visitante. O vídeo em si fica em preload="none".
const poster = path.join(OUT, 'showreel-poster.webp')
run(['-ss', '1.2', '-i', SRC, '-frames:v', '1', '-vf', 'scale=720:-2', '-q:v', '80', poster])
report('Pôster (WebP)', poster)

console.log('\nVídeo pronto.')
