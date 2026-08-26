import { ref } from 'vue'
import { requireSupabase } from '@/lib/supabase'

/**
 * Leads do formulário, para o painel.
 *
 * Diferente de `leads.ts` (que só escreve, anonimamente, a partir do site),
 * aqui usamos o SDK autenticado: a leitura depende da política
 * `leads_admin_read`, que exige sessão de administrador.
 */

const TABLE = 'leads'

export interface Lead {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly whatsapp: string
  readonly projectType: string
  readonly message: string
  readonly source: string | null
  readonly handled: boolean
  readonly createdAt: string
}

interface LeadRow {
  id: string
  name: string
  email: string
  whatsapp: string
  project_type: string
  message: string
  source: string | null
  handled: boolean
  created_at: string
}

export const leads = ref<Lead[]>([])
export const leadsLoading = ref(false)
export const leadsError = ref('')

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp,
    projectType: row.project_type,
    message: row.message,
    source: row.source,
    handled: row.handled,
    createdAt: row.created_at,
  }
}

export async function loadLeads(): Promise<void> {
  leadsLoading.value = true
  leadsError.value = ''

  const { data, error } = await requireSupabase()
    .from(TABLE)
    .select('id,name,email,whatsapp,project_type,message,source,handled,created_at')
    .order('created_at', { ascending: false })

  leadsLoading.value = false

  if (error) {
    leadsError.value = error.message
    return
  }
  leads.value = (data as LeadRow[]).map(toLead)
}

export async function toggleLeadHandled(id: string): Promise<void> {
  const target = leads.value.find((lead) => lead.id === id)
  if (!target) return

  const { error } = await requireSupabase()
    .from(TABLE)
    .update({ handled: !target.handled })
    .eq('id', id)

  if (error) throw new Error(error.message)
  await loadLeads()
}

export async function removeLead(id: string): Promise<void> {
  const { error } = await requireSupabase().from(TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)
  await loadLeads()
}
