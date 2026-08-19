/**
 * Fonte única de verdade para identidade e contato.
 * Trocar um dado aqui atualiza header, formulário, footer e schema.org.
 */

import type { IconName } from '@/types/icon'

export interface SocialLink {
  readonly id: IconName
  readonly label: string
  /** Vazio = ainda não configurado; o link não é renderizado (evita link quebrado). */
  readonly href: string
}

/** TODO: substituir pelo número real antes de publicar (formato internacional, só dígitos). */
const WHATSAPP_E164 = '5518999999999'

export const WHATSAPP_MESSAGE =
  'Olá! Vim pelo site da Elite Web Designer e gostaria de solicitar uma proposta.'

export const site = {
  name: 'Elite Web Designer',
  tagline: 'Presença digital de excelência',
  location: 'Araçatuba — SP, Brasil',
  locationShort: 'Araçatuba — Brasil',
  email: 'eliteprimestoreselite@gmail.com',
  /** TODO: alinhar com WHATSAPP_E164 quando o número real for definido. */
  phoneDisplay: '(18) 9 9999-9999',
  whatsappUrl: `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  foundedYear: 2024,
} as const

export const socialLinks: readonly SocialLink[] = [
  // TODO: preencher com os perfis reais para que apareçam no rodapé.
  { id: 'instagram', label: 'Instagram', href: '' },
  { id: 'linkedin', label: 'LinkedIn', href: '' },
  { id: 'whatsapp', label: 'WhatsApp', href: site.whatsappUrl },
]
