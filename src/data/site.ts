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

/**
 * Link do WhatsApp com a mensagem já escrita.
 *
 * É o que permite a conversa nascer com contexto: a primeira mensagem que
 * chega diz qual plano a pessoa escolheu, em vez de um "olá" solto que obriga
 * a perguntar tudo de novo. Como quem envia é o cliente, a conversa fica
 * aberta dos dois lados sem depender de API, número dedicado ou aprovação de
 * modelo pela Meta.
 */
export function whatsappUrlWith(message: string): string {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`
}

export const site = {
  name: 'Elite Web Designer',
  tagline: 'Presença digital de excelência',
  location: 'Araçatuba — SP, Brasil',
  locationShort: 'Araçatuba — Brasil',
  email: 'eliteprimestoreselite@gmail.com',
  phoneDisplay: '(18) 98114-2927',
  whatsappUrl: whatsappUrlWith(WHATSAPP_MESSAGE),
  foundedYear: 2024,
} as const

export const socialLinks: readonly SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/elite_webdesigner/',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61591613620551',
  },
  { id: 'whatsapp', label: 'WhatsApp', href: site.whatsappUrl },
]
