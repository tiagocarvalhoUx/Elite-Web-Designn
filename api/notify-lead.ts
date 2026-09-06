/**
 * Aviso por e-mail quando chega uma solicitação pelo formulário.
 *
 * Roda no servidor da Vercel, e é por isso que existe: a chave da API de e-mail
 * não pode viver no frontend. Qualquer variável `VITE_*` é compilada dentro do
 * bundle público — quem abrisse o DevTools teria a chave e poderia disparar
 * e-mails em nome do domínio. Aqui ela é lida de `process.env`, que nunca sai
 * do servidor.
 *
 * O lead já foi gravado no Supabase antes desta chamada. Este aviso é o extra:
 * se falhar, o lead continua salvo e visível em /admin.
 */

export const config = { runtime: 'edge' }

interface LeadPayload {
  name?: unknown
  email?: unknown
  whatsapp?: unknown
  projectType?: unknown
  message?: unknown
  plan?: unknown
  source?: unknown
}

/** Corta em `max` e devolve string limpa — nunca confiar no tamanho do que chega. */
function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

/** Escapa o que vai para dentro do HTML do e-mail. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function whatsappLink(phone: string, name: string): string {
  const digits = phone.replace(/\D/g, '')
  const e164 = digits.startsWith('55') ? digits : `55${digits}`
  const greeting = `Olá, ${name.split(' ')[0] ?? ''}! Recebemos sua solicitação no site da Elite Web Designer.`
  return `https://wa.me/${e164}?text=${encodeURIComponent(greeting)}`
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = process.env['RESEND_API_KEY']
  const to = process.env['LEAD_NOTIFY_TO']

  // Sem configuração o site segue funcionando: o lead está no banco de todo
  // jeito, só não há aviso. Responder 204 evita ruído de erro no navegador.
  if (!apiKey || !to) {
    return new Response(null, { status: 204 })
  }

  let payload: LeadPayload
  try {
    payload = (await request.json()) as LeadPayload
  } catch {
    return new Response('Corpo inválido', { status: 400 })
  }

  const name = str(payload.name, 120)
  const email = str(payload.email, 160)
  const whatsapp = str(payload.whatsapp, 40)
  const projectType = str(payload.projectType, 60)
  const message = str(payload.message, 4000)
  const plan = str(payload.plan, 60)
  const source = str(payload.source, 300)

  if (!name || !email || !message) {
    return new Response('Campos obrigatórios ausentes', { status: 400 })
  }

  const rows: Array<[string, string]> = [
    ...(plan ? ([['Plano', `<strong>${escapeHtml(plan)}</strong>`]] as Array<[string, string]>) : []),
    ['Nome', escapeHtml(name)],
    ['E-mail', `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`],
    [
      'WhatsApp',
      `<a href="${whatsappLink(whatsapp, name)}">${escapeHtml(whatsapp)}</a> — clique para responder`,
    ],
    ['Tipo de projeto', escapeHtml(projectType)],
  ]

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;background:#070706;color:#cfc3b2;padding:32px">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#c99b3b">Elite Web Designer</p>
      <h1 style="margin:0 0 24px;font-size:24px;color:#ddd2c0;font-weight:600">Nova solicitação de orçamento</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(201,155,59,.2);color:#9c9182;width:150px">${label}</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(201,155,59,.2);color:#ddd2c0">${value}</td>
          </tr>`,
          )
          .join('')}
      </table>
      <p style="margin:24px 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#c99b3b">Mensagem</p>
      <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-line;color:#ddd2c0">${escapeHtml(message)}</p>
      ${source ? `<p style="margin:24px 0 0;font-size:12px;color:#9c9182">Origem: ${escapeHtml(source)}</p>` : ''}
    </div>`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env['LEAD_NOTIFY_FROM'] || 'Elite Web Designer <onboarding@resend.dev>',
      to: [to],
      // Responder o e-mail vai direto para o cliente, sem copiar endereço.
      reply_to: email,
      /*
       * O plano vem primeiro por causa da notificação do celular: o texto é
       * cortado depois de poucas palavras, e é ele que decide se vale
       * interromper o que se está fazendo para responder agora.
       */
      subject: plan
        ? `Nova solicitação — Plano ${plan} — ${name}`
        : `Nova solicitação — ${projectType || 'Orçamento'} — ${name}`,
      html,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    return new Response(`Falha ao enviar o aviso: ${detail}`.slice(0, 300), { status: 502 })
  }

  return new Response(null, { status: 204 })
}
