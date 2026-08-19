/**
 * Diagnóstico do Supabase — confere, com a chave pública, se o schema está
 * aplicado e se as políticas de RLS realmente bloqueiam escrita anônima.
 *
 * Executar: npm run supabase:check
 *
 * Lê as variáveis de .env.local, que não vai para o git. Nenhuma chave secreta
 * é usada nem necessária aqui — é exatamente o que um visitante consegue fazer.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

function readEnv() {
  try {
    return Object.fromEntries(
      readFileSync(path.join(ROOT, '.env.local'), 'utf8')
        .split(/\r?\n/)
        .filter((line) => line.includes('=') && !line.trim().startsWith('#'))
        .map((line) => {
          const i = line.indexOf('=')
          return [line.slice(0, i).trim(), line.slice(i + 1).trim()]
        }),
    )
  } catch {
    return {}
  }
}

const env = readEnv()
const URL_BASE = env['VITE_SUPABASE_URL']
const KEY = env['VITE_SUPABASE_PUBLISHABLE_KEY']

if (!URL_BASE || !KEY) {
  console.error('Faltam VITE_SUPABASE_URL e/ou VITE_SUPABASE_PUBLISHABLE_KEY em .env.local.')
  process.exit(1)
}

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` }
const results = []

async function check(label, expected, run) {
  try {
    const ok = await run()
    results.push({ label, ok, expected })
  } catch (error) {
    results.push({ label, ok: false, expected, note: error.message })
  }
}

await check('tabela projects acessível', 'leitura anônima responde', async () => {
  const r = await fetch(`${URL_BASE}/rest/v1/projects?select=id&limit=1`, { headers })
  return r.ok
})

await check('bucket portfolio existe', 'listagem responde', async () => {
  const r = await fetch(`${URL_BASE}/storage/v1/object/list/portfolio`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: '', limit: 1 }),
  })
  return r.ok
})

await check('login exige credencial válida', 'rejeita senha inventada', async () => {
  const r = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ninguem@exemplo.invalido', password: 'nao-existe' }),
  })
  return r.status === 400
})

await check('RLS bloqueia INSERT anônimo', 'recusa a escrita', async () => {
  const r = await fetch(`${URL_BASE}/rest/v1/projects`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ title: 'rls-check', category: 'x', year: 2024, image_path: 'x' }),
  })
  return r.status === 401 || r.status === 403
})

await check('RLS bloqueia upload anônimo', 'recusa o arquivo', async () => {
  const r = await fetch(`${URL_BASE}/storage/v1/object/portfolio/rls-check.txt`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'text/plain' },
    body: 'x',
  })
  return !r.ok
})

// DELETE sob RLS não dá erro: as linhas sem permissão simplesmente não são
// alcançadas. Por isso comparamos a contagem antes e depois.
await check('RLS bloqueia DELETE anônimo', 'nenhuma linha some', async () => {
  const count = async () => {
    const r = await fetch(`${URL_BASE}/rest/v1/projects?select=id`, { headers })
    return ((await r.json()) ?? []).length
  }
  const before = await count()
  if (before === 0) throw new Error('inconclusivo: cadastre um projeto e rode de novo')
  await fetch(`${URL_BASE}/rest/v1/projects?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: 'DELETE',
    headers,
  })
  return (await count()) === before
})

let failed = 0
for (const { label, ok, expected, note } of results) {
  const mark = ok ? 'ok  ' : note ? '??  ' : 'FALHA'
  if (!ok && !note) failed++
  console.log(`${mark} ${label.padEnd(32)} ${note ?? expected}`)
}

console.log(
  failed === 0
    ? '\nSupabase configurado corretamente.'
    : `\n${failed} verificação(ões) falharam — revise supabase/schema.sql.`,
)
process.exit(failed === 0 ? 0 : 1)
