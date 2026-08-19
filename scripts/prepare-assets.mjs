/**
 * Gera os assets de produção a partir da arte original.
 * Fontes: /images (composições 2176x1632) e /EliteWebDesigner_AssetPack.
 * Saída: src/assets/** e public/**  — WebP responsivo, sem retrabalho manual.
 *
 * Executar: npm run assets
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const PACK = path.join(ROOT, 'EliteWebDesigner_AssetPack', 'EliteWebDesigner_AssetPack')
const SHOTS = path.join(ROOT, 'images')
const OUT = path.join(ROOT, 'src', 'assets')
const PUBLIC = path.join(ROOT, 'public')

/** As composições têm o título gravado no rodapé; cortamos acima dele. */
const SHOWCASE = { left: 0, top: 0, width: 2176, height: 1300 }
const PORTFOLIO_WIDTHS = [1400, 900, 600]

const PROJECTS = [
  ['mrv', 'projeto_mrv_luxo.png'],
  ['caetano', 'projeto_caetano_luxo.png'],
  ['marcenaria', 'projeto_marcenaria_luxo.png'],
  ['reza-vela', 'projeto_reza_vela_luxo.png'],
  ['petshop', 'projeto_petshop_luxo.png'],
  ['coffee', 'projeto_coffee_luxo.png'],
]

const webp = (quality) => ({ quality, effort: 6 })

async function portfolio() {
  await mkdir(path.join(OUT, 'portfolio'), { recursive: true })
  for (const [slug, file] of PROJECTS) {
    const base = sharp(path.join(SHOTS, file)).extract(SHOWCASE)
    for (const w of PORTFOLIO_WIDTHS) {
      await base
        .clone()
        .resize({ width: w, kernel: 'lanczos3' })
        .webp(webp(w > 1000 ? 80 : 82))
        .toFile(path.join(OUT, 'portfolio', `${slug}-${w}.webp`))
    }
    console.log(`portfolio: ${slug}`)
  }
}

async function hero() {
  await mkdir(path.join(OUT, 'hero'), { recursive: true })
  const src = path.join(PACK, '03_HERO', 'hero-mrv-laptop.png')
  await sharp(src).webp({ quality: 92, effort: 6 }).toFile(path.join(OUT, 'hero', 'laptop-mrv.webp'))
  // Densidade extra para telas retina: upscale suave, sem serrilhado.
  await sharp(src)
    .resize({ width: 1370, kernel: 'lanczos3' })
    .webp({ quality: 86, effort: 6 })
    .toFile(path.join(OUT, 'hero', 'laptop-mrv@2x.webp'))
  console.log('hero: laptop-mrv')
}

async function brand() {
  await mkdir(path.join(OUT, 'brand'), { recursive: true })
  const mark = path.join(PACK, '01_BRAND', 'logo-wd-gold-transparent.png')
  const lockup = path.join(PACK, '01_BRAND', 'footer-brand-lockup-transparent.png')

  await sharp(mark).webp({ quality: 95, effort: 6 }).toFile(path.join(OUT, 'brand', 'logo-wd.webp'))
  await sharp(mark)
    .resize({ width: 255, kernel: 'lanczos3' })
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(OUT, 'brand', 'logo-wd@3x.webp'))
  await sharp(lockup).webp({ quality: 95, effort: 6 }).toFile(path.join(OUT, 'brand', 'lockup.webp'))
  await sharp(lockup)
    .resize({ width: 430, kernel: 'lanczos3' })
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(OUT, 'brand', 'lockup@2x.webp'))
  console.log('brand: logo + lockup')
}

async function metaImages() {
  await mkdir(PUBLIC, { recursive: true })
  const mark = path.join(PACK, '01_BRAND', 'logo-wd-gold-on-dark.png')
  for (const size of [32, 180, 512]) {
    await sharp(mark)
      .resize({ width: size, height: size, fit: 'contain', background: '#070706', kernel: 'lanczos3' })
      .png()
      .toFile(path.join(PUBLIC, size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`))
  }
  await sharp(path.join(SHOTS, 'projeto_mrv_luxo.png'))
    .extract({ left: 0, top: 130, width: 2176, height: 1142 })
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(PUBLIC, 'og-image.jpg'))
  console.log('meta: icons + og-image')
}

/**
 * Textura de mármore preto com veios dourados, recortada de uma área limpa
 * da arte original (sem device, sem marca d'água, sem título).
 * O feixe de luz fica no topo — espelhamos para nascer à esquerda, como na referência.
 */
async function marble() {
  await mkdir(path.join(OUT, 'decorative'), { recursive: true })
  const region = { left: 1390, top: 100, width: 786, height: 1200 }
  const src = sharp(path.join(SHOTS, 'projeto_coffee_luxo.png')).extract(region).flop()
  for (const w of [1200, 640]) {
    await src
      .clone()
      .resize({ width: w, kernel: 'lanczos3' })
      .webp({ quality: 72, effort: 6, smartSubsample: true })
      .toFile(path.join(OUT, 'decorative', `marble-${w}.webp`))
  }
  console.log('decorative: marble')
}

await portfolio()
await hero()
await marble()
await brand()
await metaImages()
console.log('\nAssets prontos.')
