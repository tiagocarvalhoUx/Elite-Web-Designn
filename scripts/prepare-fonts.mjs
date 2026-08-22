/**
 * Baixa e hospeda as fontes localmente.
 *
 * O <link> para fonts.googleapis.com bloqueava a primeira pintura por ~887 ms:
 * o navegador precisa resolver DNS e negociar TLS com dois domínios de terceiros
 * (googleapis para o CSS, gstatic para os arquivos) antes de desenhar qualquer
 * coisa. Servindo do mesmo domínio, some a cadeia inteira.
 *
 * Só os pesos que o site usa de fato, e só os subconjuntos latinos.
 *
 * Executar: npm run fonts
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Em public/: URL estável, necessária para o <link rel="preload"> do index.html.
const OUT = path.resolve(import.meta.dirname, '..', 'public', 'fonts')

/** UA moderno: sem ele o Google devolve formatos antigos, muito maiores. */
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

const FAMILIES = [
  { css: 'Cormorant+Garamond:ital,wght@0,400;0,500;1,400', slug: 'cormorant' },
  { css: 'Manrope:wght@300;400;500;600', slug: 'manrope' },
]

/** Mantemos apenas latin e latin-ext; o português cabe inteiro neles. */
const KEEP = new Set(['latin', 'latin-ext'])

await mkdir(OUT, { recursive: true })
const faces = []

for (const family of FAMILIES) {
  const res = await fetch(`https://fonts.googleapis.com/css2?family=${family.css}&display=swap`, {
    headers: { 'User-Agent': UA },
  })
  const css = await res.text()

  // O CSS vem em blocos precedidos por um comentário com o nome do subconjunto.
  const blocks = css.split('/* ').slice(1)
  for (const block of blocks) {
    const subset = block.slice(0, block.indexOf(' '))
    if (!KEEP.has(subset)) continue

    const url = /src: url\((https:[^)]+)\)/.exec(block)?.[1]
    const weight = /font-weight: (\d+)/.exec(block)?.[1]
    const style = /font-style: (\w+)/.exec(block)?.[1] ?? 'normal'
    const range = /unicode-range: ([^;]+);/.exec(block)?.[1]
    if (!url || !weight) continue

    const name = `${family.slug}-${weight}${style === 'italic' ? 'i' : ''}-${subset}.woff2`
    const file = Buffer.from(await (await fetch(url)).arrayBuffer())
    await writeFile(path.join(OUT, name), file)
    faces.push({ family: family.slug, name, weight, style, range, kb: file.length / 1024 })
    console.log(`${name.padEnd(34)} ${(file.length / 1024).toFixed(1)} kB`)
  }
}

const total = faces.reduce((sum, f) => sum + f.kb, 0)
console.log(`\n${faces.length} arquivos, ${total.toFixed(1)} kB no total`)
const css = [
  '/*',
  ' * Fontes servidas do próprio domínio — geradas por `npm run fonts`.',
  ' * O <link> para o Google bloqueava a primeira pintura por ~887 ms.',
  ' * Não editar à mão.',
  ' */',
  '',
  ...faces.map((f) =>
    [
      '@font-face {',
      `  font-family: '${f.family === 'cormorant' ? 'Cormorant Garamond' : 'Manrope'}';`,
      `  font-style: ${f.style};`,
      `  font-weight: ${f.weight};`,
      '  font-display: swap;',
      `  src: url('/fonts/${f.name}') format('woff2');`,
      `  unicode-range: ${f.range};`,
      '}',
      '',
    ].join('\n'),
  ),
].join('\n')

await writeFile(path.resolve(import.meta.dirname, '..', 'src', 'styles', 'fonts.css'), css)
console.log('src/styles/fonts.css gerado')
