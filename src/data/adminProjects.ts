import { ref } from 'vue'
import type { PortfolioProject } from './portfolio'
import { isSupabaseConfigured, requireSupabase, supabase } from '@/lib/supabase'

/**
 * Projetos gerenciados pelo painel, persistidos no Supabase.
 *
 * A imagem vive no Storage (bucket `portfolio`); a tabela guarda só o caminho.
 * As políticas de RLS é que decidem o que cada um enxerga: visitante anônimo
 * recebe apenas `active = true`, sessão autenticada recebe tudo.
 */

const TABLE = 'projects'
const BUCKET = 'portfolio'

export interface AdminProject extends PortfolioProject {
  readonly createdAt: string
  readonly active: boolean
  /** Caminho do arquivo dentro do bucket, usado para substituir ou remover. */
  readonly imagePath: string
}

interface ProjectRow {
  id: string
  title: string
  category: string
  year: number
  description: string
  href: string | null
  image_path: string
  active: boolean
  created_at: string
}

export const adminProjects = ref<AdminProject[]>([])
export const projectsLoading = ref(false)
export const projectsError = ref('')

function publicUrl(path: string): string {
  if (!supabase) return ''
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

function toProject(row: ProjectRow): AdminProject {
  const url = publicUrl(row.image_path)
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
    active: row.active,
    createdAt: row.created_at,
    imagePath: row.image_path,
  }
}

/**
 * Carrega os projetos. Sem Supabase configurado apenas devolve a lista vazia —
 * o site público continua exibindo o portfólio estático.
 */
export async function loadProjects(): Promise<void> {
  if (!isSupabaseConfigured) return

  projectsLoading.value = true
  projectsError.value = ''

  const { data, error } = await requireSupabase()
    .from(TABLE)
    .select('id,title,category,year,description,href,image_path,active,created_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  projectsLoading.value = false

  if (error) {
    projectsError.value = error.message
    return
  }
  adminProjects.value = (data as ProjectRow[]).map(toProject)
}

/** Envia a imagem já otimizada e devolve o caminho gravado no bucket. */
export async function uploadProjectImage(blob: Blob, title: string): Promise<string> {
  const slug =
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'projeto'

  const path = `${slug}/${Date.now()}.webp`
  const { error } = await requireSupabase()
    .storage.from(BUCKET)
    .upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000' })

  if (error) throw new Error(`Falha ao enviar a imagem: ${error.message}`)
  return path
}

async function removeImage(path: string): Promise<void> {
  if (!path) return
  // Falha ao limpar o arquivo antigo não deve derrubar a operação principal.
  await requireSupabase().storage.from(BUCKET).remove([path])
}

export interface ProjectInput {
  id?: string
  title: string
  category: string
  year: number
  description: string
  href?: string
  imagePath: string
  active: boolean
  /** Caminho anterior, removido do bucket quando a imagem é trocada. */
  previousImagePath?: string
}

export async function saveAdminProject(input: ProjectInput): Promise<void> {
  const payload = {
    title: input.title.trim(),
    category: input.category.trim(),
    year: input.year,
    description: input.description.trim(),
    href: input.href?.trim() || null,
    image_path: input.imagePath,
    active: input.active,
  }

  const client = requireSupabase()
  const { error } = input.id
    ? await client.from(TABLE).update(payload).eq('id', input.id)
    : await client.from(TABLE).insert(payload)

  if (error) throw new Error(error.message)

  if (input.previousImagePath && input.previousImagePath !== input.imagePath) {
    await removeImage(input.previousImagePath)
  }
  await loadProjects()
}

export async function removeAdminProject(id: string): Promise<void> {
  const target = adminProjects.value.find((project) => project.id === id)
  const { error } = await requireSupabase().from(TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)

  if (target) await removeImage(target.imagePath)
  await loadProjects()
}

export async function toggleAdminProject(id: string): Promise<void> {
  const target = adminProjects.value.find((project) => project.id === id)
  if (!target) return

  const { error } = await requireSupabase()
    .from(TABLE)
    .update({ active: !target.active })
    .eq('id', id)

  if (error) throw new Error(error.message)
  await loadProjects()
}
