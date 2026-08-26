/**
 * Envio do formulário de contato.
 *
 * Usa `fetch` direto na API REST em vez do SDK do Supabase, pelo mesmo motivo
 * de `publicProjects.ts`: o SDK custaria ~63 kB gzip na home para uma única
 * chamada. O painel, que é raro e autenticado, carrega o SDK à parte.
 *
 * A política de RLS `leads_public_insert` é o que autoriza esta escrita anônima
 * — e a ausência de política de SELECT para anon é o que impede qualquer
 * visitante de ler os contatos de volta.
 */

const URL_BASE = import.meta.env['VITE_SUPABASE_URL'] as string | undefined
const KEY = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined

export const canStoreLeads = Boolean(URL_BASE && KEY)

export interface LeadInput {
  name: string
  email: string
  whatsapp: string
  projectType: string
  message: string
}

/**
 * Grava a solicitação. Lança em qualquer falha para que a interface só mostre
 * "Solicitação registrada" quando o lead estiver de fato no banco — a versão
 * anterior declarava sucesso mesmo sem nada ter sido salvo em lugar nenhum.
 */
export async function submitLead(input: LeadInput): Promise<void> {
  if (!URL_BASE || !KEY) throw new Error('Supabase não configurado.')

  const response = await fetch(`${URL_BASE}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      // Sem `return=representation` a resposta vem vazia — não queremos que a
      // API devolva o lead recém-criado, já que anon não pode lê-los.
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      whatsapp: input.whatsapp.trim(),
      project_type: input.projectType,
      message: input.message.trim(),
      source: typeof window === 'undefined' ? null : window.location.href,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Falha ao registrar a solicitação (HTTP ${response.status}). ${detail}`.trim())
  }
}
