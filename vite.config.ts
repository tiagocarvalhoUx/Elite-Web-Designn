import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * Endereço público do site, resolvido na build.
 *
 * As metatags de compartilhamento exigem URL absoluta: o Facebook e o WhatsApp
 * não resolvem caminho relativo. Com o endereço escrito à mão no HTML, ele
 * apontava para um domínio que ainda não existe e o preview não aparecia.
 *
 * A ordem abaixo faz o valor acompanhar o ambiente sozinho — inclusive quando
 * um domínio próprio for ligado na Vercel, sem precisar editar o código.
 */
function resolveSiteUrl(): string {
  const explicit = process.env['VITE_SITE_URL']
  if (explicit) return explicit.replace(/\/$/, '')

  const vercel = process.env['VERCEL_PROJECT_PRODUCTION_URL']
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`

  return 'https://elite-web-designn.vercel.app'
}

/** Injeta o endereço no HTML e gera robots.txt e sitemap.xml com ele. */
function siteUrlPlugin(): Plugin {
  const siteUrl = resolveSiteUrl()

  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      })
    },
  }
}

/**
 * Preenche o pixel de imagem do noscript com o ID configurado, ou remove o
 * bloco inteiro quando não há Meta Pixel nesta build — HTML nunca aponta para
 * um `id=` vazio.
 */
function metaPixelNoscriptPlugin(): Plugin {
  const pixelId = process.env['VITE_META_PIXEL_ID']

  return {
    name: 'meta-pixel-noscript',
    transformIndexHtml: (html) => {
      const block = /<!--META_PIXEL_START-->[\s\S]*?<!--META_PIXEL_END-->/
      if (!pixelId) return html.replace(block, '')
      return html.replaceAll('%META_PIXEL_ID%', pixelId)
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), siteUrlPlugin(), metaPixelNoscriptPlugin()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
  },
})
