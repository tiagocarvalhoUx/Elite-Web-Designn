import type { IconName } from '@/types/icon'

export interface Service {
  readonly id: string
  readonly roman: string
  readonly icon: IconName
  readonly title: string
  readonly description: string
  readonly features: readonly string[]
}

export const services: readonly Service[] = [
  {
    id: 'sites',
    roman: 'I',
    icon: 'globe',
    title: 'Sites institucionais',
    description: 'Websites profissionais que representam sua marca com excelência e credibilidade.',
    features: ['Design responsivo', 'SEO otimizado', 'Alta performance', 'CMS integrado'],
  },
  {
    id: 'ecommerce',
    roman: 'II',
    icon: 'bag',
    title: 'E-commerce',
    description: 'Lojas virtuais completas para vender seus produtos 24 horas por dia.',
    features: ['Pagamento integrado', 'Gestão de estoque', 'Relatórios', 'Cupons e promoções'],
  },
  {
    id: 'apps',
    roman: 'III',
    icon: 'mobile',
    title: 'Aplicativos mobile',
    description: 'Apps nativos e híbridos para iOS e Android que engajam seus usuários.',
    features: ['iOS e Android', 'Push notifications', 'Offline first', 'UI/UX nativo'],
  },
  {
    id: 'sistemas',
    roman: 'IV',
    icon: 'layers',
    title: 'Sistemas web',
    description: 'Sistemas customizados para automatizar e otimizar seus processos.',
    features: ['Painel administrativo', 'API REST', 'Autenticação', 'Relatórios avançados'],
  },
  {
    id: 'landing',
    roman: 'V',
    icon: 'bolt',
    title: 'Landing pages',
    description: 'Páginas de alta conversão para campanhas e lançamentos.',
    features: ['Alta conversão', 'Teste A/B', 'Analytics', 'Formulários inteligentes'],
  },
  {
    id: 'seo',
    roman: 'VI',
    icon: 'chart',
    title: 'SEO e marketing',
    description: 'Estratégias digitais para aumentar sua visibilidade online.',
    features: ['SEO técnico', 'Google Ads', 'Analytics', 'Redes sociais'],
  },
]
