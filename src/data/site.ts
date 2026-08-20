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

/** Formato internacional, só dígitos: 55 (Brasil) + 18 (DDD) + número. */
const WHATSAPP_E164 = '5518981142927'

export const WHATSAPP_MESSAGE =
  'Olá! Vim pelo site da Elite Web Designer e gostaria de solicitar uma proposta.'

export const site = {
  name: 'Elite Web Designer',
  tagline: 'Presença digital de excelência',
  location: 'Araçatuba — SP, Brasil',
  locationShort: 'Araçatuba — Brasil',
  email: 'eliteprimestoreselite@gmail.com',
  phoneDisplay: '(18) 98114-2927',
  whatsappUrl: `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  foundedYear: 2024,
} as const

export const socialLinks: readonly SocialLink[] = [
  // TODO: preencher com os perfis reais para que apareçam no rodapé.
  { id: 'instagram', label: 'Instagram', href: '' },
  { id: 'linkedin', label: 'LinkedIn', href: '' },
  { id: 'whatsapp', label: 'WhatsApp', href: site.whatsappUrl },
]
