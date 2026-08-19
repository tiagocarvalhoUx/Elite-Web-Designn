import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase do navegador.
 *
 * Usa exclusivamente a publishable key — ela é feita para ser pública e só
 * consegue o que as políticas de RLS permitirem. A secret key (`sb_secret_…`)
 * ignora RLS e jamais pode chegar ao bundle do frontend.
 *
 * Enquanto as variáveis não estiverem definidas, `supabase` é `null` e a
 * aplicação segue funcionando com os dados estáticos.
 */

const url = import.meta.env['VITE_SUPABASE_URL'] as string | undefined
const publishableKey = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined

export const isSupabaseConfigured = Boolean(url && publishableKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, publishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null

/** Uso em código que só roda depois de confirmar a configuração. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY em .env.local.',
    )
  }
  return supabase
}
