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

const LOCAL_COVER_BASE = '/assets/portifolio-recriados'

const LOCAL_COVERS = [
  { slug: 'case-ja', aliases: ['case ja', 'ja wedding planning', 'ja'] },
  { slug: 'ofertas-burger', aliases: ['ofertas burger', 'hamburgueria'] },
  { slug: 'faster-food', aliases: ['faster food'] },
  { slug: 'caetano-hidraulica', aliases: ['caetano hidraulica', 'caetano'] },
  { slug: 'barbearia-prime', aliases: ['barbearia prime'] },
] as const

function normalizedTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function localCoverFor(title: string): string | undefined {
  const normalized = normalizedTitle(title)
  return LOCAL_COVERS.find(({ aliases }) => aliases.some((alias) => normalized === alias || normalized.includes(alias)))?.slug
}

function localCoverUrl(slug: string, width: 600 | 900 | 1400 | 2176): string {
  return `${LOCAL_COVER_BASE}/${slug}-${width}.webp`
}

export const remoteProjects = ref<PortfolioProject[]>([])

/** Vira true quando a busca termina — com sucesso ou não. Separa "carregando"
 *  de "não há projetos", que precisam de tratamentos visuais diferentes. */
export const projectsLoaded = ref(false)

function storageUrl(path: string): string {
  return `${URL_BASE}/storage/v1/object/public/${BUCKET}/${path}`
}

/**
 * Nunca lança: sem Supabase configurado, com a tabela ausente ou a rede fora,
 * a seção cai no estado vazio em vez de quebrar a página.
 */
export async function loadRemoteProjects(): Promise<void> {
  if (!URL_BASE || !KEY) {
    projectsLoaded.value = true
    return
  }

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
    const projects = rows.map((row) => {
      const url = storageUrl(row.image_path)
      const localCover = localCoverFor(row.title)
      return {
        id: row.id,
        title: row.title,
        category: row.category,
        year: row.year,
        description: row.description,
        href: row.href ?? undefined,
        src: localCover ? localCoverUrl(localCover, 1400) : url,
        srcset: localCover
          ? `${localCoverUrl(localCover, 600)} 600w, ${localCoverUrl(localCover, 900)} 900w, ${localCoverUrl(localCover, 1400)} 1400w, ${localCoverUrl(localCover, 2176)} 2176w`
          : `${url} 1400w`,
        full: localCover ? localCoverUrl(localCover, 2176) : url,
        alt: localCover ? `Capa do projeto ${row.title}.` : `Mockup do projeto ${row.title}.`,
      }
    })

    // O Case JÁ abre a narrativa do portfólio, independentemente da ordem
    // editorial recebida do painel. A ordenação é estável para os demais cases.
    projects.sort((a, b) => Number(localCoverFor(b.title) === 'case-ja') - Number(localCoverFor(a.title) === 'case-ja'))
    remoteProjects.value = projects
  } catch {
    // Silencioso por design: a seção mostra o estado vazio em vez de quebrar.
  } finally {
    projectsLoaded.value = true
  }
}
