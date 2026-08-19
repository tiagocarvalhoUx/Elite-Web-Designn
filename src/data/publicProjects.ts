import { ref } from 'vue'
import type { PortfolioProject } from './portfolio'

/**
 * Leitura pública do portfólio.
 *
 * Usa `fetch` direto na API REST em vez do SDK do Supabase: o site institucional
 * só precisa de um GET, e o SDK custaria ~60 kB gzip a mais na home para todo
 * visitante. O painel — raro e autenticado — carrega o SDK sob demanda.
 *
 * A RLS já limita o retorno a `active = true`; o filtro aqui é só explícito.
 */

const URL_BASE = import.meta.env['VITE_SUPABASE_URL'] as string | undefined
const KEY = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined
const BUCKET = 'portfolio'

interface ProjectRow {
  id: string
  title: string
  category: string
  year: number
  description: string
  href: string | null
  image_path: string
}

export const remoteProjects = ref<PortfolioProject[]>([])

function storageUrl(path: string): string {
  return `${URL_BASE}/storage/v1/object/public/${BUCKET}/${path}`
}

/**
 * Nunca lança: se o Supabase não estiver configurado, a tabela ainda não existir
 * ou a rede falhar, a seção segue exibindo o portfólio estático.
 */
export async function loadRemoteProjects(): Promise<void> {
  if (!URL_BASE || !KEY) return

  const query = new URLSearchParams({
    select: 'id,title,category,year,description,href,image_path',
    active: 'eq.true',
    order: 'sort_order.asc,created_at.desc',
  })

  try {
    const response = await fetch(`${URL_BASE}/rest/v1/projects?${query}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    })
    if (!response.ok) return

    const rows = (await response.json()) as ProjectRow[]
    remoteProjects.value = rows.map((row) => {
      const url = storageUrl(row.image_path)
      return {
        id: row.id,
        title: row.title,
        category: row.category,
        year: row.year,
        description: row.description,
        href: row.href ?? undefined,
        src: url,
        srcset: `${url} 1400w`,
        full: url,
        alt: `Mockup do projeto ${row.title}.`,
      }
    })
  } catch {
    // Silencioso por design: o portfólio estático é o fallback.
  }
}
